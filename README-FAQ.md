# Ocvoivoii — cập nhật FAQs và thanh điều hướng

Gói này áp dụng cho bản dự án có trang Giải đấu và nút đăng nhập ở Navbar. Giải nén vào thư mục gốc dự án; gói thay ba tệp hiện có và thêm một trang mới.

- `src/App.jsx`: thêm route `/faq`.
- `src/components/Navbar.jsx`: thêm hai nhóm menu trên desktop và điện thoại.
- `src/config/site.js`: cấu hình nhóm điều hướng, liên kết và tiêu đề trang.
- `src/components/pages/Faq.jsx`: hai nhóm câu hỏi và liên kết tới trang Giải đấu, Quy chế. Muốn sửa câu trả lời, chỉnh mảng `sections` trong tệp này.

Không cần thêm package hoặc cập nhật Firebase. Nếu đã tự chỉnh các tệp trên sau bản gần nhất, hãy đối chiếu trước khi ghi đè.

Trên macOS, nếu ZIP nằm trong Downloads và dự án ở Documents:

```bash
cd ~/Documents/ocvoivoii && unzip -o ~/Downloads/ocvoivoii-faq-nav-update.zip && npm run dev
```
