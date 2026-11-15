# Ocvoivoii — cải thiện đăng nhập và hồ sơ tuyển thủ

Gói cập nhật dành cho phiên bản đã có đăng nhập Google và hồ sơ tuyển thủ. Gói chỉ sửa ba file giao diện và kiểm tra dữ liệu. Giữ nguyên Firebase config, Firestore Rules, dữ liệu đã lưu và form đăng ký giải.

## Cài trên Mac

```bash
cd ~/Documents/ocvoivoii
git status --short
unzip -o ~/Downloads/ocvoivoii-player-ux-update.zip -d .
npm run lint
npm run build
npm run dev
```

Nếu repo ở chỗ khác, đổi dòng cd. Xem git diff trước khi push.

## Thử luồng

1. Chọn Đăng nhập → Tiếp tục với Google. Người đã có hồ sơ thấy thông tin và nút chỉnh sửa; người chưa có hồ sơ vào bước 1.
2. Điền thông tin thi đấu → Tiếp tục. Bước 2 chỉ hỏi Discord. Mở hướng dẫn ngay trong form hoặc dùng link Discord nếu đã cấu hình.
3. Dán ID tài khoản từ mục Copy User ID. Ô nhận dãy 17–20 chữ số, bỏ khoảng trắng vô tình dán vào hoặc nhận mention người dùng dạng Discord raw. Tên @username, link, ID sai độ dài và mention role/kênh bị từ chối. ID vẫn lưu dạng chuỗi, không biến thành số hoặc cắt ngắn.
4. Quay lại bước 1 và đi tiếp để kiểm tra form giữ thông tin. Tick đã tham gia Hang Ocvoivoii rồi hoàn tất. Nếu lỗi ghi Firebase, form vẫn giữ thông tin để thử lại.
5. Ô báo “ID đúng định dạng” chỉ kiểm tra cú pháp. Website chưa xác minh ID thuộc về tài khoản đó hay người dùng thực sự là thành viên server.

Nếu không có link mời, thêm VITE_DISCORD_INVITE_URL như gói hồ sơ trước.
