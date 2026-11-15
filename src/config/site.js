export const navigation = [
  { to: "/", label: "Trang chủ" },
  { to: "/about", label: "Giới thiệu" },
  { to: "/ecosystem", label: "Hệ sinh thái" },
  { to: "/rules", label: "Quy chế thi đấu" },
  { to: "/register", label: "Giải đấu" },
  { to: "/feedback", label: "Góp ý" },
  { to: "/articles", label: "Bài viết" },
  { to: "/faq", label: "FAQs" },
];

const link = (path) => navigation.find(({ to }) => to === path);

export const headerNavigation = [
  link("/"),
  { label: "Về Ocvoivoii", items: [link("/about"), link("/ecosystem")] },
  { label: "Thi đấu", items: [link("/register"), link("/rules")] },
  link("/feedback"),
  link("/articles"),
  link("/faq"),
];

export const pageTitles = {
  "/": "Trang chủ",
  "/about": "Giới thiệu",
  "/rules": "Quy chế thi đấu",
  "/register": "Giải đấu",
  "/ecosystem": "Hệ sinh thái",
  "/articles": "Bài viết",
  "/faq": "Câu hỏi thường gặp",
  "/feedback": "Khảo sát & đánh giá",
};
