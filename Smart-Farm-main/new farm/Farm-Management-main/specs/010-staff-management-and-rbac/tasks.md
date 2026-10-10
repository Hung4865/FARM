# Task List: Quản Lý Nhân Sự & Phân Quyền Đa Tầng (Staff Management & RBAC)

**Feature Branch**: `010-staff-management-and-rbac`  
**Phase**: Bước 3 của Feature Development Lifecycle Policy  
**Spec Reference**: [`specs/010-staff-management-and-rbac/spec.md`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/specs/010-staff-management-and-rbac/spec.md)  
**Plan Reference**: [`specs/010-staff-management-and-rbac/plan.md`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/specs/010-staff-management-and-rbac/plan.md)

---

## Danh Sách Subtasks Tuân Thủ Chuẩn 4 Bước Bắt Buộc

### Subtask 1: Backend Data Model & Nền Tảng Phân Quyền RBAC
Xây dựng mô hình dữ liệu vai trò người dùng trong Odoo, truyền ngữ cảnh phân quyền vào controller và bảo mật các API endpoints.

- [x] **Bước 1: Xử lý code** `[developer]`
  - Tạo model `smart_farm/models/res_users.py` kế thừa `res.users` với trường `smart_farm_role` (`admin`, `manager`, `staff`) và hàm `get_smart_farm_effective_role()`.
  - Khai báo model mới trong `smart_farm/models/__init__.py`.
  - Cập nhật Controller `/smart_farm/dashboard` trong `smart_farm/controllers/main.py`: tính toán `user_role`, `is_admin`, `is_manager`, `is_staff` và lấy danh sách `staff_members` cùng số lượng công việc được giao/hoàn thành.
  - Bổ sung API `/smart_farm/api/user/set_role` (chỉ Admin mới được gọi).
  - Cập nhật các API task CRUD (`/smart_farm/api/task/create`, `/update`, `/delete`): chặn quyền nếu người gọi là `staff`, cho phép chọn người phụ trách `user_id`.
- [x] **Bước 2: Review diff** `[code-reviewer]`
  - Kiểm tra `git diff`, đảm bảo không lỗi cú pháp Python, bảo vệ tài khoản Superuser ID 2 không bị hạ quyền.
- [x] **Bước 3: Lập trình viên nghiệm thu F5 Odoo** `[developer-verify]`
  - Khởi động lại container Odoo, nâng cấp module `smart_farm`, kiểm tra schema database và endpoint không phát sinh lỗi.
- [x] **Bước 4: Commit** `[git-commit]`
  - Tạo commit với format: `feat(rbac): subtask 1 - backend user roles and rbac endpoints`

---

### Subtask 2: Tối Ưu Navbar Dynamic Visibility & Kiểm Soát Nút Cài Đặt ⚙️
Bổ sung tab `"Nhân sự"` ngắn gọn trên thanh điều hướng, ẩn/hiện các tab và nút Cài đặt ⚙️ theo từng vai trò.

- [x] **Bước 1: Xử lý code** `[developer]`
  - Cập nhật thanh điều hướng trong `smart_farm/views/dashboard.xml`:
    - Thêm nút tab `"Nhân sự"` kế tiếp `"Kho & Sản phẩm"` (`onclick="sfOpenTab(event, 'tab-staff')"`).
    - Thêm điều kiện QWeb `t-if="user_role in ['admin', 'manager']"` cho tab `"Kho & Sản phẩm"` và `"Nhân sự"` (ẩn đối với `staff`).
    - Thêm điều kiện QWeb `t-if="user_role == 'admin'"` cho nút Cài đặt (⚙️) (ẩn đối với `manager` và `staff`).
    - Đảm bảo 2 icon Chế độ sáng/tối 🌙 và Chuông thông báo 🔔 hiển thị đầy đủ cho cả 3 vai trò.
  - Cập nhật hàm điều hướng tab trong `smart_farm/static/src/js/dashboard.js` để hỗ trợ hiển thị tab `tab-staff`.
- [x] **Bước 2: Review diff** `[code-reviewer]`
  - Kiểm tra diff XML và JS, đối chiếu selector QWeb không xung đột với các thẻ khác.
- [x] **Bước 3: Lập trình viên nghiệm thu F5 Odoo** `[developer-verify]`
  - F5 Dashboard Odoo, kiểm tra trực quan giao diện Navbar hiển thị đúng số lượng tab và icon theo quyền tài khoản hiện tại.
- [x] **Bước 4: Commit** `[git-commit]`
  - Tạo commit với format: `feat(navbar): subtask 2 - dynamic tabs visibility and settings gear access control`

---

