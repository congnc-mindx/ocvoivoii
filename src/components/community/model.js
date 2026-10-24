import {
  COMMUNITY_EVENTS,
  EVENT_IDS,
  TOURNAMENT_SERVER_OPTIONS,
} from "../../config/communityEvents";

export { COMMUNITY_EVENTS, EVENT_IDS };

export const option = (value, label) => ({ value, label });

export const YES_NO = [option("yes", "Có"), option("no", "Không")];

export const ROLES = [
  option("player", "Tuyển thủ"),
  option("viewer", "Khán giả"),
  option("general", "Góp ý chung cho BTC"),
];

export const ISSUES = [
  option("registration", "Thời gian đăng ký"),
  option("schedule", "Lịch thi đấu"),
  option("lobby", "Check-in / Lobby"),
  option("fairness", "Sự công bằng xử phạt"),
  option("balance", "Trình độ lệch"),
  option("other", "Vấn đề khác"),
];

export const RETENTION = [
  option("expertise", "Caster chuyên môn"),
  option("humor", "Caster tấu hài"),
  option("observer", "Góc máy Observer"),
  option("schedule", "Khung giờ"),
  option("interaction", "Tương tác với khán giả"),
];

export const MEDIA = [
  option("fast", "Rất nhanh & dễ theo dõi"),
  option("normal", "Bình thường"),
  option("slow", "Khá chậm & khó tìm thông tin"),
];

export const FORMATS = [
  option("keep", "Giữ nguyên"),
  option("expand", "Mở rộng suất"),
  option("mix", "Random Team / Mix player"),
  option("other_game", "Game khác"),
];

export const STATUS = [
  option("pending", "Chờ xét duyệt"),
  option("confirmed", "Suất chính thức"),
  option("backup", "Dự bị"),
  option("rejected", "Không duyệt"),
];

const field = (name, label, type = "text", extra = {}) => ({
  name,
  label,
  type,
  required: true,
  maxLength: 100,
  ...extra,
});

const note = field("message", "Lời nhắn gửi BTC", "textarea", {
  required: false,
  maxLength: 2000,
});

const rating = (name, label) =>
  field(name, label, "select", {
    numeric: true,
    options: [1, 2, 3, 4, 5].map((number) =>
      option(String(number), `${number} / 5`),
    ),
  });

export function registrationFields(eventId) {
  if (eventId === EVENT_IDS.NIGHT_MARKET) {
    return [
      field("displayName", "Tên muốn gọi trên stream"),
      field("discordIdentity", "Username trên Discord"),
      field(
        "interaction",
        "Có thể vào voice và chia sẻ màn hình không?",
        "select",
        {
          options: [
            option("voice_and_screen", "Có cả hai"),
            option("screen_only", "Chỉ chia sẻ màn hình"),
            option("unavailable", "Không thể"),
          ],
        },
      ),
      field(
        "appearanceConsent",
        "Đồng ý xuất hiện trên livestream và video cắt lại?",
        "select",
        { options: YES_NO },
      ),
      field(
        "responsibilityConsent",
        "Tôi tự đăng nhập, giữ quyền kiểm soát và chịu trách nhiệm bảo mật tài khoản của mình",
        "checkbox",
      ),
      note,
    ];
  }

  return [
    field("riotId", "Ingame + tagline", "text", {
      hint: "Ví dụ: Ocvoivoii#ovv",
    }),
    field("discordIdentity", "ID Discord", "text", {
      hint: "Nhập ID người dùng Discord dạng số, không phải tên hiển thị.",
    }),
    field("preferredServer", "Máy chủ bạn muốn thi đấu", "select", {
      options: TOURNAMENT_SERVER_OPTIONS,
    }),
    field("roleClaim", "Tình trạng role Ốc Tráng Sĩ của bạn", "select", {
      options: [
        option("has_role", "Tôi đã có role Ốc Tráng Sĩ"),
        option("request_review", "Tôi cần MOD kiểm tra / hướng dẫn cấp role"),
      ],
    }),
    field(
      "rulesAccepted",
      "Tôi đã đọc, hiểu và đồng ý tuân thủ luật thi đấu",
      "checkbox",
    ),
    field("imageUrl", "Link ảnh để BTC làm bài chúc mừng", "url", {
      required: false,
      maxLength: 2048,
      hint: "Link HTTPS có quyền xem. Chỉ gửi ảnh bạn cho phép BTC sử dụng.",
    }),
    note,
  ];
}

