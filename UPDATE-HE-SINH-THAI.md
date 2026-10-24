# Bản cập nhật Hệ sinh thái Ocvoivoii

Bản source đầy đủ được dựng từ ZIP đã cung cấp và phần đăng nhập/admin đã xác nhận hoạt động trong cuộc trò chuyện.

## Bước 1: Chạy thử bản source

Giải nén vào một thư mục mới để đối chiếu với dự án đang dùng. Source không chứa .git, node_modules, dist hoặc file .env. Cấu hình Firebase web được giữ từ ZIP của bạn; tài khoản và dữ liệu trên Firebase không được tạo lại.

Trong terminal tại thư mục chứa package.json:

```bash
npm ci
npm run dev
```

Mở địa chỉ Local mà Vite hiển thị. Đường dẫn nền vẫn là /ocvoivoii/.

## Bước 2: Cập nhật Firestore Rules

Mở file firestore.rules ở gốc source, sao chép toàn bộ nội dung vào Firebase Console → Firestore Database → Rules, sau đó Publish.

Rules giữ quyền gửi đăng ký giải công khai, chỉ admin hoạt động được đọc đơn và sửa danh mục. Bản ghi admin_users chỉ được sửa từ công cụ quản trị đáng tin cậy như Firebase Console. Khách chỉ đọc được danh mục có visible = true. Không mở quyền xóa danh mục từ website; dùng ẩn/hiện.

## Bước 3: Khởi tạo và cập nhật danh mục

Vào /ocvoivoii/login, đăng nhập bằng tài khoản hiện tại. Trong admin chọn Hệ sinh thái, hoặc mở /ocvoivoii/admin/ecosystem.

Bấm Khởi tạo danh mục để tạo tám bản ghi mặc định trong collection ecosystem_brands. Thao tác này chỉ tạo các mục còn thiếu, không ghi đè mục đã có.

Các nhóm:
- Những thế giới của Ốc: Ocvoivoii Gaming, Ốc Du Ký, zWhis, Ốc Bán Rong.
- Những dự án cùng nhau: chuyện miu & ốc, Hang Ocvoivoii · Nhạc & Demo.
- Bạn bè của Ốc: Người nghèo đi bụi, lem gẻng gâu gâu.

Chọn từng mục, nhập liên kết HTTPS chính thức, chỉnh mô tả/thứ tự rồi bấm Lưu thay đổi. Kênh bạn bè và hai dự án chung chỉ có YouTube. Những liên kết chưa biết được để trống và không tạo nút liên kết công khai.

Mục đã ẩn sẽ không xuất hiện trên trang Hệ sinh thái, phần giới thiệu hệ sinh thái ở trang chủ, danh mục trong About hoặc Footer. Mô tả và liên kết Gaming được dùng chung ở các phần đã kết nối với danh mục.

## Phạm vi của bản này

- Thêm trang /ecosystem và trình sửa danh mục trong /admin/ecosystem.
- Thêm nút Đăng nhập/Quản trị trên Navbar desktop và mobile.
- Tách AdminLayout và nội dung từng màn hình quản trị.
- Giữ đăng nhập, đăng xuất, quên mật khẩu và kiểm tra quyền admin.
- Giữ trang chủ tập trung Gaming; chuyển khu vực hệ sinh thái sang dữ liệu Firestore.
- Đồng bộ danh mục ở trang chủ, trang Hệ sinh thái, About và Footer.
- Sửa cấu hình liên kết cũ đang gán vào import.meta.env; danh mục mới quản lý liên kết bằng Firestore.
- Dọn các component SPA cũ không còn được sử dụng: Hero.jsx, YouTubeSection.jsx, TournamentRegister.jsx, SocialLink.jsx và App.css.
- Nội dung tiểu sử, thiết bị, video và quy chế vẫn dùng dữ liệu hiện tại; chưa có màn hình sửa các nội dung này trong bản này.
- Chưa có chức năng thêm thương hiệu mới hoặc tải ảnh lên. Màn hình hiện tại chỉnh sửa tám mục đã chốt.
- Khi sửa cùng lúc ở nhiều tab, giao dịch lưu kiểm tra phiên bản updatedAt để tránh ghi đè nội dung mới hơn.
- Đường dẫn con trên GitHub Pages được hỗ trợ bằng bản sao index.html thành 404.html khi build; truy cập trực tiếp vẫn có mã HTTP 404 từ GitHub Pages, nhưng React có thể hiển thị đúng trang.

## Kiểm tra đã thực hiện

- npm ci với package-lock.json hiện có.
- npm run lint.
- npm run build và kiểm tra dist/404.html.
- 26 kiểm tra Firestore Emulator: phân quyền, đọc mục công khai, chặn đọc mục ẩn, chặn tự cấp quyền, kiểm tra dữ liệu, giữ chức năng đăng ký giải và kiểm tra khởi tạo tám mục không ghi đè.
- Các kiểm tra emulator dùng project demo riêng, không ghi vào Firebase thật.
- Kiểm tra trình duyệt với dữ liệu và phiên mô phỏng: tám thẻ, ba nhóm, màn hình 390px không tràn ngang, đóng menu khi chuyển trang, lưu payload biểu mẫu, bạn bè chỉ có YouTube, từ chối URL sai nền tảng và chuyển người chưa đăng nhập về /login. Các kiểm tra này không thay thế việc đăng nhập/lưu thử vào project Firebase thật của bạn.

Khi chuyển bản này vào repository đang dùng, giữ thư mục .git của repository đó. Commit source và package-lock.json như thông thường; không commit node_modules hoặc dist. Workflow GitHub Actions hiện có được giữ lại.
