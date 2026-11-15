# Ocvoivoii · Điều hướng và hồ sơ tuyển thủ

Gói này được ghép trên source `ocvoivoii 2(1).zip` bạn cung cấp. Chỉ ghi đè những file đã chỉnh, không đưa theo file .env.local, dữ liệu người chơi hay build cũ.

## Cài trên MacBook

Tải ZIP vào Downloads, mở Terminal trong repo hiện tại rồi chạy:

```bash
git status --short
unzip -l ~/Downloads/ocvoivoii-player-profile-update.zip
unzip -o ~/Downloads/ocvoivoii-player-profile-update.zip -d .
npm ci
npm run build
```

Nếu đang sửa dở các file được liệt kê, sao lưu hoặc commit trước khi unzip. Xem diff trước khi push. Thư mục setup/ chỉ chứa tài liệu cấu hình, không cần đưa lên GitHub.

## Bật Google Auth

1. Firebase Console → Authentication → Sign-in method → Google → Enable. Điền email hỗ trợ nếu Firebase yêu cầu rồi lưu.
2. Firebase Console → Authentication → Settings → Authorized domains. Thêm hostname của GitHub Pages/domain đang dùng, không bao gồm https:// hoặc đường dẫn. Nếu chạy local, kiểm tra localhost cũng có trong danh sách.
3. Firebase Console → Firestore Database → Rules. Dán nội dung `player-profiles.rules.part` bên trong khối `match /databases/{database}/documents { … }`. Nếu collection `player_profiles` đã có block, hợp nhất thay vì tạo block trùng. Giữ nguyên các rule đăng ký giải, feedback, admin và hệ sinh thái. Rà các wildcard trên cùng để bảo đảm chúng không mở thêm quyền đọc/ghi. Publish.
4. Chạy `npm run dev`. Bấm Đăng nhập → Đăng ký → Đăng ký bằng Google. Sau khi kết nối, app đọc hồ sơ theo UID: người mới nhận form, người đã lưu nhận trang tài khoản trong popup. Đăng nhập và Đăng ký cùng dùng Google, không có mật khẩu riêng.

## Nối link Discord

- Local: thêm `VITE_DISCORD_INVITE_URL` vào .env.local, đặt giá trị là link mời thật, khởi động lại Vite.
- GitHub: Settings → Secrets and variables → Actions → Variables → New repository variable, tên `VITE_DISCORD_INVITE_URL`. Workflow đã nhận biến này ở bước build.
- Nếu bỏ trống biến, popup dùng link mời Discord đang lưu ở mục Ocvoivoii Gaming trong hệ sinh thái nếu có. Nếu cả hai chưa có, popup báo link mời chưa được cập nhật. Chỉ chấp nhận URL mời HTTPS của Discord.
- Checkbox là tự xác nhận đã tham gia, không kiểm tra membership hay vai trò trên Discord. Người dùng chưa tick thì chưa thể lưu hồ sơ.

## Dữ liệu và phạm vi

- `player_profiles/{uid}`: họ tên, rank, giới tính, vai trò, Riot ID, Tracker.gg, Facebook, Discord ID, xác nhận tham gia Discord, thời gian tạo/cập nhật. Chỉ chủ UID có thể lấy hồ sơ qua client; ghi yêu cầu phiên đăng nhập Google. Không mở list công khai hoặc quyền quản trị từ form.
- Link Tracker.gg được kiểm tra cú pháp và khớp Riot ID trên client; rank và thành viên Discord là thông tin tự khai.
- Menu Giải đấu trỏ vào /register như trước. Chưa sửa luồng dự giải hoặc điều kiện tham dự. Hồ sơ đã có cấu trúc để điền sẵn thông tin ở bản sau. Bài viết đã có route /articles và trạng thái chưa có bài đăng.
- Không đưa .env.local lên GitHub hoặc đóng gói khi gửi source. Nếu ZIP gốc có API key bí mật, cân nhắc đổi key đó.
