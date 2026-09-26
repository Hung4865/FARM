# Implementation Plan: Bản đồ Nông trại Tương tác (Interactive Smart Farm Map)

**Feature**: `002-interactive-farm-map` | **Spec**: [`spec.md`](./spec.md)  
**Status**: Ready for Execution

---

## 1. Kiến trúc Kỹ thuật (Technical Architecture)

### 1.1 Backend & APIs (Python / Odoo Controller)
* **Model cập nhật:**
  * Bổ sung trường hoặc hỗ trợ liên kết vị trí tọa độ % cho `smart.farm.gps` (để định vị chính xác icon máy kéo/thiết bị trên bản đồ tỉ lệ).
  * API giải quyết cảnh báo: `POST /smart_farm/api/alert/resolve` (cập nhật `is_resolved = True` trong database).
  * API điều khiển thiết bị khu vực: `POST /smart_farm/api/zone/control` (mô phỏng bật/tắt van tưới, máy bơm, quạt thông gió).
* **Controller dữ liệu bản đồ:**
  * Truyền danh sách `alerts` (chưa xử lý) và `gps_records` vào context render của template `smart_farm.dashboard_template`.

### 1.2 Frontend & Giao diện Tương tác (XML / QWeb / CSS / JS)
* **Thành phần giao diện trong `tab-map`:**
  * **Map Toolbar:** Bộ nút lọc lớp (Layers: Phương tiện, Thủy lợi, Cảnh báo).
  * **Interactive Overlay:**
    * Vùng Zone A, B, C có hiệu ứng viền sáng (glowing stroke) khi hover, click mở Drawer.
    * Markers máy kéo / xe tuần tra với radar animation `sf-radar-ping`.
    * Markers cảnh báo nhấp nháy màu đỏ (`sf-alert-beacon`) định vị theo từng zone có alert.
  * **Slide-out Zone Drawer (`#sf-zone-drawer`):**
    * Panel trượt từ mép phải với backdrop làm mờ nhẹ.
    * Hiển thị chi tiết thời tiết, độ ẩm đất, lịch sử tưới và công tắc điều khiển IoT.
  * **Floating Vehicle Popup (`#sf-vehicle-popover`):**
    * Thẻ nổi nhỏ hiển thị thông tin máy cày khi click.

---

## 2. Thiết kế Cơ sở Dữ liệu & APIs

### 2.1 API Giải quyết cảnh báo
* **Route:** `/smart_farm/api/alert/resolve`
* **Method:** `POST`
* **Params:** `{ alert_id: int }`
* **Response:** `{ success: bool, message: str, unresolved_count: int }`

### 2.2 API Điều khiển thiết bị khu vực
* **Route:** `/smart_farm/api/zone/control`
* **Method:** `POST`
* **Params:** `{ zone: str, device: str, state: bool }`
* **Response:** `{ success: bool, zone: str, device: str, state: bool, message: str }`

---

## 3. Kế hoạch Kiểm thử & Xác minh (Verification Plan)
1. Kiểm tra tính năng bật/tắt Layer: Lớp thiết bị, lớp cảnh báo ẩn/hiện chính xác.
2. Kiểm tra bấm vào máy kéo GPS: Popover hiển thị chuẩn thông tin.
3. Kiểm tra bấm vào Zone A, B, C: Drawer trượt ra mượt mà, bấm nút gạt thiết bị phản hồi thành công.
4. Kiểm tra bấm vào Alert Pin: Bấm "Xác nhận đã xử lý" $\rightarrow$ Icon biến mất và số cảnh báo trên chuông giảm đi 1.
