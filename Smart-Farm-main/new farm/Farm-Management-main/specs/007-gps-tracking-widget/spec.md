# Feature Specification: Nâng Cấp Widget GPS & Vị Trí Trực Quan (Interactive GPS Mini-Map & Seed Data)

**Feature Branch**: `007-gps-tracking-widget`  
**Created**: 2026-10-10  
**Status**: Chờ Người Dùng Duyệt (Step 1 of Lifecycle)  
**Input**: Yêu cầu người dùng nâng cấp phần GPS & Vị trí trên Dashboard: tự động khởi tạo dữ liệu GPS mẫu (Máy kéo Kubota, Xe tuần tra, Drone, Trạm IoT) và biến widget GPS thành Bản đồ Mini trực quan, sinh động có điểm ghim định vị radar ping và liên kết tab Bản đồ.

---

## 1. Mục Tiêu (Objective)

Nâng cấp card **"GPS & Vị trí"** trên giao diện Tổng quan (Dashboard) từ một ô tĩnh báo trống *"Chưa có dữ liệu GPS"* thành một **Trung tâm Giám sát Vị trí Thu nhỏ (Live GPS Mini Command Widget)**:
1. **Khởi tạo dữ liệu GPS tự động**: Đảm bảo hệ thống luôn có dữ liệu GPS phong phú và thực tế trong cơ sở dữ liệu (`smart.farm.gps`) cho các phương tiện cơ giới và thiết bị nông trại.
2. **Bản đồ Mini trực quan**: Thay khung tĩnh bằng mô hình bản đồ nông trại thu nhỏ sinh động với các điểm ghim phương tiện di chuyển, hiệu ứng sóng radar tỏa tròn (`pulse-ping`), hiển thị tọa độ thời gian thực.
3. **Danh sách thiết bị & Điều hướng liền mạch**: Trình bày danh sách phương tiện trực quan (tên, loại thiết bị, tọa độ, thời gian cập nhật) kèm nút bấm chuyển nhanh sang tab **Bản đồ** lớn (`#tab-map`).
4. **Đồng bộ thẩm mỹ 2 chế độ Sáng / Tối**: Chuẩn hóa màu sắc hiển thị cho cả Light Mode và Dark Slate Mode, đảm bảo tính thẩm mỹ cao cấp và không gây chói mắt.

---

## 2. User Stories & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### User Story 1: Tự động khởi tạo dữ liệu định vị GPS mẫu (Priority: P1)
Là người quản trị trang trại, khi tôi mở Dashboard, tôi muốn nhìn thấy số lượng bản ghi GPS thực tế và vị trí của các phương tiện nông nghiệp thay vì số 0 và thông báo trống.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** bảng `smart.farm.gps` trong Odoo chưa có bản ghi nào, **When** người dùng tải Dashboard, **Then** hệ thống tự động sinh dữ liệu mẫu hợp lý cho ít nhất 3-4 thiết bị:
     - `Máy kéo Kubota M7040` (Loại: Máy kéo, Tọa độ: 21.0285, 105.8542)
     - `Xe bán tải tuần tra #02` (Loại: Xe cơ giới, Tọa độ: 21.0298, 105.8556)
     - `Drone phun thuốc DJI Agras T40` (Loại: Thiết bị bay, Tọa độ: 21.0274, 105.8532)
     - `Trạm thời tiết tự động IoT` (Loại: Cảm biến, Tọa độ: 21.0289, 105.8549)
  2. **Given** đã có dữ liệu GPS, **When** nhìn vào thẻ thống kê thứ 2 trên đỉnh Dashboard, **Then** con số "BẢN GHI GPS" hiển thị đúng tổng số bản ghi (ví dụ: `4`) với nhãn "Gần nhất hôm nay" thay vì số `0`.

---

### User Story 2: Bản đồ Mini trực quan với hiệu ứng Radar Ping (Priority: P1)
Là người vận hành, tôi muốn nhìn thấy vị trí thực địa của máy kéo và các thiết bị trên một bản đồ thu nhỏ đẹp mắt, có hiệu ứng sinh động để biết thiết bị nào đang hoạt động.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** widget GPS trên Dashboard, **When** hiển thị dữ liệu GPS, **Then** bản đồ mini thể hiện không gian nông trường với các phân khu nông trại và các điểm ghim định vị phân màu theo loại thiết bị:
     - Máy kéo: Icon xanh lá / vàng kèm hiệu ứng sóng radar ping tỏa tròn.
     - Xe tuần tra / Drone: Icon xanh dương nổi bật.
  2. **Given** các điểm ghim trên bản đồ mini, **When** người dùng rê chuột (hover) vào điểm ghim, **Then** hiển thị tooltip nhỏ gọn chứa: Tên thiết bị, Trạng thái (Đang hoạt động / Dừng), Tọa độ Lat/Lng.

---

### User Story 3: Danh sách thiết bị và liên kết sang Tab Bản đồ Toàn cảnh (Priority: P2)
Là người quản lý, tôi muốn xem nhanh danh sách phương tiện ở phía dưới bản đồ mini và có thể bấm 1 click để nhảy ngay sang xem Bản đồ quy hoạch toàn trang trại.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** widget GPS, **When** xem phần chi tiết bên dưới bản đồ mini, **Then** hiển thị từng hàng thiết bị gọn gàng với icon loại thiết bị, tên phương tiện in đậm, tọa độ Lat/Long, thời gian cập nhật.
  2. **Given** nút liên kết "Xem bản đồ toàn cảnh →" ở chân thẻ GPS, **When** người dùng bấm vào, **Then** hệ thống lập tức chuyển mượt mà sang tab Bản đồ (`tab-map`) tương tác lớn.

---

### User Story 4: Đồng bộ Dark Slate & Light Mode (Priority: P2)
Là người sử dụng chế độ Dark Mode, tôi muốn thẻ GPS hiển thị hài hòa với tông màu tối Sleek Slate, không có ô trắng hay xanh sữa gây chói mắt.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** Dashboard ở chế độ Dark Mode, **When** xem thẻ GPS, **Then** nền bản đồ mini là màu slate sẫm (`#0f172a`), các đường ranh giới nông trại mờ ảo (`#334155`), văn bản tọa độ màu sáng rõ nét (`#e2e8f0`).
  2. **Given** người dùng chuyển sang Light Mode, **Then** giao diện bản đồ mini tự động thích ứng với bảng màu xanh đồng quê thanh lịch.

---

## 3. Edge Cases & Xử Lý Ngoại Lệ (Requirements)

1. **Trường hợp xóa sạch dữ liệu GPS**: Nếu người dùng xóa toàn bộ bản ghi GPS trong Odoo, widget vẫn hiển thị khung bản đồ sạch sẽ kèm thông báo thân thiện *"Chưa phát hiện thiết bị — Tự động dò tìm..."* và nút bấm *"Khởi tạo dữ liệu mẫu"* để khôi phục nhanh.
2. **Kích thước màn hình thu nhỏ (Responsive Mobile)**: Bản đồ mini tự động co giãn 100% bề ngang của cột, các điểm ghim tự động tính toán tọa độ tương đối theo tỷ lệ %, không tràn viền màn hình.
3. **Hiệu năng & Tài nguyên**: Bản đồ mini sử dụng SVG / CSS thuần tối ưu, không tải thêm thư viện ngoài nặng nề, đảm bảo tốc độ tải trang dưới 0.2 giây.
