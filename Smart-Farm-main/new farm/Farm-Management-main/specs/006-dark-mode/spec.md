# Specification: Chế độ Giao diện Tối & Độ Tương Phản Cao (Dark Slate Theme & High-Contrast Mode)

**Feature ID**: `006-dark-mode`  
**Nhánh Git**: `Update-UI`  
**Trạng thái**: Draft / Chờ người dùng xác nhận Spec (Bước 1/4)

---

## 1. Mục tiêu (Objective)
Hiện tại giao diện Smart Farm Dashboard đang sử dụng tông màu Sáng (Light Mode - nền `#eef2f6`, thẻ card `#ffffff`), trên một số màn hình có độ sáng cao hoặc độ tương phản thấp dễ tạo cảm giác chói mắt, bạc màu và khó phân biệt ranh giới giữa các khối thẻ dữ liệu (như thể hiện ở **Ảnh 1**). Khi người dùng bật tính năng chụp ảnh màn hình của hệ điều hành, màn hình được phủ lớp làm tối dịu mắt (như ở **Ảnh 2**), giúp các viền card, số liệu quan trắc, icon và badge màu sắc nổi khối cực kỳ rõ nét và ấn tượng.

Mục tiêu của tính năng này là xây dựng chế độ **Giao diện Tối Sleek Slate (Dark Mode)** tái hiện chuẩn xác tông màu dịu mắt, tương phản cao như Ảnh 2, tích hợp nút chuyển đổi **🌙 / ☀️** tiện lợi trên thanh Navbar và duy trì trạng thái qua `localStorage`.

---

## 2. Yêu cầu & Kịch bản người dùng (User Stories & Acceptance Criteria)

### User Story 1: Nút chuyển đổi Giao diện Tối / Sáng tức thời trên Navbar
*Là người quản lý nông trại, tôi muốn có một nút bấm nhanh để chuyển đổi qua lại giữa Giao diện Sáng và Giao diện Tối ngay trên thanh điều hướng để tôi có thể chọn tông màu phù hợp nhất với điều kiện ánh sáng của mắt.*

- **AC 1.1**: Trên thanh Navbar (cạnh nút Quả chuông 🔔 và avatar người dùng), hiển thị một nút toggle tròn thanh lịch với biểu tượng:
  - Khi đang ở giao diện Sáng: hiển thị icon mặt trăng **🌙** (với tooltip *"Chuyển sang Chế độ Tối"*).
  - Khi đang ở giao diện Tối: hiển thị icon mặt trời **☀️** (với tooltip *"Chuyển sang Chế độ Sáng"*).
- **AC 1.2**: Khi người dùng click vào nút, toàn bộ giao diện dashboard chuyển đổi trạng thái màu sắc ngay lập tức mà không cần phải tải lại (reload) trang.
- **AC 1.3**: Hiệu ứng chuyển đổi màu nền và màu thẻ được áp dụng mượt mà (`transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease`).

---

### User Story 2: Bảng màu Dark Slate chuẩn theo phong cách Ảnh 2
*Là người dùng, tôi muốn khi bật Chế độ Tối thì màu sắc giao diện phải sâu, các khối thẻ nổi rõ, số liệu sắc nét và không bị lóa mắt giống hệt như ảnh chụp màn hình.*

- **AC 2.1**: **Nền chính trang** (`body`, `.sf-wrap`, `.sf-navbar-sticky`): chuyển sang tông Slate tối sâu `#0f172a` (hoặc `#111827`).
- **AC 2.2**: **Thanh Navbar & Thẻ Card** (`.sf-navbar`, `.sf-card`, `.sf-stat-card`, `.sf-map-card-pro`): chuyển sang nền xám than `#1e293b` với viền sắc nét `#334155` cùng bóng đổ mờ nhẹ tạo chiều sâu 3D.
- **AC 2.3**: **Chữ & Số liệu**:
  - Tiêu đề chính, số liệu quan trắc to (`24.4°C`, `12.4 ha`, `0 bản ghi`): chuyển sang màu trắng sáng `#f8fafc`.
  - Nhãn phụ, thông tin chú thích: chuyển sang xám bạc dịu mắt `#94a3b8`.
- **AC 2.4**: **Thẻ Thời tiết & Dự báo 4 ngày**:
  - Dải 4 ô dự báo động (`.sf-fc-day`): chuyển sang nền `#334155`, viền `#475569`, chữ trắng, hover sáng nhẹ.
  - Lời khuyên nông nghiệp: chuyển sang nền `#064e3b` / viền `#059669` / chữ `#6ee7b7` thanh nhã trên nền tối.
- **AC 2.5**: **Badge trạng thái & Điểm nhấn**:
  - Badge `Trực tiếp`, `Mẫu`, `Từ Odoo`, `Cần làm` giữ nguyên độ nhận diện màu sắc (xanh lá, xanh dương, vàng) nhưng sử dụng tông nền tối hòa hợp (`rgba(...)`) chống chói.
  - Bảng danh sách công việc nông trại và log cảnh báo hiển thị rõ ràng, đường phân cách không bị lem.

---

### User Story 3: Ghi nhớ trạng thái giao diện qua `localStorage`
*Là người dùng, tôi muốn hệ thống ghi nhớ chế độ giao diện tôi đã chọn để khi tải lại trang (F5) hoặc mở tab mới, giao diện vẫn giữ nguyên màu sắc yêu thích mà không phải bấm lại.*

- **AC 3.1**: Lựa chọn của người dùng được lưu trữ tự động vào `localStorage.setItem('sf_theme', 'dark' | 'light')`.
- **AC 3.2**: Cơ chế áp dụng theme sớm (Early execution script) được đặt ngay ở đầu thẻ `<head>` trong `dashboard.xml` để khi F5 trang, class `sf-dark-mode` được gắn vào thẻ `<html>` hoặc `<body>` ngay lập tức, ngăn ngừa hoàn toàn hiện tượng nhấp nháy trắng (FOUC - Flash of Unstyled Content).

---

## 3. Các trường hợp ngoại lệ (Edge Cases)

1. **Canvas 3D Nhà Màng & Bản Đồ Tọa Độ**: Nền canvas Three.js và bản đồ tương tác vẫn hoạt động bình thường, các bảng điều khiển trượt (Zone Drawer, Plant Drawer) khi mở ra cũng tự động khoác giao diện tối đồng bộ.
2. **Toast Notification**: Card Toast nổi bật trên nền tối với viền và shadow rõ ràng, giữ trọn thanh tiến trình đếm ngược 4s.
3. **Trình duyệt ở Chế độ Ẩn danh (Private/Incognito)**: Nếu `localStorage` bị hạn chế ghi, hệ thống không gây ra lỗi JavaScript trong console mà tự động áp dụng theme cho phiên làm việc hiện tại.

---

## 4. Kế hoạch nghiệm thu trực quan (Acceptance Verification)

- **Bước kiểm thử**: Người dùng mở `http://localhost:8060/smart_farm/dashboard`, thấy nút 🌙 trên thanh Navbar.
- **Hành động**: Nhấp vào nút 🌙: Toàn bộ Dashboard chuyển sang tông xám than đậm chất Sleek Slate, các card và số liệu nổi rõ ràng y hệt như Ảnh 2.
- **Kiểm tra F5**: Nhấn F5 tải lại trang $\rightarrow$ Dashboard vẫn giữ nguyên Chế độ Tối mà không bị chớp trắng.