### Subtask 3: Giao Diện Phân Hệ Quản Lý Nhân Sự & Giao Việc (Tab "Nhân sự")
Xây dựng giao diện hiển thị danh sách nhân sự thực tế, bộ lọc, thẻ thông tin nhân viên, tính năng gán vai trò (cho Admin) và giao việc trực tiếp (Admin & Manager).

- [x] **Bước 1: Xử lý code** `[developer]`
  - Thêm container `<div id="tab-staff" class="sf-tab-content">` trong `smart_farm/views/dashboard.xml`:
    - Khối thống kê nhân sự (Tổng nhân sự, Quản lý, Nhân viên, Tỷ lệ việc hoàn thành).
    - Thanh tìm kiếm nhân sự theo tên/email và bộ lọc vai trò (Tất cả, Quản lý, Nhân viên).
    - Danh sách thẻ nhân viên nông trại trực quan (Avatar, Tên, Email, SĐT, Badge vai trò, thanh tiến độ công việc).
    - Nút "Giao việc" trên từng thẻ nhân viên (kích hoạt mở modal tạo task với người phụ trách được chọn sẵn).
    - Nút / Dropdown `Set Role` đổi vai trò: Chỉ hiển thị cho Admin, ẩn đối với Manager; vô hiệu hóa thao tác trên Superuser ID 2.
  - Bổ sung CSS giao diện nhân sự chuyên nghiệp trong `smart_farm/static/src/css/dashboard.css`.
  - Bổ sung JS logic trong `smart_farm/static/src/js/dashboard.js`: tìm kiếm/lọc thẻ nhân viên, gọi API `/smart_farm/api/user/set_role`, mở modal giao việc.
- [x] **Bước 2: Review diff** `[code-reviewer]`
  - Kiểm tra toàn bộ diff QWeb XML, CSS, JS, đảm bảo tính responsive trên mobile và desktop.
- [x] **Bước 3: Lập trình viên nghiệm thu F5 Odoo** `[developer-verify]`
  - F5 Odoo, kiểm tra tab Nhân sự: tìm kiếm nhân viên, thử nghiệm tính năng đổi vai trò từ Admin và thử nghiệm nút Giao việc.
- [x] **Bước 4: Commit** `[git-commit]`
  - Tạo commit với format: `feat(staff): subtask 3 - staff management directory and role assignment ui`

---

### Subtask 4: Phân Quyền Thao Tác Công Việc (Tasks) & Drawer Chi Tiết Nhiệm Vụ
Tách biệt thẩm quyền trên danh sách công việc: Staff chỉ xem chi tiết và tích hoàn thành; Admin/Manager toàn quyền CRUD và chọn người phụ trách.

- [ ] **Bước 1: Xử lý code** `[developer]`
  - Cập nhật `smart_farm/views/dashboard.xml` ở phân hệ `tab-tasks`:
    - Điều kiện hóa nút `+ Thêm công việc`: Chỉ render cho Admin & Manager (`t-if="user_role in ['admin', 'manager']"`).
    - Điều kiện hóa nút `Sửa` và `Xóa` trên từng thẻ task: Chỉ render cho Admin & Manager.
    - Điều kiện hóa tay cầm kéo thả `⋮⋮`: Ẩn đối với `staff`.
    - Bổ sung Drawer/Modal Xem chi tiết nhiệm vụ (Task Detail Viewer) cho nhân viên khi bấm vào thẻ việc (hiển thị tiêu đề, ngày, loại việc, người giao, ghi chú).
    - Giữ nguyên nút tích checkbox `✓` cho phép nhân viên tích hoàn thành việc của mình.
    - Bổ sung trường chọn "Người phụ trách" (`user_id`) trong form modal tạo/sửa công việc dành cho Admin và Manager.
  - Cập nhật JS trong `smart_farm/static/src/js/dashboard.js`: xử lý sự kiện click thẻ task mở drawer chi tiết khi là Staff, gửi `user_id` khi tạo/sửa việc.
- [ ] **Bước 2: Review diff** `[code-reviewer]`
  - Soi diff XML, JS và CSS, đảm bảo không có lỗ hổng bypass từ client.
- [ ] **Bước 3: Lập trình viên nghiệm thu F5 Odoo** `[developer-verify]`
  - F5 Odoo, kiểm tra toàn bộ luồng nghiệp vụ của cả 3 vai trò:
    1. Admin: Thấy mọi thứ, đổi role, giao việc, xóa việc.
    2. Manager: Ẩn nút ⚙️, không đổi được role, thêm/sửa việc và giao việc tốt.
    3. Staff: Chỉ thấy 3 tab, ẩn nút ⚙️, ẩn nút thêm/sửa/xóa việc, xem được chi tiết việc và tích hoàn thành việc.
- [ ] **Bước 4: Commit** `[git-commit]`
  - Tạo commit với format: `feat(tasks): subtask 4 - staff task execution drawer and role-based action controls`
