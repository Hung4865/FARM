# Tasks: Trợ Lý Trí Tuệ Nhân Tạo Nông Nghiệp Thông Minh (Agri-Copilot AI tích hợp Google Gemini)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Hoàn thành & Đã nghiệm thu toàn diện (Completed & Verified)

---

## Danh Sách Công Việc Theo Chuẩn 4 Bước Bắt Buộc

### Subtask 1: Backend AI Controller, Google Gemini REST API & Ngữ Cảnh Nông Trại
*Mục tiêu nghiệm thu: Endpoint `/smart_farm/api/ai/chat` tiếp nhận tin nhắn, thu thập chính xác dữ liệu cảm biến nông trường thực tế (độ ẩm 3 khu A/B/C, thời tiết, GPS, alert, tasks), gọi Gemini 1.5 Flash khi có key và chạy Offline Reasoning Engine khi không có key, trả về 200 OK kèm lời khuyên canh tác sắc bén.*

- [x] **T001** `[backend-developer]`
  1. Thêm endpoints `/smart_farm/api/ai/save_key`, `/smart_farm/api/ai/get_key_status` và `/smart_farm/api/ai/chat` trong `smart_farm/controllers/main.py`.
  2. Xây dựng logic tổng hợp trạng thái cảm biến thực địa và cơ chế Offline Farm Reasoning Engine.
  3. Tích hợp thư viện `requests` gọi Google Gemini REST API (`gemini-1.5-flash`).
- [x] **T002** `[code-reviewer]` Soi git diff `main.py`, kiểm tra việc xử lý ngoại lệ mạng, bảo vệ `auth='user'` và tính toàn vẹn dữ liệu ORM.
- [x] **T003** Lập trình viên nghiệm thu: Chạy script test Python gọi trực tiếp `/smart_farm/api/ai/chat`, xác nhận phản hồi 200 OK với dữ liệu cảm biến chuẩn xác (Khu A: 72%, Khu B: 38% cần tưới, thời tiết Hà Nội 24.3°C, 4 phương tiện GPS).
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - backend gemini ai controller and farm reasoning engine`

---

### Subtask 2: Giao Diện Chatbox, FAB Nổi Tinh Gọn, Chip Gợi Ý & Dark Mode
*Mục tiêu nghiệm thu: Trên Dashboard xuất hiện nút bấm nổi tròn 52px phát sáng gradient lấp lánh; tooltip nhãn tên tự ẩn chống vướng mắt; bấm mở khung chat Agri-Copilot với 5 chip gợi ý 1 chạm; ngăn kéo cấu hình API key ⚙️; hiển thị hoàn hảo ở cả Light Mode và Dark Slate Mode.*

- [x] **T005** `[frontend-developer]`
  1. Bổ sung cấu trúc widget `#sf-ai-fab-container` và `#sf-ai-chat-window` vào `smart_farm/views/dashboard.xml`.
  2. Bổ sung styles trong `smart_farm/static/src/css/dashboard.css`: FAB 52px, hiệu ứng glow, typing bounce, bubble chat, ẩn tooltip mặc định (`opacity: 0`), đồng bộ Dark Slate overrides.
  3. Bổ sung logic tương tác trong `smart_farm/static/src/js/dashboard.js`: toggle chatbox, quick prompts, Markdown formatter, quản lý API key `localStorage`.
  4. Tăng cache buster `dashboard.css?v=151` và `dashboard.js?v=145`.
- [x] **T006** `[code-reviewer]` Soi git diff `dashboard.xml`, `dashboard.css`, `dashboard.js`, kiểm tra độ tương phản Light/Dark Mode, hiệu năng animation và tính an toàn XSS khi render tin nhắn.
- [x] **T007** Lập trình viên nghiệm thu: Mở trình duyệt Dashboard, kiểm tra nút FAB gọn gàng không che khuất, bấm mở chat gửi câu hỏi và nhận câu trả lời phân tích tức thì.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - ai chatbox widget, sleek fab, quick chips and dark slate styling`
