# Feature Specification: Bản đồ Nông trại Tương tác (Interactive Smart Farm Map)

**Feature Branch**: `002-interactive-farm-map`  
**Created**: 2026-09-26  
**Status**: Ready for Implementation  
**Input**: Nâng cấp giao diện Bản đồ Nông trại từ hình ảnh tĩnh thành trung tâm giám sát và điều khiển trực quan (Visual Command Center) với 4 chức năng cốt lõi: Giám sát GPS di động, Drawer chi tiết & điều khiển IoT từng khu vực, Ghim cảnh báo sự cố nhấp nháy, và Bộ lọc lớp bản đồ đa tầng.

---

## 1. Mục tiêu (Objective)

Chuyển đổi thẻ `#tab-map` thành không gian tương tác thông minh, giúp người quản lý nông trại:
1. Giám sát tức thời vị trí và trạng thái của máy kéo / thiết bị di động trên bản đồ thông qua dữ liệu GPS.
2. Nhấp chọn từng phân khu (Zone A - Nhà kính, Zone B - Cánh đồng, Zone C - Hồ chứa & Vườn cây) để mở bảng điều khiển chi tiết (Drawer), kiểm tra thông số môi trường và kích hoạt điều khiển tưới tiêu/máy bơm trực tiếp.
3. Nhận diện các sự cố khẩn cấp thông qua các điểm ghim cảnh báo nhấp nháy trực quan ngay trên vùng đất gặp sự cố, hỗ trợ xác nhận xử lý nhanh.
4. Tùy chọn lọc hiển thị các lớp dữ liệu trên bản đồ (Lớp Thiết bị, Lớp Cảm biến/Tưới, Lớp Cảnh báo) bằng bộ công tắc tiện lợi.

---

## 2. User Scenarios & Testing (Ưu tiên theo P1, P2)

### User Story 1 - Giám sát Máy kéo & Thiết bị GPS thời gian thực (Priority: P1)

Là người quản lý nông trại, tôi muốn nhìn thấy vị trí của máy kéo đang hoạt động trên cánh đồng với biểu tượng trực quan và sóng tín hiệu, bấm vào để xem chi tiết tốc độ và tọa độ.

* **Giá trị**: Nắm bắt vị trí thực địa của máy móc cơ giới, giảm rủi ro thất thoát và theo dõi tiến độ cày xới.
* **Acceptance Scenarios**:
  1. **Given** có các bản ghi thiết bị trong bảng `smart.farm.gps`, **When** người dùng mở tab Bản đồ, **Then** hiển thị icon máy kéo/thiết bị tại tọa độ quy đổi trên bản đồ kèm hiệu ứng sóng radar ping.
  2. **Given** icon máy kéo trên bản đồ, **When** người dùng click vào icon, **Then** hiển thị popup thông tin: Tên thiết bị (ví dụ: Máy cày Kubota #01), Tọa độ (Lat/Lng), Thời gian cập nhật gần nhất, Trạng thái hoạt động.

---

### User Story 2 - Bảng Chi tiết Khu vực & Điều khiển IoT Tưới tiêu (Priority: P1)

Là nhân viên vận hành, tôi muốn click vào từng phân khu (Zone A, B, C) trên bản đồ để mở thanh thông tin bên phải (Zone Drawer), xem toàn bộ chỉ số đất/nhiệt độ và có nút bấm bật/tắt hệ thống tưới tiêu hoặc máy bơm nước.

* **Giá trị**: Rút ngắn thời gian thao tác điều khiển thiết bị từ bản đồ trực quan.
* **Acceptance Scenarios**:
  1. **Given** người dùng click vào Khu A (Nhà kính), **When** Drawer mở ra, **Then** hiển thị nhiệt độ không khí, độ ẩm đất, độ ẩm không khí và nút điều khiển "Hệ thống Phun sương / Thông gió".
  2. **Given** người dùng click vào Khu B (Cánh đồng), **When** Drawer mở ra, **Then** hiển thị độ ẩm đất trung bình, trạng thái cày xới và nút "Hệ thống Tưới nhỏ giọt".
  3. **Given** người dùng click vào Khu C (Hồ chứa), **When** Drawer mở ra, **Then** hiển thị mực nước hồ, chất lượng nước và nút "Bật/Tắt Máy bơm nước".
  4. **Given** người dùng bấm nút bật/tắt thiết bị trong Drawer, **When** hệ thống gọi API AJAX, **Then** trạng thái thiết bị chuyển đổi tức thời (Bật 🟢 / Tắt ⚪) kèm thông báo toast phản hồi.

---

### User Story 3 - Điểm Cảnh báo Sự cố nhấp nháy trên Bản đồ (Priority: P2)

Là người quản lý, khi một khu vực xảy ra sự cố (độ ẩm đất quá thấp, nhiệt độ quá cao), tôi muốn một biểu tượng cảnh báo màu đỏ/vàng nhấp nháy tại khu vực đó trên bản đồ, và có thể bấm vào để xem nội dung sự cố kèm nút xác nhận đã xử lý.

* **Giá trị**: Cảnh báo sớm trực quan, ngăn chặn kịp thời sâu bệnh hoặc cháy lá/héo rũ.
* **Acceptance Scenarios**:
  1. **Given** có cảnh báo chưa xử lý (`is_resolved = False`) trong bảng `smart.farm.alert`, **When** mở bản đồ, **Then** xuất hiện icon tam giác cảnh báo nhấp nháy tại phân khu tương ứng.
  2. **Given** icon cảnh báo trên bản đồ, **When** người dùng click vào, **Then** hiển thị popup chi tiết cảnh báo và nút "Đánh dấu đã xử lý".
  3. **Given** người dùng bấm "Đánh dấu đã xử lý", **When** gọi API cập nhật, **Then** cảnh báo biến mất khỏi bản đồ và cập nhật bộ đếm cảnh báo trên header.

---

### User Story 4 - Bộ lọc Lớp Bản đồ đa tầng (Map Layer Toggles) (Priority: P2)

Là người xem bản đồ, tôi muốn có một thanh công cụ góc bản đồ để chủ động bật/tắt các lớp: Lớp Thiết bị GPS, Lớp Cảm biến & Thủy lợi, Lớp Cảnh báo.

* **Giá trị**: Giúp giao diện gọn gàng, người dùng có thể tập trung vào thông tin mình cần theo dõi mà không bị rối mắt.
* **Acceptance Scenarios**:
  1. **Given** thanh công cụ lớp góc trên bản đồ, **When** người dùng tắt switch "Thiết bị", **Then** toàn bộ icon máy kéo GPS ẩn đi.
  2. **Given** người dùng bật lại switch "Cảnh báo", **Then** các điểm cảnh báo sự cố hiện lại bình thường.

---

## 3. Edge Cases & Xử lý lỗi (Requirements)

1. **Không có dữ liệu GPS / Cảnh báo:** Bản đồ vẫn hiển thị mượt mà không lỗi JavaScript, các vùng Zone A, B, C vẫn tương tác bình thường.
2. **Màn hình nhỏ (Mobile/Tablet Responsive):** Thanh Drawer điều khiển tự động full-width trên màn hình điện thoại để dễ thao tác chạm cảm ứng.
3. **Mất kết nối mạng khi điều khiển tưới:** Hiển thị thông báo Toast lỗi và hoàn tác nút gạt về trạng thái ban đầu.
