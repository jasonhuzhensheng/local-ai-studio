[Tiếng Việt](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Những tài liệu này là bản dịch máy của văn bản dự án công cộng và chưa được người bản xứ xem xét. Tham khảo nguồn tiếng Anh hoặc tiếng Trung để biết sự mơ hồ về mặt kỹ thuật. Không có dữ liệu người dùng cá nhân được bao gồm.

# MacBook Pro Studio

Studio hình ảnh, trò chuyện và video thử nghiệm cục bộ dành cho máy Mac Apple Silicon.

## Ngôn ngữ giao diện

Sử dụng menu ngôn ngữ ở phía trên bên phải để chọn từ các ngôn ngữ 33. Trình duyệt ghi nhớ lựa chọn của bạn. Gói ngôn ngữ được phục vụ tại địa phương; chuyển đổi ngôn ngữ không gửi nội dung đến dịch vụ dịch thuật trực tuyến. Lời nhắc của người dùng, cuộc hội thoại và nội dung đã lưu vẫn giữ nguyên ngôn ngữ gốc.

## Xem trước giao diện

Những bản xem trước này sử dụng kiểu trang đã phát hành. Tất cả lời nhắc, ID nhiệm vụ, dấu thời gian, hình minh họa và cuộc hội thoại đều là nội dung demo hư cấu được tạo cho README này. Chúng không chứa tài khoản thực, hình ảnh người dùng hoặc bản ghi trò chuyện. Các hình minh họa được vẽ theo chương trình, không phải điểm chuẩn mô hình hoặc tuyên bố chất lượng.

### Xưởng chụp ảnh

Chọn một mô hình, nhập lời nhắc và duyệt các nhiệm vụ cũng như kết quả hình ảnh.

![Studio hình ảnh với các nhiệm vụ hư cấu và minh họa phong cảnh được vẽ theo chương trình](../../images/image-studio-demo.en.png)

### Trò chuyện cục bộ

Trò chuyện trong cùng một studio và chọn chế độ và thời lượng phản hồi.

![Trò chuyện cục bộ với cuộc trò chuyện lập kế hoạch minh họa được viết thủ công, hư cấu](../../images/chat-studio-demo.en.png)

## Thiết lập máy Mac mới

1. Sao chép kho lưu trữ này.
2. Đọc [hướng dẫn triển khai](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Cung cấp [lời nhắc cài đặt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) cho trợ lý mã hóa trên máy Mac mục tiêu để cài đặt các phần phụ thuộc và tải xuống models thích hợp cho phần cứng đó.

Trang: `/edit` cho hình ảnh, `/chat` cho trò chuyện, `/video` cho video. Cổng web mặc định là `1235`.

Kho lưu trữ này là bản sao phát hành và di chuyển đã được đánh giá. Nó có thể tụt hậu so với sự phát triển hoặc sản xuất của địa phương. Nó không bao gồm trọng lượng mô hình, môi trường ảo, tác vụ của người dùng, bản ghi trò chuyện, hình ảnh tham chiếu và cấu hình tài khoản. Cài đặt hoàn chỉnh trên máy mới chưa được xác thực. Đây không phải là một ứng dụng một cú nhấp chuột.

## Nội dung kho lưu trữ

- `src/`: giao diện người dùng, phụ trợ, bảng kê khai mô hình, công cụ cài đặt và xác thực.
- `tests/`: kiểm tra; một số yêu cầu models được cài đặt hoặc các dịch vụ đang chạy.
- `requirements/`: phụ thuộc được ghim.
- `vendor/`: nguồn động cơ gốc, giữ lại giấy phép ngược dòng.
- `patches/`: phiên bản được ghim và phiên bản chuyển thể của Apple.

Các mô hình và nguồn của bên thứ ba giữ lại giấy phép ngược dòng của họ. H3/ClipProj Hỗ trợ của Apple chỉ mang tính thử nghiệm. Một mẫu ngắn thành công không thiết lập được sự hỗ trợ cho mọi độ phân giải hoặc thời lượng.

## Đăng nhập và tài khoản

Trên máy Mac chạy dịch vụ, hãy mở `http://127.0.0.1:1235/setup` để tạo quản trị viên đầu tiên, sau đó đăng nhập từ các thiết bị khác. Quản trị viên có thể tạo, vô hiệu hóa và xóa tài khoản cũng như đặt lại mật khẩu. Xem [tài liệu tài khoản](accounts.md) ([中文](../../accounts.md)). Không có mật khẩu mặc định. Các tệp tài khoản nằm trong thư mục dữ liệu runtime và không được tải lên. Nhiệm vụ vẫn được chia sẻ dữ liệu studio.

## Viggle v0.3

Có sẵn các chế độ chi tiết sáu bước và chín bước riêng biệt, với giá trị mặc định trước đó được giữ lại. Xem [cài đặt và xác thực](viggle-v03.md) ([中文](../../viggle-v03.md)). Tải xuống trọng lượng mô hình riêng biệt trên máy Mac mục tiêu.
