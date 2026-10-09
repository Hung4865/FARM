# Feature Specification: Trợ Lý Trí Tuệ Nhân Tạo Nông Nghiệp Thông Minh (Agri-Copilot AI tích hợp Google Gemini)

**Feature Branch**: `008-gemini-ai-assistant`  
**Created**: 2026-10-10  
**Status**: Hoàn Thành & Nghiệm Thu (Step 4 of Lifecycle)  
**Input**: Yêu cầu tích hợp Trí tuệ Nhân tạo vào hệ thống Smart Farm: Chatbot trợ lý nông trại thông minh sử dụng mô hình Google Gemini (Gemini 1.5 Flash), có khả năng đọc và hiểu dữ liệu cảm biến thời gian thực của nông trường (đất, thời tiết Hà Nội, cảnh báo, máy kéo GPS, công việc), hỗ trợ tư vấn canh tác, giải pháp tưới tiêu và chẩn đoán sự cố an toàn.

---

## 1. Mục Tiêu (Objective)

Tích hợp một **Trợ lý AI Nông nghiệp Toàn diện (Agri-Copilot)** trực tiếp vào Dashboard của Smart Farm Management:
1. **Giao diện Nổi Tinh gọn (Sleek Floating Action Button - FAB)**: Nút tròn 52px ở góc dưới bên phải màn hình với hiệu ứng phát sáng neon gradient (Emerald - Sky - Indigo); tooltip nhãn tên tự ẩn mặc định chống vướng mắt, chỉ hiển thị khi rê chuột.
2. **Khung Hội Thoại Đẳng Cấp (Interactive AI Chat Dialog)**: Hỗ trợ cuộn tin nhắn mượt mà, định dạng văn bản Markdown chuẩn đẹp (tiêu đề in đậm, danh sách gạch đầu dòng, emoji sinh động), hiển thị thời gian gửi, nhãn nhận diện mô hình (`Gemini 1.5` / `Farm Engine`).
3. **Bơm Ngữ Cảnh Thời Gian Thực (Live Farm Context Injection)**: Tự động gom dữ liệu thực tế tại thời điểm hỏi (độ ẩm đất 3 khu A/B/C, nhiệt độ, ánh sáng, thời tiết Hà Nội, cảnh báo an toàn tồn đọng, toạ độ GPS máy kéo, tiến độ công việc) nạp vào System Instruction cho Gemini suy luận.
4. **Kết Nối Google Gemini 1.5 Flash REST API**: Hỗ trợ gọi trực tiếp endpoint `generateContent` của Google AI Studio với cấu hình nhiệt độ (temperature 0.7), bảo đảm câu trả lời chuyên sâu, chuẩn xác và tức thì.
5. **Quản Lý API Key Linh Hoạt (⚙️ Drawer)**: Cho phép người dùng nhập API Key cá nhân, hỗ trợ ẩn/hiện key (👁️), liên kết trực tiếp tới Google AI Studio để lấy key miễn phí, đồng bộ `localStorage` và lưu trữ an toàn trong `ir.config_parameter`.
6. **Động Cơ Phân Tích Dự Phòng (Offline Farm Reasoning Engine)**: Khi chưa cấu hình API Key hoặc xảy ra sự cố mạng quốc tế, hệ thống tự động phân tích theo quy luật cảm biến nông trường để trả lời người dùng mà không bị đứt đoạn.
7. **Chip Gợi Ý Nhanh 1 Chạm (Quick Prompt Chips)**: 5 nút bấm gợi ý câu hỏi thông dụng (Độ ẩm & Tưới tiêu, Cảnh báo an toàn, Định vị máy kéo GPS, Thời tiết & Nông vụ, Tiến độ công việc).
8. **Đồng Bộ Giao Diện Kép (Dual Theme)**: Tương thích hoàn hảo cả chế độ Sáng (High-Contrast Light Mode) và chế độ Tối (Dark Slate Mode).

---

