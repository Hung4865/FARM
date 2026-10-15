# Feature Specification: Quản Lý Nhân Sự & Phân Quyền Đa Tầng (Farm Staff Management & RBAC)

**Feature Branch**: `010-staff-management-and-rbac`  
**Created**: 2026-10-10  
**Status**: Chờ Duyệt Đặc Tả (Bước 1 của Lifecycle Policy)  
**Input**: Yêu cầu bổ sung phân hệ Quản lý Nhân sự trên Navbar với tiêu đề ngắn gọn `"Nhân sự"` và thiết lập hệ thống Phân quyền người dùng dựa trên vai trò (Role-Based Access Control - RBAC) 3 cấp: **Quản Trị Viên (Admin)**, **Quản Lý (Manager)**, và **Nhân Viên (Staff)**. Mỗi cấp quyền sở hữu phạm vi truy cập giao diện, thẩm quyền thao tác công việc (tasks) và các nút điều hướng Navbar riêng biệt.

---

## 1. Mục Tiêu (Objective)

1. **Bổ Sung Tab Navbar Ngắn Gọn ("Nhân sự")**:
   - Thêm nút tab `"Nhân sự"` (2 từ ngắn gọn, thanh lịch, không làm tràn hay dài thanh điều hướng).
   - Vị trí trên Navbar: `[ Tổng quan ] [ Công việc ] [ Bản đồ ] [ Kho & Sản phẩm ] [ Nhân sự ]`.
2. **Hệ Thống Phân Quyền 3 Vai Trò (3-Tier RBAC Architecture)**:
   - **Cấp 1 - Quản Trị Viên (Admin)**:
     - Toàn quyền tối cao trên toàn hệ thống (Superuser).
     - Thấy toàn bộ 5 tab trên Navbar (`Tổng quan`, `Công việc`, `Bản đồ`, `Kho & Sản phẩm`, `Nhân sự`).
     - Có nút biểu tượng Cài Đặt (Bánh răng ⚙️) trên góc phải Navbar.
     - Quản lý Nhân sự: Xem danh sách, tìm kiếm, lọc, gán vai trò (`Manager` hoặc `Staff`), giao việc trực tiếp cho nhân sự.
     - Quản lý Công việc: Toàn quyền Thêm, Sửa, Xóa, Giao việc, Thay đổi trạng thái task.
   - **Cấp 2 - Quản Lý (Manager)**:
     - Thấy các tab: `Tổng quan`, `Công việc`, `Bản đồ`, `Kho & Sản phẩm`, `Nhân sự`.
     - Phân hệ Nhân sự: Xem danh sách nhân viên, xem tiến độ công việc được giao, giao việc cho nhân viên; **TUYỆT ĐỐI KHÔNG** được phép thay đổi vai trò (Role) của nhân viên.
     - Phân hệ Công việc: Được quyền Thêm, Sửa, Xóa, Giao việc cho nhân viên.
     - Nút Cài Đặt (Bánh răng ⚙️): **ẨN HOÀN TOÀN** (chỉ thấy 2 icon: Chế độ sáng/tối 🌙 và Chuông thông báo 🔔).
   - **Cấp 3 - Nhân Viên (Staff)**:
     - Chỉ được truy cập 3 tab cơ bản: `Tổng quan`, `Công việc`, `Bản đồ` (Ẩn tab `Kho & Sản phẩm` và ẩn tab `Nhân sự`).
     - Phân hệ Công việc:
       - **KHÔNG** được thêm, sửa, xóa công việc (ẩn các nút thêm/sửa/xóa).
       - Được nhấp vào xem bảng chi tiết nhiệm vụ (Drawer / Modal chi tiết).
       - Được quyền tích hoàn thành / cập nhật trạng thái nhiệm vụ được giao cho mình.
     - Nút Cài Đặt (Bánh răng ⚙️): **ẨN HOÀN TOÀN** (chỉ thấy 2 icon: Chế độ sáng/tối 🌙 và Chuông thông báo 🔔).
