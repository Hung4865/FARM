# Tasks: Bản đồ Nông trại Tương tác (Interactive Smart Farm Map)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Completed (Đã hoàn thành 100%)

---

## Danh sách công việc theo chuẩn 4 bước (Task Checklist)

### Subtask 1: Backend APIs & Cung cấp Dữ liệu Bản đồ (Backend APIs & Data Feeds)
- [x] **T001** `[odoo-backend-developer]` Xây dựng API `POST /smart_farm/api/alert/resolve` và `POST /smart_farm/api/zone/control` trong `smart_farm/controllers/main.py`; cập nhật hàm `dashboard` truyền `active_alerts` liên kết khu vực vào template.
- [x] **T002** `[odoo-code-reviewer]` Soi diff Python controller, kiểm tra xử lý tham số, bảo mật auth='user' và định dạng JSON response.
- [x] **T003** Lập trình viên nghiệm thu (F5 Odoo, test gọi API resolve và zone control), xác nhận phản hồi đúng mã HTTP 200 và cấu trúc JSON.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - backend apis for alert resolution and zone control`

---

### Subtask 2: Bộ lọc Lớp Bản đồ & Điều khiển Hiển thị (Map Layer Controls)
- [x] **T005** `[odoo-frontend-styler]` Xây dựng thanh công cụ `.sf-map-layer-bar` trong `smart_farm/views/dashboard.xml`, viết styling toggle trong `dashboard.css` và hàm JS `sfToggleMapLayer(layerName, element)` trong `dashboard.js`.
- [x] **T006** `[odoo-code-reviewer]` Soi diff QWeb, CSS và JS, kiểm tra class toggle active/inactive và hiệu ứng ẩn/hiện các layer trên bản đồ.
- [x] **T007** Lập trình viên nghiệm thu (mở Dashboard, bật/tắt từng switch lớp bản đồ), xác nhận các lớp GPS, cảm biến, cảnh báo ẩn/hiện chính xác.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - interactive map layer filter toolbar`

---

### Subtask 3: Giám sát Phương tiện GPS & Popover Chi tiết (Live GPS Markers & Popover)
- [x] **T009** `[odoo-frontend-styler]` Thêm marker máy kéo `.sf-vehicle-marker` với vòng radar ping trên Khu B trong `views/dashboard.xml`, tạo popover `#sf-vehicle-popover` và hàm JS `sfShowVehicleInfo` trong `dashboard.js`.
- [x] **T010** `[odoo-code-reviewer]` Soi diff, kiểm tra định vị tọa độ tương đối, z-index của popover và xử lý đóng popover khi click ngoài.
- [x] **T011** Lập trình viên nghiệm thu (click vào icon máy cày trên bản đồ), xác nhận popover mở ra hiển thị chuẩn tọa độ GPS, tốc độ, tài xế.
- [x] **T012** Commit: `feat(smart_farm): subtask 3 - live gps vehicle marker and detail popover`

---

### Subtask 4: Điểm Cảnh báo Radar & Xử lý Tức thời (Alert Pins & Resolve Action)
- [x] **T013** `[odoo-frontend-styler]` Render các điểm phát sóng cảnh báo `.sf-alert-beacon` trên bản đồ trong `views/dashboard.xml`; viết hàm JS `sfShowAlertDetails` và `sfResolveAlertFromPopover` trong `dashboard.js`.
- [x] **T014** `[odoo-code-reviewer]` Soi diff, kiểm tra hiệu ứng radar ping CSS, liên kết alertId và hàm dọn sạch beacon khi đã resolve.
- [x] **T015** Lập trình viên nghiệm thu (click vào điểm cảnh báo đỏ, bấm nút xử lý), xác nhận beacon biến mất và số cảnh báo giảm 1 tức thì.
- [x] **T016** Commit: `feat(smart_farm): subtask 4 - pulsating alert beacons and map resolution action`

---

### Subtask 5: Bảng trượt Drawer & Điều khiển Thiết bị IoT (Zone Drawer & Device Controls)
- [x] **T017** `[odoo-fullstack-dev]` Xây dựng bảng trượt cạnh phải `#sf-zone-drawer` trong `views/dashboard.xml`, hiệu ứng slide CSS trong `dashboard.css`, và các hàm JS `sfOpenZoneDrawer`, `sfCloseZoneDrawer`, `sfToggleDevice` trong `dashboard.js`.
- [x] **T018** `[odoo-code-reviewer]` Soi diff toàn bộ giao diện và JS, kiểm tra animation transition trượt mượt mà và kết nối API điều khiển thiết bị.
- [x] **T019** Lập trình viên nghiệm thu (F5 Odoo, click khu vực mở drawer, bật tắt công tắc bơm/phun sương), xác nhận toast thông báo hiện lên và thiết bị đổi trạng thái.
- [x] **T020** Commit: `feat(smart_farm): subtask 5 - zone slide-in drawer and iot device controls`