## 2. User Stories & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### User Story 1: Tương tác mở/đóng Trợ lý AI và Gợi ý Nhanh (Priority: P1)
Là người quản lý nông trại, tôi muốn bấm vào nút AI nổi ở góc màn hình để mở khung chat, và có thể bấm nhanh vào các câu hỏi gợi ý để nhận câu trả lời ngay lập tức.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** người dùng mở Dashboard, **When** nhìn góc dưới phải, **Then** chỉ thấy nút tròn AI 52px với hiệu ứng phát sáng nhẹ, nhãn chữ không hiển thị đè lên màn hình.
  2. **Given** người dùng di chuột (hover) vào nút AI, **Then** nhãn *"Trợ lý AI Trang trại"* trượt vào nhẹ nhàng; khi di chuột ra nhãn tự ẩn đi.
  3. **Given** người dùng bấm nút AI, **Then** khung chat mở lên mượt mà, hiển thị lời chào mở đầu và 5 chip gợi ý nhanh.
  4. **Given** người dùng bấm chip *"🌱 Độ ẩm đất & Tưới"*, **Then** câu hỏi tự động gửi đi, hiển thị bong bóng chat người dùng và hiệu ứng 3 chấm gõ tin nhắn (`typing indicator`).

---

### User Story 2: Phân tích Dữ liệu Nông trại Thực tế (Priority: P1)
Là kỹ sư nông nghiệp, khi tôi hỏi AI về tình hình trang trại, tôi muốn AI trả lời dựa trên chính xác số liệu cảm biến hiện tại (ví dụ: Khu B đang 38% ẩm nên cần tưới) thay vì câu trả lời chung chung.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** độ ẩm Khu B là 38% và Khu A là 72%, **When** người dùng hỏi về đất và tưới tiêu, **Then** AI chỉ rõ Khu B đang khô dưới ngưỡng 60-70% và khuyến nghị kích hoạt tưới phun sương trong 30-45 phút.
  2. **Given** thời tiết Hà Nội và các phương tiện GPS, **When** người dùng hỏi về máy kéo hay thời tiết, **Then** AI trích dẫn đúng toạ độ máy kéo Kubota và thông số thời tiết thực tế.

---

### User Story 3: Cấu hình Gemini API Key và Chế độ Offline Fallback (Priority: P2)
Là người quản trị, tôi muốn dễ dàng dán Google Gemini API Key của mình để tận dụng mô hình AI cao cấp nhất, nhưng nếu chưa có key thì hệ thống vẫn phải hoạt động.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** khung chat đang mở, **When** bấm biểu tượng bánh răng ⚙️, **Then** ngăn kéo cấu hình trượt xuống cho phép nhập key, có nút xem/ẩn 👁️ và nút *"Lưu API Key"*.
  2. **Given** đã lưu key hợp lệ, **When** gửi câu hỏi, **Then** hệ thống gọi Google Gemini API (`gemini-1.5-flash`), tag hiển thị `Gemini 1.5`.
  3. **Given** chưa có key hoặc xoá key, **When** gửi câu hỏi, **Then** bộ phân tích nội bộ (`farm-local-engine`) phản hồi ngay lập tức với đầy đủ số liệu thực tế.

---

### User Story 4: Thẩm mỹ Cao cấp & Đồng bộ Dual Theme (Priority: P2)
Là người dùng ở cả ca ngày và ca đêm, tôi muốn khung chat có giao diện sắc nét, không bị chói mắt và đổi màu hài hoà theo theme chung của Dashboard.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** Light Mode, **Then** nền chat trắng tinh khôi, viền xám `#cbd5e1`, tin nhắn trợ lý nền `#f1f5f9`, chữ `#0f172a` đậm rõ ràng.
  2. **Given** Dark Slate Mode, **Then** khung chat tự chuyển sang tông đá phiến `#0f172a` và `#1e293b`, chữ phát sáng dịu mắt `#f8fafc`.

---

## 3. Edge Cases & Xử Lý Ngoại Lệ

1. **Tin nhắn rỗng hoặc toàn khoảng trắng**: Nút gửi bị vô hiệu hoá, chặn gửi để tránh lãng phí request.
2. **Khóa mạng / Lỗi gọi Google API quá tải (Quota Exceeded / Timeout)**: Tự động bắt Exception và chuyển sang Offline Farm Reasoning Engine trả lời người dùng, kèm thông báo Toast giải thích nhẹ nhàng.
3. **Màn hình điện thoại / Tablet thu nhỏ**: Chiều rộng khung chat tự co dãn `max-width: calc(100vw - 32px)`, chiều cao tự thích ứng `max-height: calc(100vh - 120px)`.
