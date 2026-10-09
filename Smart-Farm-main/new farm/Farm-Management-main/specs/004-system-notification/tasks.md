# Tasks: Hệ thống Thông báo Kích hoạt theo Sự kiện Demo (Event-Driven Notification System)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Ready for Implementation (Chờ hiệu lệnh bắt đầu triển khai code)

---

## Danh sách công việc theo chuẩn 4 bước (Task Checklist)

### Subtask 1: Backend API & Tự động tạo Thông báo khi Bật/Tắt Thiết bị
- [ ] **T001** `[odoo-backend-developer]` Xây dựng API `POST /smart_farm/api/alert/create` và nâng cấp API `control_zone_device` trong `smart_farm/controllers/main.py`: tự động tạo bản ghi `smart.farm.alert` khi bật/tắt thiết bị (quạt thông gió, phun sương, tưới nhỏ giọt, bơm) và trả về đối tượng `alert` kèm `unresolved_count`.
- [ ] **T002** `[odoo-code-reviewer]` Soi diff `smart_farm/controllers/main.py`, kiểm tra cú pháp Python, try/catch exception, định dạng JSON và tính toàn vẹn của logic điều khiển.
- [ ] **T003** Lập trình viên nghiệm thu (F5 Odoo, test thử thao tác bật/tắt quạt hoặc gọi API), xác nhận bản ghi cảnh báo được sinh chuẩn trong database.
- [ ] **T004** Commit: `feat(smart_farm): subtask 1 - auto-create alerts on zone device toggle`

---

### Subtask 2: Tự động tạo Thông báo khi Tạo mới & Cập nhật Công việc
- [ ] **T005** `[odoo-backend-developer]` Nâng cấp API `create_task` và `toggle_task` trong `smart_farm/controllers/main.py`: tự động tạo bản ghi `smart.farm.alert` khi tạo công việc mới và khi đánh dấu hoàn thành công việc.
- [ ] **T006** `[odoo-code-reviewer]` Soi diff `smart_farm/controllers/main.py`, kiểm tra logic tạo alert không làm ảnh hưởng đến luồng CRUD và tính toán bộ đếm công việc.
- [ ] **T007** Lập trình viên nghiệm thu (F5 Odoo, thêm 1 công việc mới và tick hoàn thành), xác nhận thông báo được ghi nhận chính xác vào bảng `smart.farm.alert`.
- [ ] **T008** Commit: `feat(smart_farm): subtask 2 - auto-create alerts on task events`

---

### Subtask 3: Frontend Real-time Push Engine & Hiệu ứng Trượt Dropdown
- [ ] **T009** `[odoo-frontend-styler]` Xây dựng hàm `sfPushNotification(alertData, unresolvedCount)` trong `smart_farm/static/src/js/dashboard.js`, gắn callback vào luồng bật/tắt thiết bị và tạo việc mới; bổ sung animation `@keyframes sfSlideInDown` và `.sf-notif-new-highlight` trong `smart_farm/static/src/css/dashboard.css`.
- [ ] **T010** `[odoo-code-reviewer]` Soi diff `dashboard.js` và `dashboard.css`, kiểm tra không syntax error, đảm bảo cơ chế tự động ẩn empty state và cắt tỉa giữ tối đa 15 item trên DOM.
- [ ] **T011** Lập trình viên nghiệm thu (mở Dashboard, bấm bật quạt hoặc thêm việc), xác nhận thông báo trượt vào tức thì ở đầu danh sách, huy hiệu chuông nhảy số đếm, không cần reload trang.
- [ ] **T012** Commit: `feat(smart_farm): subtask 3 - real-time notification push and animation`

---

### Subtask 4: Mô phỏng Cảnh báo Cảm biến Demo & Kiểm thử Toàn diện
- [ ] **T013** `[odoo-fullstack-dev]` Xây dựng tiện ích `sfSimulateSensorAlert(zone, sensorType)` trong `dashboard.js` giả lập cảnh báo vượt ngưỡng nhiệt độ/độ ẩm, kết nối radar beacon trên bản đồ và cập nhật tài liệu `smart_farm/docs/CHANGED.md`.
- [ ] **T014** `[odoo-code-reviewer]` Soi diff toàn bộ các file đã thay đổi, kiểm tra tính nhất quán mã nguồn và tài liệu kỹ thuật.
- [ ] **T015** Lập trình viên nghiệm thu (F5 Odoo, kiểm tra tổng thể toàn bộ các kịch bản demo: bật/tắt thiết bị, tạo việc, xử lý 1-chạm, xử lý tất cả), xác nhận 0 visual regression.
- [ ] **T016** Commit: `feat(smart_farm): subtask 4 - simulated sensor alerts and comprehensive verification`
