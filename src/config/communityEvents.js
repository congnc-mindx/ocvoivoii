// src/config/communityEvents.js

export const COMMUNITY_SCHEMA_VERSION = 1;

export const COMMUNITY_TIME_ZONE = "Asia/Ho_Chi_Minh";

export const EVENT_IDS = {
  SOLO: "doc-co-cau-bai",
  FIVE_V_FIVE: "thap-dien-mai-phuc",
  NIGHT_MARKET: "night-market",
};
export const TOURNAMENT_SERVER_OPTIONS = [
  { value: "singapore", label: "Singapore" },
  { value: "hong-kong", label: "Hong Kong" },
  { value: "tokyo", label: "Tokyo" },
];

export const TOURNAMENT_SERVER_FIELD = {
  name: "preferredServer",
  label: "Máy chủ bạn muốn thi đấu",
  description:
    "Kiểm tra ping trong VALORANT rồi chọn máy chủ phù hợp với bạn. BTC sẽ thông báo máy chủ thi đấu chính thức khi sắp xếp trận.",
  required: true,
};

export const COMMUNITY_EVENTS = [
  {
    id: EVENT_IDS.SOLO,
    kind: "tournament",
    title: "Độc Cô Cầu Bại",
    subtitle: "Ốc Thượng Đài · Solo dao 1v1",
    description:
      "Giải cỏ 1v1 với 16 suất chính thức, xét theo thứ tự gửi đăng ký và điều kiện tham gia.",
    scheduleLabel: "12h30 thứ Sáu",
    schedule: {
      weekday: 5,
      hour: 12,
      minute: 30,
      timeZone: COMMUNITY_TIME_ZONE,
    },
    officialCapacity: 16,
    minimumDiscordLevel: 3,
    serverSelection: {
      required: true,
      allowedValues: ["singapore", "hong-kong", "tokyo"],
    },
    rulesPath: "/rules?tab=one-v-one",
    levelQuestion:
      "Bạn có chắc rằng mình đạt tối thiểu LEVEL 3 trong kênh Discord của Hang Ocvoivoii không?",
    levelOptions: [
      {
        value: "claimed_eligible",
        label: "Xờii đây thừa luôn, nháa",
        submissionAllowed: true,
        reviewRequired: true,
      },
      {
        value: "request_review",
        label: "Tạo ticket nhờ MOD check",
        submissionAllowed: true,
        reviewRequired: true,
      },
    ],
    rewardCategories: [],
  },

  {
    id: EVENT_IDS.FIVE_V_FIVE,
    kind: "tournament",
    title: "Thập Diện Mai Phục",
    subtitle: "Ốc Thượng Đài · Custom 5v5",
    description:
      "Đăng ký từng người với 10 suất chính thức và danh sách dự bị.",
    scheduleLabel: "19h00 thứ Bảy",
    schedule: {
      weekday: 6,
      hour: 19,
      minute: 0,
      timeZone: COMMUNITY_TIME_ZONE,
    },
    officialCapacity: 10,
    minimumDiscordLevel: 5,
    serverSelection: {
      required: true,
      allowedValues: ["singapore", "hong-kong", "tokyo"],
    },
    rulesPath: "/rules?tab=five-v-five",
    levelQuestion:
      "Bạn có chắc rằng mình đạt tối thiểu LEVEL 5 trong kênh Discord của Hang Ocvoivoii không?",
    levelOptions: [
      {
        value: "claimed_eligible",
        label: "Xờii đây thừa luôn, nháa",
        submissionAllowed: true,
        reviewRequired: true,
      },
      {
        value: "not_eligible",
        label: "Thồi, phải ngồi tám chuyện với AE để cày cấp vậy",
        submissionAllowed: false,
        reviewRequired: false,
      },
    ],
    rewardCategories: ["Deathmatch", "MVP", "Đội chiến thắng"],
  },

  {
    id: EVENT_IDS.NIGHT_MARKET,
    kind: "community",
    title: "Mở Night Market cùng Ocvoivoii",
    subtitle: "Cùng mở chợ đêm trên sóng",
    description:
      "Chia sẻ màn hình qua Discord để cùng Ốc khám phá Night Market của bạn.",
    scheduleLabel: "Theo lịch livestream được công bố",
    schedule: null,
    officialCapacity: null,
    minimumDiscordLevel: null,
    rulesPath: null,
    participationMode: "screen_share",
    interactionOptions: [
      {
        value: "voice_and_screen",
        label: "Có cả hai",
        submissionAllowed: true,
      },
      {
        value: "screen_only",
        label: "Chỉ chia sẻ màn hình",
        submissionAllowed: true,
      },
      {
        value: "unavailable",
        label: "Không thể",
        submissionAllowed: false,
      },
    ],
    appearanceConsentOptions: [
      { value: "yes", label: "Có" },
      { value: "no", label: "Không" },
    ],
    responsibilityOptions: [
      { value: "agree", label: "Đồng ý" },
      { value: "disagree", label: "Không đồng ý" },
    ],
  },
];

export const RULES_ACCEPTANCE_LABEL =
  "Tôi đã đọc, hiểu và đồng ý tuân thủ luật thi đấu";

export const FEEDBACK_EVENT_OPTIONS = COMMUNITY_EVENTS.filter(
  (event) => event.kind === "tournament",
).map((event) => ({
  value: event.id,
  label: event.title,
}));

export const FEEDBACK_ROLE_OPTIONS = [
  { value: "player", label: "Tuyển thủ (Player)" },
  { value: "viewer", label: "Khán giả (Viewer)" },
  { value: "general", label: "Góp ý chung cho BTC" },
];

export const COMMUNITY_FIELD_LIMITS = {
  riotId: 100,
  discordIdentity: 100,
  displayName: 100,
  imageUrl: 2048,
  message: 2000,
  feedbackText: 3000,
};

export function getCommunityEvent(eventId) {
  return COMMUNITY_EVENTS.find((event) => event.id === eventId) ?? null;
}

export function getTournamentServerOptions(eventId) {
  const event = getCommunityEvent(eventId);
  const allowedValues = event?.serverSelection?.allowedValues ?? [];

  return TOURNAMENT_SERVER_OPTIONS.filter((option) =>
    allowedValues.includes(option.value),
  );
}

export function validatePreferredServer(eventId, value) {
  const event = getCommunityEvent(eventId);

  if (!event || event.kind !== "tournament") {
    return "";
  }

  if (typeof value !== "string" || !value.trim()) {
    return "Bạn vui lòng chọn máy chủ muốn thi đấu.";
  }

  const isAllowed = getTournamentServerOptions(eventId).some(
    (option) => option.value === value,
  );

  return isAllowed
    ? ""
    : "Máy chủ này hiện không nằm trong danh sách cho phép của giải.";
}
