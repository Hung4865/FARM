# 🏛️ Kiến Trúc Giao Diện & Design System (UI Architecture) – Smart Farm

> **Mục đích tài liệu:** Mô tả cấu trúc kiến trúc UI/UX hiện tại, thành phần giao diện, hệ thống CSS tokens và nguyên tắc thiết kế cho module `smart_farm`.  
> *Được cập nhật khi bắt đầu hoặc chuyển đổi scope làm việc.*

---

## 1. Tổng quan Kiến trúc UI/UX (Overall Architecture)

Hệ thống giao diện của `smart_farm` được thiết kế theo hướng **Single Page Application (SPA)** thu nhỏ trên nền tảng Odoo Web Controller (`/smart_farm/dashboard`):
* **Sticky Navbar (`.sf-navbar-sticky`):** Thanh điều hướng cố định trên cùng gồm Brand Logo, cụm nút chuyển Tab dạng viên thuốc (`.sf-nav-pills`), cụm icon thao tác nhanh (Chuông cảnh báo, Cài đặt) và Profile người dùng.
* **Header động (`.sf-header`):** Hiển thị tiêu đề động theo từng Tab làm việc (`#sf-page-title`) và huy hiệu thời gian thực (`#sf-page-badge`) cho tab Tổng quan.
* **Không gian nội dung Tab (`.sf-tab-content`):**
  1. `#tab-overview`: Thống kê nhanh, biểu đồ nhiệt độ/độ ẩm, danh sách công việc hôm nay, nhật ký GPS gần đây.
  2. `#tab-tasks`: Không gian quản lý công việc chuyên sâu với tìm kiếm, bộ lọc đa tiêu chí, kéo thả sắp xếp (Drag & Drop), modal CRUD task.
  3. `#tab-map`: **Không gian Bản đồ Nông trại Tương tác (Interactive Smart Farm Map)** — Scope hiện tại.
  4. `#tab-inventory`: Quản lý kho vật tư và sản phẩm thu hoạch.

---

## 2. Kiến trúc Giao diện Bản đồ (`#tab-map`)

### 2.1 Cấu trúc Container & Lớp phủ (Map Container & Layers)
* Khung bản đồ: `.sf-map-container` sử dụng `position: relative`, `overflow: hidden`, tỷ lệ linh hoạt theo kích thước ảnh nền isometric `farm_map.jpg`.
* Các tầng hiển thị (Map Layers):
  * **Lớp nền (Base Layer):** Ảnh minh họa trực quan 2D nông trại thông minh (Nhà kính Khu A, Cánh đồng Khu B, Hồ chứa Khu C).
  * **Lớp Phân khu (Zone Layer):** Vùng cảm ứng tương tác `.sf-map-zone` (Zone A, B, C) kèm viền sáng khi hover và sự kiện click mở Drawer chi tiết.
  * **Lớp Phương tiện (Vehicle/GPS Layer):** Icon máy kéo / xe tuần tra nổi trên bản đồ với hiệu ứng sóng radar `pulse-ping`, tọa độ động dựa trên database `smart.farm.gps`.
  * **Lớp Cảnh báo (Alert Layer):** Các điểm ghim cảnh báo nhấp nháy màu đỏ/vàng (`.sf-map-alert-pin`) tại khu vực xảy ra sự cố.
  * **Thanh điều khiển lớp (Layer Controls):** Thanh công tắc nổi trên góc bản đồ cho phép người dùng ẩn/hiện từng lớp theo nhu cầu.

### 2.2 Thành phần Điều khiển & Chi tiết Khu vực (Zone Drawer / Offcanvas)
* Bảng điều khiển trượt từ cạnh phải (`.sf-zone-drawer`):
  * Header: Tên phân khu, loại cây trồng/mô hình, nút đóng (×).
  * Chỉ số môi trường: Nhiệt độ, độ ẩm đất, ánh sáng, EC/pH.
  * Cụm nút điều khiển IoT (*Native First*): Nút kích hoạt tưới nhỏ giọt, phun sương, bật máy bơm.

---

## 3. Hệ thống CSS Tokens & Design Guidelines

Tuân thủ nghiêm ngặt triết lý **Native-First & Bootstrap Utilities**:

### 3.1 Bảng màu chủ đạo (Color Palette)
* **Primary (Chủ đạo Odoo/Farm):** `#e66c0c` / `rgb(230, 108, 12)`
* **Xanh lá nông nghiệp (Emerald / Success):** `#16a34a` (Nền badge, nút thêm việc, trạng thái online)
* **Xanh dương công nghệ (Blue / Info):** `#2563eb` (Cảm biến, thiết bị, trạm bơm)
* **Hổ phách cảnh báo (Amber / Warning):** `#d97706` (Cảnh báo vừa, mức pin thấp)
* **Đỏ nguy hiểm (Rose / Danger):** `#dc2626` (Cảnh báo khẩn cấp, xóa dữ liệu)
* **Nền & Viền (Neutral / Slate):** Nền thẻ `#ffffff`, viền nhẹ `#e2e8f0`, chữ chính `#0f172a`, chữ phụ `#64748b`.

### 3.2 Hiệu ứng Animation & Micro-interactions
* **Pulse Ping:** Dùng cho radar GPS và điểm cảnh báo nhấp nháy:
  ```css
  @keyframes sfRadarPulse {
      0% { transform: scale(0.9); opacity: 1; }
      70% { transform: scale(1.8); opacity: 0; }
      100% { transform: scale(2.2); opacity: 0; }
  }
  ```
* **Drawer Slide:** Trượt mượt mà `transform: translateX(...)` kết hợp `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Nguyên tắc Code Frontend áp dụng
1. Tận dụng triệt để class tiện ích có sẵn của Bootstrap 5.3 (`d-flex`, `align-items-center`, `gap-2`, `badge`, `shadow-sm`).
2. Giữ cấu trúc HTML phẳng, hạn chế lồng thẻ `<div>` không cần thiết.
3. Xử lý tương tác mượt mà qua AJAX Fetch API, không tải lại trang.
