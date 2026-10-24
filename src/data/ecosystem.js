export const ecosystemGroups = [
  {
    id: "main",
    title: "Những thế giới của Ốc",
    description:
      "Gaming là điểm hẹn chính. Những chuyến đi, âm nhạc và các dự án khác mở ra nhiều câu chuyện hơn.",
  },
  {
    id: "shared",
    title: "Những dự án cùng nhau",
    description:
      "Những không gian được xây dựng cùng người thương và những người bạn.",
  },
  {
    id: "friends",
    title: "Bạn bè của Ốc",
    description:
      "Ghé YouTube của những người bạn, xem một video và gửi họ một lời chào nhé.",
  },
];

export const platformLabels = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Fanpage",
  instagram: "Instagram",
  facebookGroup: "Group Facebook",
  discord: "Discord",
  spotify: "Spotify",
  appleMusic: "Apple Music",
};

export const defaultBrands = [
  {
    id: "ocvoivoii-gaming",
    name: "Ocvoivoii Gaming",
    description:
      "Game, livestream và những chiếc kèo cộng đồng. Cùng Ốc lên sàn tại Ốc Thượng Đài.",
    group: "main",
    order: 10,
    visible: true,
    platforms: ["youtube", "tiktok", "facebook", "facebookGroup", "discord"],
    links: {
      youtube: "https://www.youtube.com/@OcvoivoiiGaming",
      tiktok: "https://www.tiktok.com/@ocvoivoii.gaming",
      facebook: "https://www.facebook.com/ocvoivoii.gaming",
      facebookGroup: "",
      discord: "",
    },
  },
  {
    id: "oc-du-ky",
    name: "Ốc Du Ký",
    description:
      "Những chuyến đi, trải nghiệm và câu chuyện được mang về từ mỗi cung đường.",
    group: "main",
    order: 20,
    visible: true,
    platforms: ["youtube", "facebook", "instagram", "tiktok"],
    links: { youtube: "", facebook: "", instagram: "", tiktok: "" },
  },
  {
    id: "zwhis",
    name: "zWhis",
    description:
      "Những điều được kể bằng giai điệu. Nghe các sản phẩm âm nhạc và theo dõi hành trình sáng tác.",
    group: "main",
    order: 30,
    visible: true,
    platforms: [
      "spotify",
      "appleMusic",
      "youtube",
      "facebook",
      "tiktok",
      "instagram",
    ],
    links: {
      spotify: "",
      appleMusic: "",
      youtube: "",
      facebook: "",
      tiktok: "",
      instagram: "",
    },
  },
  {
    id: "oc-ban-rong",
    name: "Ốc Bán Rong",
    description:
      "Gi gỉ gì gi cái gì cũng bán. Ghé xem những món hàng và câu chuyện bán rong của Ốc.",
    group: "main",
    order: 40,
    visible: true,
    platforms: ["facebook", "tiktok", "instagram"],
    links: { facebook: "", tiktok: "", instagram: "" },
  },
  {
    id: "chuyen-miu-va-oc",
    name: "chuyện miu & ốc",
    description:
      "Những câu chuyện đời thường và khoảnh khắc được lưu lại cùng người thương.",
    group: "shared",
    order: 50,
    visible: true,
    platforms: ["youtube"],
    links: { youtube: "" },
  },
  {
    id: "hang-ocvoivoii-music",
    name: "Hang Ocvoivoii",
    description:
      "Nhạc & Demo · Góc âm nhạc chung của nhóm, nơi những bản thu và ý tưởng được chia sẻ.",
    group: "shared",
    order: 60,
    visible: true,
    platforms: ["youtube"],
    links: { youtube: "" },
  },
  {
    id: "nguoi-ngheo-di-bui",
    name: "Người nghèo đi bụi",
    description:
      "Một kênh YouTube của bạn Ốc. Ghé xem và ủng hộ những câu chuyện trên kênh nhé.",
    group: "friends",
    order: 70,
    visible: true,
    platforms: ["youtube"],
    links: { youtube: "" },
  },
  {
    id: "lem-geng-gau-gau",
    name: "lem gẻng gâu gâu",
    description:
      "Một kênh YouTube của bạn Ốc. Thêm một góc nhỏ để khám phá và kết nối.",
    group: "friends",
    order: 80,
    visible: true,
    platforms: ["youtube"],
    links: { youtube: "" },
  },
];

const allowedHosts = {
  youtube: ["youtube.com", "youtu.be"],
  tiktok: ["tiktok.com"],
  facebook: ["facebook.com", "fb.com", "fb.me"],
  facebookGroup: ["facebook.com"],
  instagram: ["instagram.com"],
  discord: ["discord.gg", "discord.com"],
  spotify: ["spotify.com"],
  appleMusic: ["music.apple.com"],
};

export function validatePlatformUrl(platform, value) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (allowedHosts[platform] || []).some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

export function normalizeBrand(brand) {
  return {
    name: brand.name.trim(),
    description: brand.description.trim(),
    group: brand.group,
    order: Number(brand.order),
    visible: Boolean(brand.visible),
    platforms: [...brand.platforms],
    links: Object.fromEntries(
      brand.platforms.map((platform) => [
        platform,
        (brand.links[platform] || "").trim(),
      ]),
    ),
  };
}

export function validateBrand(brand) {
  if (!brand.name.trim() || brand.name.trim().length > 100)
    return "Tên phải có từ 1 đến 100 ký tự.";
  if (!brand.description.trim() || brand.description.trim().length > 600)
    return "Mô tả phải có từ 1 đến 600 ký tự.";
  if (!ecosystemGroups.some((group) => group.id === brand.group))
    return "Nhóm hiển thị không hợp lệ.";
  if (
    !Number.isInteger(Number(brand.order)) ||
    Number(brand.order) < 0 ||
    Number(brand.order) > 9999
  )
    return "Thứ tự phải là số nguyên từ 0 đến 9999.";
  for (const platform of brand.platforms) {
    const url = brand.links[platform] || "";
    if (url.length > 2048 || !validatePlatformUrl(platform, url))
      return `Liên kết ${platformLabels[platform]} cần dùng HTTPS và đúng nền tảng.`;
  }
  return "";
}

export function getGamingChannels(brands) {
  const gaming = brands.find((brand) => brand.id === "ocvoivoii-gaming");
  if (!gaming) return [];
  return gaming.platforms.map((platform) => ({
    id: platform,
    label: platformLabels[platform],
    url: gaming.links[platform] || null,
  }));
}
