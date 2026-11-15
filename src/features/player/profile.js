export const PROFILE_COLLECTION = "player_profiles";

export const playerFields = [
  { name: "fullName", label: "Họ và tên", maxLength: 100, autoComplete: "name" },
  { name: "rank", label: "Rank hiện tại", options: ["Unranked", ...["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal"].flatMap(rank => [1, 2, 3].map(tier => rank + " " + tier)), "Radiant"] },
  { name: "gender", label: "Giới tính", options: ["Nam", "Nữ", "Khác", "Không muốn tiết lộ"] },
  { name: "role", label: "Vai trò in-game", options: ["Duelist", "Controller", "Initiator", "Sentinel", "Flex"] },
  { name: "riotId", label: "Ingame + Tagline", placeholder: "Ocvoivoii#VN1", maxLength: 64, autoCapitalize: "none" },
  { name: "discordId", label: "ID người dùng Discord", placeholder: "Dán ID dạng số", inputMode: "numeric" },
  { name: "trackerUrl", label: "Link Tracker.gg", type: "url", placeholder: "https://tracker.gg/valorant/profile/riot/…", maxLength: 500, wide: true },
  { name: "facebookUrl", label: "Link Facebook cá nhân", type: "url", placeholder: "https://www.facebook.com/…", maxLength: 500, wide: true },
];

export function discordInvite(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.port || url.username || url.password) return "";
    const pattern = url.hostname === "discord.gg" ? /^\/[A-Za-z0-9-]+\/?$/ : /^\/invite\/[A-Za-z0-9-]+\/?$/;
    return ["discord.gg", "discord.com", "www.discord.com"].includes(url.hostname) && pattern.test(url.pathname) ? url.href : "";
  } catch { return ""; }
}

export function normalizeDiscordId(value) {
  const text = String(value ?? "").trim();
  const mention = text.match(/^<@!?(\d{17,20})>$/);
  if (mention) return mention[1];
  return text.replace(/\s|\u200B|\u200C|\u200D/gu, "");
}

export function discordIdError(value) {
  const id = normalizeDiscordId(value);
  if (!id) return "Dán ID của bạn từ mục Sao chép ID người dùng.";
  if (!/^\d+$/.test(id)) return "Có vẻ bạn đã dán tên hoặc link. Hãy chọn Sao chép ID người dùng trong Discord.";
  if (!/^\d{17,20}$/.test(id)) return "ID này chưa đủ hoặc có quá nhiều chữ số. Hãy sao chép lại toàn bộ ID.";
  return "";
}

export function validatePlayerProfile(input) {
  const data = Object.fromEntries(playerFields.map(({ name }) => [name, String(input[name] ?? "").trim()]));
  data.discordId = normalizeDiscordId(input.discordId);
  data.discordJoined = input.discordJoined === true;
  const errors = {};
  for (const field of playerFields) {
    const value = data[field.name];
    if (!value || (field.maxLength && value.length > field.maxLength) || (field.options && !field.options.includes(value))) {
      errors[field.name] = "Vui lòng nhập hoặc chọn " + field.label.toLowerCase() + ".";
    }
  }
  if (data.fullName.length < 2 || /\p{Cc}/u.test(data.fullName)) errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";
  const riotValid = /^[^#\s][^#\r\n]{2,15}#[A-Za-z0-9]{3,5}$/.test(data.riotId) &&
    !/\s#|\p{Cc}/u.test(data.riotId);
  if (!riotValid) errors.riotId = "Nhập đúng dạng Tên#Tag, ví dụ Ocvoivoii#VN1.";
  const idProblem = discordIdError(data.discordId);
  if (idProblem) errors.discordId = idProblem;
  function link(value, hosts) {
    const url = new URL(value);
    if (url.protocol !== "https:" || !hosts.includes(url.hostname) || url.username || url.password || url.port) throw Error();
    return url;
  }
  if (!errors.trackerUrl) {
    try {
      const url = link(data.trackerUrl, ["tracker.gg"]);
      const match = url.pathname.match(/^\/valorant\/profile\/riot\/([^/]+)(?:\/overview)?\/?$/);
      const normalize = text => text.normalize("NFKC").toLowerCase();
      if (!match || normalize(decodeURIComponent(match[1])) !== normalize(data.riotId)) throw Error();
      data.trackerUrl = "https://tracker.gg/valorant/profile/riot/" + encodeURIComponent(data.riotId) + "/overview";
      if (data.trackerUrl.length > 500) throw Error();
    } catch { errors.trackerUrl = "Dùng link hồ sơ VALORANT trên Tracker.gg khớp Ingame + Tagline."; }
  }
  if (!errors.facebookUrl) {
    try {
      const url = link(data.facebookUrl, ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com"]);
      if (url.pathname === "/") throw Error();
      data.facebookUrl = url.href;
      if (data.facebookUrl.length > 500) throw Error();
    } catch { errors.facebookUrl = "Nhập link Facebook cá nhân hợp lệ (HTTPS)."; }
  }
  if (!data.discordJoined) errors.discordJoined = "Hãy tham gia Hang Ocvoivoii rồi đánh dấu xác nhận.";
  return { data, errors };
}
