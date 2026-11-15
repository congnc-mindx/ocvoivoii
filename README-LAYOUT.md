# Ocvoivoii — đồng bộ bố cục trên laptop

Áp dụng sau bản FAQs và nhóm điều hướng. Giải nén vào thư mục gốc
có package.json. Nếu bạn đã sửa các tệp trong gói, đối chiếu trước khi ghi đè.

```bash
cd ~/Documents/ocvoivoii && unzip -o ~/Downloads/ocvoivoii-laptop-layout-update.zip && npm run dev
```

- PageLayout và PageIntro định nghĩa phần đầu chung cho Giới thiệu, Hệ sinh thái,
  Quy chế, Giải đấu, Góp ý, Bài viết và FAQs.
- index.css chứa chiều cao navbar, lề và khoảng cách chung. Tiêu đề trang nội dung
  co giãn từ 30 đến 48 CSS px; navbar cao tối thiểu 68 CSS px.
- Trang chủ giữ hero riêng, dùng lề và khoảng cách ngoài chung. Navbar chuyển
  sang nút menu khi viewport dưới 1100 CSS px.
- Không cần cài thêm thư viện hay đổi cấu hình Firebase.

Mở các trang ở mức zoom 100% và đối chiếu lề trái của tiêu đề với logo navbar.
Phần nội dung ngay dưới có thể bắt đầu ở độ cao khác nhau nếu tiêu đề dài
xuống dòng hoặc trang có các nút điều hướng riêng.
