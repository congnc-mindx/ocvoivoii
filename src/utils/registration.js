export function createInitialRegistration() {
  return {
    fullName: "",
    contact: "",
    type: "solo",
    teamName: "",
  };
}

export function normalizeRegistration(values) {
  return {
    fullName: values.fullName.trim().replace(/\s+/g, " "),
    contact: values.contact.trim(),
    type: values.type,
    teamName:
      values.type === "team" ? values.teamName.trim().replace(/\s+/g, " ") : "",
  };
}

function isValidContact(contact) {
  if (contact.includes("@")) {
    return (
      contact.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
    );
  }

  if (!/^\+?[\d\s().-]+$/.test(contact)) return false;

  const digits = contact.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function validateRegistration(values) {
  const errors = {};
  const normalized = normalizeRegistration(values);

  if (normalized.fullName.length < 2 || normalized.fullName.length > 100) {
    errors.fullName = "Vui lòng nhập họ và tên từ 2 đến 100 ký tự.";
  }

  if (!isValidContact(normalized.contact)) {
    errors.contact =
      "Vui lòng nhập email hợp lệ hoặc số điện thoại từ 9 đến 15 chữ số.";
  }

  if (!["solo", "team"].includes(normalized.type)) {
    errors.type = "Vui lòng chọn hình thức đăng ký.";
  }

  if (normalized.teamName.length > 80) {
    errors.teamName = "Tên đội không được vượt quá 80 ký tự.";
  } else if (normalized.type === "team" && normalized.teamName.length < 2) {
    errors.teamName = "Vui lòng nhập tên đội từ 2 đến 80 ký tự.";
  }

  return errors;
}

export function getRegistrationError(error) {
  switch (error?.code) {
    case "permission-denied":
      return "Hệ thống chưa cho phép nhận đăng ký. Vui lòng liên hệ ban tổ chức.";
    case "unavailable":
    case "deadline-exceeded":
      return "Kết nối đang gián đoạn. Vui lòng kiểm tra mạng và thử lại.";
    case "resource-exhausted":
      return "Hệ thống đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau.";
    default:
      return "Chưa thể gửi đăng ký. Thông tin của bạn vẫn được giữ trong biểu mẫu để thử lại.";
  }
}
