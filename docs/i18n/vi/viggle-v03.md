[Tiếng Việt](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Những tài liệu này là bản dịch máy của văn bản dự án công cộng và chưa được người bản xứ xem xét. Tham khảo nguồn tiếng Anh hoặc tiếng Trung để biết sự mơ hồ về mặt kỹ thuật. Không có dữ liệu người dùng cá nhân được bao gồm.

# Các chế độ và cài đặt Viggle v0.3

Nguồn chính thức: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Bản sửa đổi, kích thước và giá trị băm được ghim: `src/viggle_turbo_v03_model.json`. Trình cài đặt: `src/install_viggle_turbo_v03.py`. Sử dụng thư mục `models/viggle-qwen-turbo-v03` riêng trong khi chia sẻ mô hình cơ sở đã cài đặt và môi trường Python hiện có. Nó không nâng cấp phụ thuộc hoặc ghi đè v0.1/v0.2.1.

Menu mô hình hình ảnh cung cấp:

- **Viggle v0.3 · Các bước 6, hình ảnh rõ ràng hơn**: lịch trình sigma six-node chính thức, CFG1.
- **Viggle v0.3 · Các bước 9, chi tiết nâng cao**: bảy bước Turbo, sau đó vô hiệu hóa LoRA, chuyển KV được lưu trong bộ nhớ đệm tiếp theo sang trích xuất và sử dụng mô hình cơ sở cho hai bước cuối cùng. LoRA và hành vi chuyển tiếp được khôi phục sau đó. Chỉ đặt số bước thông thường thành chín là không tương đương.

v0.3 hỗ trợ tối đa ba tham chiếu, không có dấu nhắc phủ định và mặc định hình vuông 1024px khi được chọn. Kích thước mặc định v0.2.1 trước đó và iPhone vẫn được giữ nguyên; mô hình ban đầu vẫn hỗ trợ mười tài liệu tham khảo. Kích thước lớn gốc, lát gạch VAE và xử lý hậu kỳ 8K hiện có vẫn có thể được lựa chọn, nhưng không phải mọi sự kết hợp đều đã được thử nghiệm.

LoRA không được hợp nhất thành các trọng số BF16; sức mạnh là 1. Bộ lập lịch `shift_terminal` phải là null. v0.3 có thể ít hạt hơn nhưng mềm hơn một chút; nó không được đảm bảo sẽ hoạt động tốt hơn các phiên bản cũ hơn trong mọi trường hợp. Tỷ lệ thời gian chín bước chính thức không phải là điểm chuẩn địa phương.

## Xác thực

`tests/viggle_model.mjs` sử dụng các thiết bị cố định mô hình thưa thớt riêng biệt để xác minh số bước, giới hạn tham chiếu, định tuyến kích thước lớn và các điểm đánh dấu sẵn sàng. `tests/viggle_schedule.py` xác minh việc vô hiệu hóa LoRA sau bước bảy, trích xuất lại và khôi phục một KV.

Mẫu cốc xanh 512×512, hạt giống-42 gồm sáu bước đã hoàn thành trong 52.98 bao gồm cả tải process/model. Kích thước và hình ảnh thực tế đã được kiểm tra. Nỗ lực chín bước đầu tiên đã dừng khi kết nối văn bản mới kích hoạt bảo vệ tài nguyên; đây không phải là một lỗi suy luận.

Quá trình thử lại chín bước đã hoàn tất trong 65.42 tại 512×512, 42 hạt giống. Nó chuyển sang mô hình cơ sở sau bước bảy, hoàn thành chín bước và tạo ra kích thước chính xác. Kiểm tra trực quan không tìm thấy tiếng ồn green/magenta. Một mẫu cho mỗi chế độ không phải là điểm chuẩn hiệu suất ổn định. Nhiều tài liệu tham khảo, hình ảnh lớn và quá trình xử lý hậu kỳ 8K không được xác thực trong những lần chạy đó.
