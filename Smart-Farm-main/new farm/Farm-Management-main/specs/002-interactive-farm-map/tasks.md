# Tasks: Bản đồ Nông trại Tương tác (Interactive Smart Farm Map)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Completed (Đã hoàn thành 100%)

---

## Danh sách công việc theo từng giai đoạn (Task Checklist)

### Giai đoạn 1: Backend APIs & Cung cấp Dữ liệu (Backend & APIs)
- [x] **T001**: Bổ sung API `POST /smart_farm/api/alert/resolve` trong `smart_farm/controllers/main.py` để cập nhật trạng thái đã xử lý cho cảnh báo và trả về số lượng cảnh báo còn lại dạng JSON.
- [x] **T002**: Bổ sung API `POST /smart_farm/api/zone/control` trong `smart_farm/controllers/main.py` để xử lý thao tác bật/tắt thiết bị IoT (van tưới, máy bơm, quạt phun sương) cho từng khu vực và phản hồi JSON.
- [x] **T003**: Cập nhật hàm `dashboard` trong `smart_farm/controllers/main.py` để truyền danh sách cảnh báo chưa xử lý `active_alerts` kèm thông tin khu vực liên kết vào template QWeb.

---

### Giai đoạn 2: Bộ lọc Lớp Bản đồ (Map Layer Controls)
- [x] **T004**: Xây dựng thanh công cụ bộ lọc lớp `.sf-map-layer-bar` phía trên bản đồ trong `smart_farm/views/dashboard.xml` gồm các switch toggle: Phương tiện GPS, Hệ thống tưới/Cảm biến, Điểm cảnh báo.
- [x] **T005**: Định nghĩa CSS cho thanh bộ lọc lớp và các trạng thái bật/tắt trong `smart_farm/static/src/css/dashboard.css`.
- [x] **T006**: Viết hàm Javascript `sfToggleMapLayer(layerName, element)` trong `smart_farm/static/src/js/dashboard.js` để ẩn/hiện các lớp phần tử tương ứng mượt mà.

---

### Giai đoạn 3: Giám sát Phương tiện GPS thời gian thực (Live GPS Markers & Popover)
- [x] **T007**: Bổ sung marker phương tiện máy kéo `.sf-vehicle-marker` với icon máy cày và vòng tròn sóng radar tỏa ra (`sf-radar-ping`) trên cánh đồng Khu B trong `views/dashboard.xml`.
- [x] **T008**: Tạo popover thông tin phương tiện nổi `#sf-vehicle-popover` (Tên máy cày, tọa độ GPS thực tế, tốc độ, tài xế, trạng thái) và hàm JS `sfShowVehicleInfo(event, vehicleId)` trong `dashboard.js`.

---

### Giai đoạn 4: Điểm Cảnh báo Sự cố nhấp nháy (Alert Pins & Resolve)
- [x] **T009**: Render các điểm ghim cảnh báo nhấp nháy `.sf-alert-beacon` tại các khu vực đang có sự cố trong `views/dashboard.xml`.
- [x] **T010**: Viết hàm Javascript `sfShowAlertDetails(alertId, message, zoneName)` và `sfResolveAlert(alertId, element)` trong `dashboard.js` để gọi API giải quyết sự cố tức thời và cập nhật UI.

---

### Giai đoạn 5: Drawer Chi tiết Khu vực & Điều khiển IoT (Zone Drawer & Device Controls)
- [x] **T011**: Xây dựng bảng trượt từ cạnh phải `#sf-zone-drawer` trong `views/dashboard.xml` gồm tiêu đề khu vực, các thông số môi trường chi tiết và cụm công tắc điều khiển thiết bị (Bơm nước, Tưới nhỏ giọt, Phun sương).
- [x] **T012**: Viết CSS hiệu ứng trượt mượt mà cho Drawer và giao diện công tắc switch toggle trong `dashboard.css`.
- [x] **T013**: Viết các hàm JS `sfOpenZoneDrawer(zoneId)`, `sfCloseZoneDrawer()` và `sfToggleDevice(zone, device, btn)` trong `dashboard.js` để kết nối API điều khiển và hiển thị toast thông báo.

---

### Giai đoạn 6: Kiểm thử, Nâng cấp Module & Tài liệu (Verification & Documentation)
- [x] **T014**: Nâng cấp (Upgrade) module `smart_farm` trong container Odoo và khởi động lại dịch vụ web.
- [x] **T015**: Kiểm thử toàn diện 4 tính năng trực tiếp trên trình duyệt: Lọc lớp, xem máy kéo GPS, kiểm tra cảnh báo và mở drawer bật/tắt thiết bị.
- [x] **T016**: Cập nhật tài liệu thay đổi kỹ thuật vào `smart_farm/docs/UI/UI-Change.md` và `smart_farm/docs/CHANGED.md` theo đúng quy định.
