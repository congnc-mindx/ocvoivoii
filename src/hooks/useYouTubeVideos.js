import { useEffect, useState } from "react";

function parseFeed(data) {
  const validStructure =
    data?.schemaVersion === 1 &&
    /^UC[A-Za-z0-9_-]{22}$/.test(data.channelId ?? "") &&
    Array.isArray(data.items) &&
    data.items.length > 0 &&
    data.items.length <= 3;

  if (!validStructure) {
    throw new Error("invalid-feed");
  }

  const validVideos = data.items.every(
    (video) =>
      /^[A-Za-z0-9_-]{11}$/.test(video.id ?? "") &&
      typeof video.title === "string" &&
      video.title.trim() &&
      Number.isFinite(Date.parse(video.publishedAt)),
  );

  const unique =
    new Set(data.items.map((video) => video.id)).size === data.items.length;

  if (!validVideos || !unique) {
    throw new Error("invalid-feed");
  }

  return {
    videos: [...data.items].sort(
      (first, second) =>
        Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
    ),
    channelUrl: `https://www.youtube.com/channel/${data.channelId}`,
  };
}

export default function useYouTubeVideos() {
  const [state, setState] = useState({
    videos: [],
    channelUrl: "",
    loading: true,
    error: "",
  });

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    let controller;

    async function refresh() {
      controller?.abort();

      const current = new AbortController();
      controller = current;

      const timer = window.setTimeout(() => current.abort(), 15000);

      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}youtube-videos.json`,
          {
            signal: current.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("http-error");
        }

        const next = parseFeed(await response.json());

        if (active && controller === current) {
          setState({
            ...next,
            loading: false,
            error: "",
          });
        }
      } catch {
        if (active && controller === current) {
          setState((previous) => ({
            ...previous,
            loading: false,
            error:
              "Chưa tải được video mới. Bạn có thể thử lại hoặc xem trực tiếp trên YouTube.",
          }));
        }
      } finally {
        window.clearTimeout(timer);
      }
    }

    function refreshVisible() {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    refresh();

    const interval = window.setInterval(refreshVisible, 30 * 60 * 1000);

    document.addEventListener("visibilitychange", refreshVisible);

    return () => {
      active = false;
      controller?.abort();

      window.clearInterval(interval);

      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, [revision]);

  return {
    ...state,
    retry: () => setRevision((current) => current + 1),
  };
}
