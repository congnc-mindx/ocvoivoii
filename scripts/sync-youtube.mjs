import { mkdir, writeFile, rename } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const outputPath = fileURLToPath(
  new URL("../public/youtube-videos.json", import.meta.url),
);

const MIN_VIDEO_DURATION_SECONDS = 180;

function durationToSeconds(duration) {
  const match = String(duration ?? "").match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/,
  );

  if (!match) return 0;

  return (
    Number(match[1] ?? 0) * 86400 +
    Number(match[2] ?? 0) * 3600 +
    Number(match[3] ?? 0) * 60 +
    Number(match[4] ?? 0)
  );
}

export async function fetchLatestVideos({
  apiKey,
  channelHandle = "@OcvoivoiiGaming",
  fetchImpl = fetch,
}) {
  if (!apiKey?.trim()) {
    throw new Error("Chưa cấu hình YOUTUBE_API_KEY.");
  }

  async function api(resource, params) {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);

    url.search = new URLSearchParams({
      ...params,
      key: apiKey,
    }).toString();

    let response;

    try {
      response = await fetchImpl(url, {
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new Error(
        "Không kết nối được YouTube API trong thời gian cho phép.",
      );
    }

    if (!response.ok) {
      throw new Error(
        `YouTube API trả về HTTP ${response.status}. Kiểm tra API key, quyền API và hạn mức.`,
      );
    }

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("YouTube API trả về dữ liệu không hợp lệ.");
    }

    if (!Array.isArray(data.items)) {
      throw new Error("YouTube API không trả về danh sách hợp lệ.");
    }

    return data;
  }

  const channels = await api("channels", {
    part: "snippet,contentDetails",
    forHandle: channelHandle,
  });

  const channel = channels.items[0];
  const playlistId = channel?.contentDetails?.relatedPlaylists?.uploads;

  if (!channel?.id || !playlistId) {
    throw new Error(
      "Không tìm thấy kênh hoặc playlist uploads. Kiểm tra YOUTUBE_CHANNEL_HANDLE.",
    );
  }

  const found = new Map();
  let pageToken = "";

  for (let page = 0; page < 3; page += 1) {
    const playlist = await api("playlistItems", {
      part: "contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });

    const ids = [
      ...new Set(
        playlist.items
          .map((item) => item.contentDetails?.videoId)
          .filter((id) => /^[A-Za-z0-9_-]{11}$/.test(id ?? "")),
      ),
    ];

    if (ids.length) {
      const videos = await api("videos", {
        part: "snippet,status,contentDetails,liveStreamingDetails",
        id: ids.join(","),
      });

      for (const video of videos.items) {
        const snippet = video.snippet;
        const status = video.status;

        const valid =
          /^[A-Za-z0-9_-]{11}$/.test(video.id ?? "") &&
          snippet?.channelId === channel.id &&
          status?.privacyStatus === "public" &&
          status.embeddable === true &&
          snippet.title?.trim() &&
          Number.isFinite(Date.parse(snippet.publishedAt));

        if (!valid) continue;
        const durationSeconds = durationToSeconds(
          video.contentDetails?.duration,
        );

        if (durationSeconds <= MIN_VIDEO_DURATION_SECONDS) {
          continue;
        }

        if (
          snippet.liveBroadcastContent === "upcoming" ||
          snippet.liveBroadcastContent === "live"
        ) {
          continue;
        }

        if (
          video.liveStreamingDetails &&
          !video.liveStreamingDetails.actualEndTime
        ) {
          continue;
        }

        found.set(video.id, {
          id: video.id,
          title: snippet.title.trim(),
          publishedAt: snippet.publishedAt,
        });
      }
    }

    pageToken = playlist.nextPageToken ?? "";

    if (!pageToken) break;
  }

  const items = [...found.values()]
    .sort(
      (first, second) =>
        Date.parse(second.publishedAt) - Date.parse(first.publishedAt) ||
        first.id.localeCompare(second.id),
    )
    .slice(0, 3);

  if (!items.length) {
    throw new Error(
      "Không tìm thấy video công khai có thể nhúng. Dừng cập nhật để giữ website đang hoạt động.",
    );
  }

  return {
    schemaVersion: 1,
    channelId: channel.id,
    channelTitle: channel.snippet?.title ?? "Ocvoivoii Gaming",
    channelUrl: `https://www.youtube.com/channel/${channel.id}`,
    updatedAt: new Date().toISOString(),
    items,
  };
}

async function main() {
  const data = await fetchLatestVideos({
    apiKey: process.env.YOUTUBE_API_KEY,
    channelHandle:
      process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || "@OcvoivoiiGaming",
  });

  await mkdir(dirname(outputPath), { recursive: true });

  const temporary = `${outputPath}.tmp`;

  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  await rename(temporary, outputPath);

  console.log(`Đã đồng bộ ${data.items.length} video từ ${data.channelTitle}.`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
