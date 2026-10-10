[Tiếng Việt](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Những tài liệu này là bản dịch máy của văn bản dự án công cộng và chưa được người bản xứ xem xét. Tham khảo nguồn tiếng Anh hoặc tiếng Trung để biết sự mơ hồ về mặt kỹ thuật. Không có dữ liệu người dùng cá nhân được bao gồm.

# Tài khoản trang web

## Cách sử dụng

Trên máy Mac chạy dịch vụ, hãy mở `http://127.0.0.1:1235/setup` để tạo quản trị viên đầu tiên. Tên người dùng chứa các chữ cái, chữ số, dấu gạch dưới hoặc dấu gạch nối 3–32 và được chuẩn hóa thành chữ thường. Mật khẩu chứa các ký tự 12–128. Không có thông tin xác thực mặc định. Thiết bị từ xa không thể yêu cầu tài khoản quản trị viên ban đầu.

Sau khi thiết lập, các thiết bị chưa được xác thực sẽ nhìn thấy trang đăng nhập. Mở **Tài khoản / Đăng xuất** (`/account`) để thay đổi mật khẩu hoặc đăng xuất. Quản trị viên có thể tạo users/administrators, đặt lại mật khẩu, tài khoản disable/enable, thay đổi vai trò và xóa tài khoản. Việc xóa và thay đổi quyền yêu cầu xác nhận. Máy chủ ngăn chặn việc xóa, vô hiệu hóa hoặc hạ cấp quản trị viên được kích hoạt lần cuối. Việc xóa tài khoản sẽ không xóa các nhiệm vụ được chia sẻ.

Sử dụng menu ngôn ngữ ở phía trên bên phải để chọn từ các ngôn ngữ 33. Trình duyệt ghi nhớ lựa chọn của bạn. Gói ngôn ngữ được phục vụ tại địa phương; chuyển đổi ngôn ngữ không gửi nội dung đến dịch vụ dịch thuật trực tuyến. Lời nhắc của người dùng, cuộc hội thoại và nội dung đã lưu vẫn giữ nguyên ngôn ngữ gốc.

Đây là một studio chung. Người dùng đã đăng nhập chia sẻ quyền truy cập vào hình ảnh, video và tác vụ trò chuyện phía máy chủ. Lịch sử trò chuyện trên trình duyệt vẫn còn trong localStorage. Không có sự cô lập nhiều người thuê, lưu trữ hoặc thanh toán tác vụ cho mỗi người dùng. Hạn chế video chỉ dành cho địa phương hiện tại vẫn còn.

## Lưu trữ và bảo vệ

- `src/studio_auth.mjs` chạy trước các tuyến nghiệp vụ, bao gồm API và tệp image/reference/video. Các trang không được xác thực chuyển hướng bằng 303; API và phương tiện trả về 401. Nội dung tài khoản, nội dung ngôn ngữ và trạng thái setup/sign-in không bí mật đều được công khai.
- Tệp tài khoản: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, `app/.local/auth/users.json` mặc định; việc triển khai chuyên dụng sử dụng `runtime/auth/users.json`. Chế độ thư mục: 0700; chế độ tập tin: 0600. Mật khẩu sử dụng scrypt N32768/r8/p1, muối ngẫu nhiên và so sánh hàm băm theo thời gian không đổi. Các bài viết là những thay đổi nguyên tử và tài khoản được tuần tự hóa. Cơ sở dữ liệu hiện có bị hỏng sẽ ngăn cản việc khởi động thay vì mở lại đăng ký.
- Phiên sử dụng byte ngẫu nhiên 32; máy chủ chỉ lưu trữ thông báo. Cookie là HttpOnly, SameSite=Strict, có giá trị trong giờ 12. Khởi động lại yêu cầu đăng nhập lại. Password/role thay đổi, đặt lại, vô hiệu hóa và xóa thu hồi các phiên bị ảnh hưởng. Việc đăng xuất sẽ không xóa hoặc chạy lại các tác vụ đã bắt đầu.
- Viết yêu cầu Origin và JSON có cùng nguồn gốc. X-Forwarded-For không đáng tin cậy. Mỗi IP nguồn nhận được nhiều nhất 15 sign-in/setup/self-password-change lần thử mỗi 15 phút. Giới hạn: Dẫn xuất mật khẩu đồng thời 4 và tài khoản 100. Việc khởi động lại sẽ xóa giới hạn lần thử.
- Việc triển khai hiện tại sử dụng HTTP qua Tailscale riêng tư. Tailscale mã hóa việc truyền tải từ thiết bị này sang thiết bị khác; Bản thân HTTP LAN thông thường thì không. Quyền truy cập công khai và TLS không được cấu hình bởi gói này. Cookie Secure chỉ được đặt cho các yêu cầu TLS gốc. Không hiển thị nó trực tiếp qua HTTP công cộng.
- Không bao giờ tải lên cơ sở dữ liệu xác thực, phiên hoặc mật khẩu. Khởi tạo tài khoản mới khi di chuyển. Các quyền của stdio MCP, LM Studio cục bộ và tệp OS nằm ngoài xác thực trang web.

## Xác thực

Chạy `node tests/studio_auth.mjs` với cơ sở dữ liệu tài khoản tạm thời và không có models thực. Nó bao gồm việc chặn API/media không được xác thực, hạn chế nguồn gốc thiết lập ban đầu, vai trò, chế độ hashing/file mật khẩu, bảo vệ quản trị viên cuối cùng, thu hồi phiên, duy trì, từ chối tệp bị hỏng và giới hạn tốc độ.

Các bài kiểm tra local_chat, chat_background, image_studio và video_web đăng nhập với các quản trị viên kiểm tra riêng biệt; không có đường vòng xác thực sản xuất. Mật khẩu thực do người dùng nhập và không được lưu trong các bài kiểm tra hoặc tài liệu.