3. **Quản Lý Tài Khoản Thực Tế (Không Dùng Dữ Liệu Demo)**:
   - Hệ thống dựa trên dữ liệu người dùng thật của Odoo (`res.users` / `res.partner`), quản trị viên tự tạo tài khoản nhân viên thật trên hệ thống để gán vai trò và phân công.

---

## 2. Ma Trận Phân Quyền Chi Tiết (RBAC Matrix)

| Chức năng / Vùng giao diện | Quản trị viên (Admin) | Quản lý (Manager) | Nhân viên (Staff) |
| :--- | :---: | :---: | :---: |
| **Tab Navbar: Tổng quan** | ✅ Hiển thị | ✅ Hiển thị | ✅ Hiển thị |
| **Tab Navbar: Công việc** | ✅ Hiển thị | ✅ Hiển thị | ✅ Hiển thị |
| **Tab Navbar: Bản đồ** | ✅ Hiển thị | ✅ Hiển thị | ✅ Hiển thị |
| **Tab Navbar: Kho & Sản phẩm** | ✅ Hiển thị | ✅ Hiển thị | ❌ Ẩn |
| **Tab Navbar: Nhân sự** | ✅ Hiển thị | ✅ Hiển thị | ❌ Ẩn |
| **Navbar: Nút Cài đặt (⚙️)** | ✅ Hiển thị | ❌ Ẩn | ❌ Ẩn |
| **Navbar: Nút Dark Mode & Chuông** | ✅ Hiển thị | ✅ Hiển thị | ✅ Hiển thị |
| **Công việc: Thêm mới / Sửa / Xóa** | ✅ Toàn quyền | ✅ Toàn quyền | ❌ Ẩn nút (Chặn) |
| **Công việc: Xem chi tiết task** | ✅ Xem | ✅ Xem | ✅ Xem |
| **Công việc: Tích hoàn thành task** | ✅ Thực hiện | ✅ Thực hiện | ✅ Tích task được giao |
| **Nhân sự: Xem danh sách & Giao việc** | ✅ Toàn quyền | ✅ Thực hiện | ❌ Không có quyền |
| **Nhân sự: Set Role (Phân quyền vai trò)** | ✅ Toàn quyền | ❌ Bị vô hiệu hóa / Ẩn | ❌ Không có quyền |

---

## 3. User Stories & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### User Story 1: Điều Hướng Navbar Chuẩn Theo Cấp Quyền (Priority: P1)
Là người dùng ở từng vai trò đăng nhập vào Dashboard, tôi muốn thanh điều hướng hiển thị đúng các tab và nút chức năng phù hợp với quyền hạn của mình.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** đăng nhập với vai trò **Admin**, **When** quan sát Navbar, **Then** nhìn thấy đủ 5 tab: `Tổng quan`, `Công việc`, `Bản đồ`, `Kho & Sản phẩm`, `Nhân sự`; và góc phải hiển thị đủ 3 icon: 🌙 (Theme), 🔔 (Chuông), ⚙️ (Cài đặt).
  2. **Given** đăng nhập với vai trò **Manager**, **When** quan sát Navbar, **Then** nhìn thấy 5 tab: `Tổng quan`, `Công việc`, `Bản đồ`, `Kho & Sản phẩm`, `Nhân sự`; nhưng góc phải **CHỈ** hiển thị 2 icon: 🌙 (Theme), 🔔 (Chuông), icon ⚙️ (Cài đặt) bị ẩn hoàn toàn.
  3. **Given** đăng nhập với vai trò **Staff**, **When** quan sát Navbar, **Then** chỉ nhìn thấy 3 tab: `Tổng quan`, `Công việc`, `Bản đồ` (không thấy `Kho & Sản phẩm` và `Nhân sự`); góc phải chỉ thấy 2 icon: 🌙 (Theme), 🔔 (Chuông), icon ⚙️ bị ẩn.

