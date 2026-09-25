# Tasks: Quản lý Công việc Nông trại (Farm Task Management)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Ready to Execute

---

## Danh sách công việc theo từng giai đoạn (Task Checklist)

### Giai đoạn 1: Nền tảng dữ liệu (Data & Security)
- [ ] **T001**: Tạo model `smart.farm.task` tại `smart_farm/models/task.py` với đầy đủ các trường: `name`, `task_type`, `date`, `is_done`, `user_id`, `notes`.
- [ ] **T002**: Import `task` vào `smart_farm/models/__init__.py`.
- [ ] **T003**: Cấu hình phân quyền truy cập cho model `smart.farm.task` trong file `smart_farm/security/ir.model.access.csv`.

---

### Giai đoạn 2: Giao diện quản trị Odoo Backend
- [ ] **T004**: Tạo file giao diện `smart_farm/views/task_views.xml` bao gồm List view, Form view, Search view và action `action_smart_farm_task`.
- [ ] **T005**: Khai báo menuitem "Công việc" trong `smart_farm/views/menu.xml`.
- [ ] **T006**: Đăng ký file `views/task_views.xml` vào danh sách `'data'` trong `smart_farm/__manifest__.py`.

---

### Giai đoạn 3: Backend Controller & API
- [ ] **T007**: Cập nhật hàm `dashboard` trong `smart_farm/controllers/main.py`: truy vấn danh sách task có ngày là hôm nay (`date = fields.Date.today()`) và tính toán số task đã hoàn thành / còn lại.
- [ ] **T008**: Tạo route API `POST /smart_farm/api/task/toggle` trong `smart_farm/controllers/main.py` để cập nhật trạng thái `is_done` cho task và trả về JSON kết quả.

---

### Giai đoạn 4: Dashboard Frontend & Tương tác AJAX
- [ ] **T009**: Chỉnh sửa card "Công việc hôm nay" trong `smart_farm/views/dashboard.xml`: xóa bỏ HTML tĩnh demo, thay bằng vòng lặp `<t t-foreach="tasks" t-as="task">` render dữ liệu thật từ Controller.
- [ ] **T010**: Bổ sung hàm Javascript `sfToggleTask(taskId, element)` trong `smart_farm/static/src/js/dashboard.js` để gửi AJAX khi click vào checkbox và cập nhật giao diện mượt mà không cần reload trang.

---

### Giai đoạn 5: Nâng cấp Module & Kiểm thử (Verification & Docs)
- [ ] **T011**: Nâng cấp (Upgrade) module `smart_farm` trong Odoo để áp dụng bảng mới và view mới vào database.
- [ ] **T012**: Tạo dữ liệu mẫu thực tế trong Odoo (3 - 5 công việc hôm nay) và kiểm tra hiển thị trên Dashboard.
- [ ] **T013**: Kiểm tra chức năng click checkbox toggle trạng thái hoàn thành trực tiếp trên Dashboard.
- [ ] **T014**: Ghi chép cập nhật vào `CHANGED.md` và `UI/UI-Change.md`.
