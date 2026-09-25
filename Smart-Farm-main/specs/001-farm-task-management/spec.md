# Feature Specification: Quản lý Công việc Nông trại (Farm Task Management)

**Feature Branch**: `001-farm-task-management`  
**Created**: 2026-09-26  
**Status**: Ready for Implementation  
**Input**: Chuyển đổi khối "Công việc hôm nay" trên Dashboard từ dữ liệu demo tĩnh thành hệ thống quản lý công việc động, có lưu trữ trong Database Odoo, hỗ trợ tạo/sửa việc và tương tác hoàn thành trực tiếp trên Web.

---

## 1. Mục tiêu (Objective)

Thay thế dữ liệu tĩnh mẫu của thẻ **"Công việc hôm nay"** trên Dashboard bằng dữ liệu thực tế từ Database:
1. Người quản lý có thể tạo, phân công và quản lý các đầu việc nông trại (tưới tiêu, kiểm tra cảm biến, bón phân, thu hoạch,...) thông qua giao diện Odoo.
2. Dashboard tự động hiển thị danh sách công việc trong ngày hôm nay kèm trạng thái hoàn thành.
3. Người dùng có thể bấm trực tiếp vào ô checkbox trên Dashboard để chuyển đổi trạng thái (xong / chưa xong) thông qua AJAX tức thời mà không phải tải lại trang.

---

## 2. User Scenarios & Testing (Ưu tiên theo P1, P2, P3)

### User Story 1 - Xem công việc thực tế hôm nay trên Dashboard (Priority: P1)

Là một người quản lý nông trại, tôi muốn nhìn thấy danh sách các công việc thực tế được lên lịch cho ngày hôm nay ngay trên Dashboard, để biết được tiến độ công việc trong ngày.

* **Giá trị**: Thay thế hoàn toàn dữ liệu giả (demo) bằng dữ liệu thật trong PostgreSQL.
* **Kiểm thử độc lập**: Tạo 3 task trong Odoo cho ngày hôm nay, mở Dashboard kiểm tra xem có hiển thị đúng 3 task và số lượng đếm hoàn thành hay không.
* **Acceptance Scenarios**:
  1. **Given** có các task có ngày thực hiện là hôm nay trong database, **When** người dùng mở `/smart_farm/dashboard`, **Then** hiển thị đúng danh sách task, tên công việc, thẻ phân loại (Tưới tiêu, Mùa vụ, Cảm biến, Kho, Báo cáo) và tỉ lệ đã xong / còn lại.
  2. **Given** hôm nay không có task nào, **When** mở Dashboard, **Then** hiển thị thông báo thân thiện *"Chưa có công việc nào được lên lịch hôm nay"*.

---

### User Story 2 - Đánh dấu hoàn thành task trực tiếp trên Dashboard (Priority: P1)

Là một nhân viên nông trại đang xem Dashboard, khi hoàn thành một công việc, tôi muốn bấm trực tiếp vào ô checkbox của task đó để đánh dấu hoàn thành (hoặc bỏ hoàn thành), để cập nhật trạng thái tức thời mà không cần vào backend Odoo.

* **Giá trị**: Tăng trải nghiệm UX, thao tác nhanh gọn một chạm (Interactive Dashboard).
* **Kiểm thử độc lập**: Bấm vào checkbox của một việc chưa hoàn thành, thấy checkbox đổi sang dấu tick xanh, chữ gạch ngang mờ đi, và bộ đếm "X hoàn thành / Y còn lại" tự động cập nhật ngay trên màn hình.
* **Acceptance Scenarios**:
  1. **Given** một task đang ở trạng thái chưa xong (`is_done = False`), **When** người dùng click vào ô checkbox, **Then** hệ thống gọi API ngầm cập nhật `is_done = True` trong database và giao diện cập nhật ngay lập tức.
  2. **Given** một task đã hoàn thành, **When** click lại vào checkbox, **Then** task chuyển về trạng thái chưa hoàn thành.

---

### User Story 3 - Quản lý CRUD công việc trong Odoo Backend (Priority: P2)

Là người quản trị, tôi muốn có menu "Công việc" riêng trong Odoo với giao diện danh sách (List view) và biểu mẫu (Form view) để tạo việc mới, gán người thực hiện, chọn ngày và ghi chú chi tiết.

* **Giá trị**: Cho phép tạo và lên lịch công việc linh hoạt cho các ngày tiếp theo.
* **Acceptance Scenarios**:
  1. **Given** người dùng đăng nhập Odoo, **When** vào menu **Smart Farm > Công việc**, **Then** hiển thị danh sách các task với bộ lọc theo trạng thái và ngày.
  2. **Given** form tạo task, **When** điền tiêu đề, chọn ngày, chọn loại thẻ tag và lưu, **Then** bản ghi được lưu thành công vào bảng `smart_farm_task`.

---

## 3. Edge Cases & Xử lý lỗi (Requirements)

1. **Mất kết nối mạng khi bấm checkbox:** Hiển thị thông báo lỗi nhỏ (Toast notification) nếu gọi API AJAX thất bại và hoàn tác trạng thái checkbox về ban đầu.
2. **Quyền truy cập:** API toggle trạng thái chỉ cho phép người dùng đã đăng nhập Odoo thực hiện (auth='user').
3. **Múi giờ (Timezone):** Ngày công việc phải được so sánh chuẩn theo múi giờ địa phương của người dùng (Việt Nam GMT+7).