---

### User Story 2: Giao Diện & Quyền Hạn Tab "Nhân Sự" (Priority: P1)
Là Quản trị viên (Admin) hoặc Quản lý (Manager), khi tôi bấm vào tab `"Nhân sự"`, tôi muốn xem danh sách nhân sự nông trại, thông tin liên hệ, tiến độ công việc và có thể giao việc cho họ.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** Admin bấm vào tab `"Nhân sự"`, **When** trang mở ra, **Then** hiển thị danh sách thẻ hoặc bảng nhân sự trực quan (Avatar/Tên, Email, Vai trò hiện tại, Số công việc phụ trách, Trạng thái hoạt động).
  2. **Given** người dùng là **Admin**, **When** xem dòng thông tin nhân viên, **Then** có menu/nút lựa chọn `Set Role` (cho phép chuyển đổi giữa `Manager` và `Staff`), có nút `Giao việc`.
  3. **Given** người dùng là **Manager**, **When** xem dòng thông tin nhân viên, **Then** chỉ thấy thông tin và nút `Giao việc`, phần điều chỉnh `Set Role` bị vô hiệu hóa hoặc ẩn (không thể đổi quyền).
  4. **Given** người dùng là **Staff**, **When** cố tình gõ link trực tiếp vào trang Nhân sự, **Then** hệ thống chặn quyền (Access Denied / Thông báo quyền hạn) và chuyển hướng về Dashboard.

---

### User Story 3: Giới Hạn Thao Tác Trên Quản Lý Công Việc (Tasks) (Priority: P1)
Là Nhân viên (Staff), khi vào tab `"Công việc"`, tôi muốn tập trung xem các công việc của mình và tích hoàn thành khi đã làm xong, không bị phân tâm bởi các nút xóa/sửa hệ thống.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** người dùng là **Staff**, **When** mở tab `"Công việc"`, **Then** nút `+ Thêm công việc mới`, nút `Sửa` và nút `Xóa` thùng rác trên từng thẻ Kanban đều được ẩn đi.
  2. **Given** người dùng là **Staff**, **When** nhấp vào một thẻ công việc, **Then** mở ngăn kéo Drawer hoặc Popup hiển thị đầy đủ chi tiết: Phân khu, người giao, hạn hoàn thành, mô tả nông vụ.
  3. **Given** công việc đang ở trạng thái chưa hoàn thành, **When** nhân viên tích nút hoàn thành, **Then** hệ thống cập nhật trạng thái `Đã xong`, đồng bộ tiến độ và ghi nhận cảnh báo/thông báo hoàn thành.
  4. **Given** người dùng là **Admin** hoặc **Manager**, **When** mở tab `"Công việc"`, **Then** hiển thị đầy đủ nút `+ Thêm công việc`, nút `Sửa`, `Xóa` và có trường chọn nhân viên phụ trách khi tạo/sửa việc.

---

## 4. Edge Cases & Xử Lý Ngoại Lệ

1. **Tài khoản Quản trị viên tối cao (Superuser / ID 2)**: Tuyệt đối không thể tự hạ quyền của chính mình về Staff để tránh tình trạng hệ thống bị mất Admin.
2. **Nhân viên chưa được giao việc nào**: Hiển thị trạng thái trống thân thiện *"Chưa có công việc nào được phân công"* kèm hướng dẫn liên hệ quản lý.
3. **Thay đổi Role tức thời**: Khi Admin chuyển quyền của một nhân viên từ Staff lên Manager (hoặc ngược lại), quyền hạn mới có hiệu lực ngay lập tức trong phiên làm việc tiếp theo hoặc sau khi F5 tải lại trang.
4. **Responsive Mobile**: Trên màn hình điện thoại di động, thanh menu tab tự động co dãn dạng cuộn ngang (`overflow-x: auto`), các thẻ nhân sự tự xếp chồng 1 cột mượt mà.
