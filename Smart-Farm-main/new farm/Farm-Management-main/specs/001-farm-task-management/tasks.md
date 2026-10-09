# Tasks: Quản lý Công việc Nông trại (Farm Task Management)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Completed (Đã hoàn thành 100%)

---

## Danh sách công việc theo chuẩn 4 bước (Task Checklist)

### Subtask 1: Nền tảng Dữ liệu & Phân quyền (Data & Security)
- [x] **T001** `[odoo-backend-developer]` Tạo model `smart.farm.task` tại `smart_farm/models/task.py` với các trường `name`, `task_type`, `date`, `is_done`, `user_id`, `notes`; import vào `__init__.py` và cấp quyền CRUD trong `smart_farm/security/ir.model.access.csv`.
- [x] **T002** `[odoo-code-reviewer]` Soi diff model và file bảo mật, kiểm tra schema bảng dữ liệu và quyền truy cập người dùng/quản trị viên.
- [x] **T003** Lập trình viên nghiệm thu (F5 Odoo, upgrade module), xác nhận bảng `smart_farm_task` và các trường đã sinh đúng trong database PostgreSQL.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - implement smart.farm.task model and security access`

---

### Subtask 2: Giao diện Quản trị Backend Odoo (Backend Views & Menu)
- [x] **T005** `[odoo-backend-developer]` Xây dựng `smart_farm/views/task_views.xml` (List view, Form view, Search view, action `action_smart_farm_task`), khai báo menuitem trong `views/menu.xml` và đăng ký vào `'data'` trong `__manifest__.py`.
- [x] **T006** `[odoo-code-reviewer]` Soi diff file XML, kiểm tra cú pháp QWeb, cấu trúc thẻ view và liên kết action window.
- [x] **T007** Lập trình viên nghiệm thu (F5 Odoo), xác nhận menu "Công việc" xuất hiện trên thanh điều hướng Odoo và thao tác CRUD tạo/sửa task mượt mà.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - backend list, form views and menu configuration`

---

### Subtask 3: Backend Controller & API AJAX (Controller & Toggle API)
- [x] **T009** `[odoo-backend-developer]` Cập nhật controller `dashboard` trong `smart_farm/controllers/main.py`: truy vấn danh sách công việc, tính số lượng đã xong/còn lại; xây dựng API `POST /smart_farm/api/task/toggle` cập nhật `is_done`.
- [x] **T010** `[odoo-code-reviewer]` Soi diff controller, kiểm tra logic xử lý JSON response, auth='user', và bảo mật API.
- [x] **T011** Lập trình viên nghiệm thu (gọi API toggle task, F5 Odoo), xác nhận trạng thái task đảo chiều chính xác và trả về bộ đếm chuẩn.
- [x] **T012** Commit: `feat(smart_farm): subtask 3 - dashboard task controller and toggle api endpoint`

---

### Subtask 4: Dashboard Frontend & Tương tác Task (QWeb Template & Toggle AJAX)
- [x] **T013** `[odoo-frontend-styler]` Chỉnh sửa card công việc trong `smart_farm/views/dashboard.xml`: render động danh sách task; viết hàm JS `sfToggleTask(taskId, element)` trong `dashboard.js` xử lý click checkbox không reload trang.
- [x] **T014** `[odoo-code-reviewer]` Soi diff QWeb và JavaScript, kiểm tra class styling gạch ngang chữ khi done và cập nhật icon checkbox.
- [x] **T015** Lập trình viên nghiệm thu (mở Dashboard, click checkbox hoàn thành việc), xác nhận giao diện chuyển trạng thái tức thì không reload.
- [x] **T016** Commit: `feat(smart_farm): subtask 4 - dynamic task card render and ajax toggle interaction`

---

### Subtask 5: Nâng cấp Hiển thị Toàn bộ Việc & Tối ưu Đồng bộ (Task Bug Fixes & UX Optimization)
- [x] **T017** `[odoo-fullstack-dev]` Mở rộng query `all_tasks` không giới hạn theo ngày, thêm thanh cuộn `max-height: 240px` và render ghi chú `notes` trong `dashboard.xml`; bổ sung cơ chế fallback tự đếm DOM trong `sfSyncTaskUI` và empty state trong `sfDeleteTask` tại `dashboard.js`.
- [x] **T018** `[odoo-code-reviewer]` Soi diff toàn bộ controller, view và JS, kiểm tra không lỗi tràn layout, không âm số đếm khi xóa task.
- [x] **T019** Lập trình viên nghiệm thu (F5 Odoo, test cuộn danh sách, test xóa task và xem ghi chú), xác nhận 0 visual regression.
- [x] **T020** Commit: `fix(smart_farm): subtask 5 - optimize all tasks display, notes render and counter sync`