export function feedbackFields(role) {
  const branch =
    role === "player"
      ? [
          rating("formatRating", "Thể thức & luật thi đấu"),
          rating("adminRating", "Trải nghiệm làm việc với Admin / Ocvoivoii"),
          field("issues", "Khâu gây ức chế / cần cải thiện", "multi", {
            required: false,
            options: ISSUES,
          }),
          field("solutions", "Giải pháp cho mùa sau", "textarea", {
            required: false,
            maxLength: 3000,
          }),
        ]
      : role === "viewer"
        ? [
            rating("streamRating", "Chất lượng nhìn & nghe trên livestream"),
            rating("casterRating", "Màn thể hiện của Caster & Observer"),
            field("retention", "Yếu tố giúp bạn xem stream lâu hơn", "multi", {
              required: false,
              options: RETENTION,
            }),
          ]
        : [];

  return [
    field("role", "Bạn tham gia với vai trò nào?", "select", {
      options: ROLES,
    }),
    ...branch,
    field("mediaUpdate", "Cập nhật thông tin trên truyền thông", "select", {
      options: MEDIA,
    }),
    field("nextFormat", "Format muốn tổ chức mùa sau", "select", {
      options: FORMATS,
    }),
    field("ideas", "Ý tưởng mới lạ / góp ý thẳng thắn cho BTC", "textarea", {
      required: false,
      maxLength: 3000,
    }),
  ];
}

export function validateAnswers(fields, values, eventId, feedback = false) {
  const errors = {};

  for (const item of fields) {
    const value = values[item.name];

    if (item.type === "checkbox") {
      if (item.required && value !== true) {
        errors[item.name] = "Bạn cần xác nhận mục này.";
      }
    } else if (item.type === "multi") {
      const selected = value ?? [];

      if (
        !Array.isArray(selected) ||
        selected.some(
          (entry) => !item.options.some((choice) => choice.value === entry),
        )
      ) {
        errors[item.name] = "Lựa chọn không hợp lệ.";
      }
    } else {
      const text = String(value ?? "").trim();

      if (item.required && !text) {
        errors[item.name] = "Vui lòng hoàn thành mục này.";
      } else if (text.length > item.maxLength && item.type !== "select") {
        errors[item.name] = `Tối đa ${item.maxLength} ký tự.`;
      } else if (
        text &&
        item.options &&
        !item.options.some((choice) => choice.value === text)
      ) {
        errors[item.name] = "Lựa chọn không hợp lệ.";
      } else if (text && item.type === "url") {
        try {
          const url = new URL(text);

          if (
            url.protocol !== "https:" ||
            url.username ||
            url.password ||
            text.includes("@")
          ) {
            throw new Error("Invalid URL");
          }
        } catch {
          errors[item.name] =
            "Vui lòng nhập link HTTPS hợp lệ, không chứa thông tin đăng nhập.";
        }
      }
    }
  }

  if (!feedback && eventId !== EVENT_IDS.NIGHT_MARKET) {
    const riotId = String(values.riotId ?? "").trim();
    const discordIdentity = String(values.discordIdentity ?? "").trim();

    if (!/^[^#\s][^#\r\n]{0,63}#[A-Za-z0-9]{3,5}$/.test(riotId)) {
      errors.riotId = "Nhập Ingame#tagline; tagline gồm 3–5 chữ hoặc số.";
    }

    if (!/^[0-9]{17,20}$/.test(discordIdentity)) {
      errors.discordIdentity = "ID Discord phải gồm 17–20 chữ số.";
    }
  }

  if (!feedback && eventId === EVENT_IDS.NIGHT_MARKET) {
    if (values.interaction === "unavailable") {
      errors.interaction = "Hoạt động này cần bạn có thể chia sẻ màn hình.";
    }

    if (values.appearanceConsent !== "yes") {
      errors.appearanceConsent =
        "Chỉ gửi đăng ký khi bạn đồng ý xuất hiện trên livestream và video.";
    }
  }

  return errors;
}

export function normalizeAnswers(fields, values) {
  return Object.fromEntries(
    fields.map((item) => [
      item.name,
      item.type === "checkbox"
        ? values[item.name] === true
        : item.type === "multi"
          ? [...new Set(values[item.name] ?? [])]
          : item.numeric
            ? Number(values[item.name])
            : String(values[item.name] ?? "").trim(),
    ]),
  );
}

export function communityError(error) {
  if (error?.code === "permission-denied") {
    return "Không thể lưu. Đợt đăng ký có thể vừa đóng, quy chế đã đổi hoặc Firestore Rules chưa được cập nhật. Hãy tải lại trang rồi thử lại.";
  }

  if (error?.code === "unavailable") {
    return "Chưa kết nối được máy chủ. Hãy kiểm tra mạng rồi thử lại.";
  }

  return "Có lỗi xảy ra. Vui lòng thử lại sau.";
}

export function formatTime(value) {
  return value?.toDate
    ? value.toDate().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    : "Đang xác nhận";
}
