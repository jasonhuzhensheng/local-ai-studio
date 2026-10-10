Tiếng Việt | ../README.md
Những tài liệu này là bản dịch máy của văn bản dự án công cộng và chưa được người bản xứ xem xét. Tham khảo nguồn tiếng Anh hoặc tiếng Trung để biết sự mơ hồ về mặt kỹ thuật. Không có dữ liệu người dùng cá nhân được bao gồm.

Local AI Studio: gói nguồn di chuyển cho máy Mac Apple Silicon mới

Bản phát hành được đánh giá này bao gồm nguồn frontend/backend, các bài kiểm tra, bảng kê khai tải xuống mô hình, phần phụ thuộc được ghim, nguồn công cụ gốc và các bản vá video thử nghiệm của Apple. Nó có thể tụt hậu so với sự phát triển hoặc sản xuất của địa phương.
Nó loại trừ trọng lượng, môi trường ảo, tác vụ trước đó, hình ảnh tham chiếu, bản ghi trò chuyện, cấu hình tài khoản và bí mật. Nó không phải là app chỉ bằng một cú nhấp chuột.

Cung cấp toàn bộ thư mục này cho trợ lý mã hóa trên máy Mac mục tiêu, cùng với INSTALL-PROMPT.en.txt.
Máy xác thực ban đầu là M2 Max với bộ nhớ 96GB. Trước tiên hãy kiểm tra model, bộ nhớ và hệ điều hành đích. Không sử dụng lại cài đặt video một cách mù quáng trên máy Mac có bộ nhớ thấp hơn.

Nội dung:
 src/ Frontend, backend, công cụ download/validation, bảng kê khai mô hình
 Kiểm tra tests/; một số yêu cầu cài đặt models/services. Không chạy bừa bãi
 requirements/viggle-pinned.txt Môi trường hình ảnh được ghim
 src/h3_requirements.lock Môi trường video được ghim riêng biệt
 vendor/ Nguồn gốc không có tệp nhị phân được biên dịch; giữ lại giấy phép thượng nguồn
 patches/ ComfyUI/ClipProj cam kết và triển khai các thay đổi Python
 Tổng kiểm tra SHA256SUMS.txt trên mỗi tệp

Điểm vào mô hình: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (cơ sở model/adapters), wai_model.json, upscale_model.json và h3_apple_models.json (video), trong src/. Kiểm tra từng bảng kê khai và trình cài đặt của nó trước khi tải xuống.
Mẫu văn bản: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, tệp Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Gói này không bao gồm revision/hash được ghim hoàn chỉnh cho kiểu máy đó. Trước tiên hãy lấy và ghi lại siêu dữ liệu ngược dòng đáng tin cậy; không yêu cầu sự tương đương từng byte với máy ban đầu.

Cài đặt máy mới chưa được xác nhận. Xem lại đường dẫn máy gốc, bí danh mô hình và đường dẫn công cụ hệ thống cho người dùng mục tiêu. Không áp dụng lại các bản vá lịch sử cho nguồn nhà cung cấp đã được sửa đổi. Tải xuống thành công không phải là bằng chứng của suy luận thành công hoặc chất lượng có thể chấp nhận được.

Sử dụng menu ngôn ngữ ở phía trên bên phải để chọn từ các ngôn ngữ 33. Trình duyệt ghi nhớ lựa chọn của bạn. Gói ngôn ngữ được phục vụ tại địa phương; chuyển đổi ngôn ngữ không gửi nội dung đến dịch vụ dịch thuật trực tuyến. Lời nhắc của người dùng, cuộc hội thoại và nội dung đã lưu vẫn giữ nguyên ngôn ngữ gốc.
