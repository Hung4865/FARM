# Feature Specification: Trung tâm Thông báo & Quản lý Cảnh báo Nông trại (Farm System Notification & Alert Center)

**Feature Branch**: `004-system-notification`  
**Created**: 2026-10-03 | **Updated**: 2026-10-10  
**Status**: Complete (Đã nghiệm thu và hoàn thành 100%)  
**Input**: Nâng cấp Trung tâm Thông báo từ chế độ tĩnh sang **Hệ thống Thông báo & Cảnh báo Kích hoạt theo Sự kiện Demo (Event-Driven Notification System)**. Mỗi khi phát sinh sự kiện tương tác trong trang trại (bật/tắt quạt thông gió, bật/tắt máy bơm tưới tiêu, tạo mới/hoàn thành công việc, hoặc cảm biến vượt ngưỡng an toàn), hệ thống sẽ tự động tạo thông báo, đẩy thời gian thực vào menu chuông Navbar, cập nhật huy hiệu số đếm, hiển thị Toast và đồng bộ đa điểm mà không cần tải lại trang.

---

## 1. Mục tiêu (Objective)

1. **Thông báo kích hoạt theo tương tác thiết bị (Device Control Events)**: Khi người vận hành bật hoặc tắt quạt, bơm tưới tiêu, đèn sưởi hay rèm che tại bất kỳ phân khu nào (Zone A, B, C), hệ thống tự động phát thông báo trạng thái tương ứng.
2. **Thông báo công việc nông trại (Task Management Events)**: Tự động ghi nhận thông báo khi có công việc mới được khởi tạo hoặc khi một công việc được hoàn thành trong trang trại.
3. **Mô phỏng cảnh báo ngưỡng cảm biến (Sensor Threshold Alerts)**: Trong chế độ demo, hỗ trợ tự động phát sinh các cảnh báo nguy cấp (nhiệt độ quá cao, thiếu nước tưới, độ ẩm tụt thấp) để người dùng thấy rõ cơ chế cảnh báo hoạt động.
4. **Đẩy dữ liệu thời gian thực lên giao diện (Instant UI Push)**: Khi có sự kiện xảy ra, thông báo mới xuất hiện ngay lập tức ở đầu danh sách Dropdown chuông, tăng bộ đếm badge, nhấp nháy hiệu ứng pulse, hiện thông báo nổi Toast và lưu bền vững vào database Odoo `smart.farm.alert`.
5. **Thao tác giải quyết nhanh (Interactive Resolution)**: Tiếp tục duy trì khả năng giải quyết 1-chạm ("Xử lý") cho từng thông báo hoặc giải quyết hàng loạt ("Xử lý tất cả").

---

## 2. User Scenarios & Testing (Ưu tiên theo P1, P2)

### User Story 1 - Giám sát Số lượng Cảnh báo Trực quan trên Navbar (Priority: P1)
Là người quản lý nông trại, khi truy cập Dashboard, tôi muốn nhìn thấy ngay số lượng sự cố cần xử lý trên biểu tượng chuông Navbar với hiệu ứng nhịp đập khi có thông báo chưa đọc/chưa xử lý.
* **Acceptance Scenarios**:
  1. **Given** có thông báo chưa xử lý (`unresolved_count > 0`), **When** ở trên Dashboard, **Then** nút chuông hiển thị huy hiệu tròn màu đỏ với số lượng cụ thể và hiệu ứng nhịp đập nhẹ (`sfPulseBadge`).
  2. **Given** tất cả thông báo đã xử lý hết (`unresolved_count == 0`), **When** xem Navbar, **Then** huy hiệu số lượng tự động ẩn (`sf-badge-hidden`).

---

### User Story 2 - Mở Dropdown Xem Chi tiết Thông báo (Priority: P1)
Là nhân viên vận hành, tôi muốn click vào chuông để xem danh sách thông báo mới nhất, có phân loại icon màu sắc, thời gian và vị trí phân khu.
* **Acceptance Scenarios**:
  1. **Given** người dùng click nút `#sf-notif-btn`, **When** dropdown `#sf-notif-menu` mở ra, **Then** hiển thị danh sách cuộn tối đa 15 thông báo mới nhất, phân loại icon theo cấp độ (Đỏ - Nguy hiểm, Vàng cam - Cảnh báo, Xanh lam - Thông tin), kèm nút "Xử lý" nếu chưa hoàn thành.
  2. **Given** danh sách trống hoặc tất cả đã xong, **When** mở dropdown, **Then** hiển thị icon tích xanh *"Hệ thống an toàn - Không có cảnh báo mới cần xử lý"*.

---

### User Story 3 - Xử lý Thông báo 1-chạm & Xử lý Hàng loạt (Priority: P1)
Là người quản lý, sau khi đã nắm thông tin hoặc khắc phục sự cố, tôi muốn bấm "Xử lý" từng dòng hoặc bấm "Xử lý tất cả" để đánh dấu đã đọc/đã giải quyết.
* **Acceptance Scenarios**:
  1. **Given** một dòng thông báo chưa xử lý, **When** click nút "Xử lý", **Then** gọi API cập nhật trạng thái `is_resolved=True`, giảm bộ đếm chuông đi 1, chuyển nút sang nhãn "Đã xong".
  2. **Given** nhiều thông báo chưa xử lý, **When** click "Xử lý tất cả" và xác nhận `confirm()`, **Then** gọi API giải quyết toàn bộ, đưa bộ đếm chuông về 0 và chuyển danh sách sang trạng thái an toàn.

---

### User Story 4 - Tự động phát Thông báo khi Điều khiển Thiết bị (Quạt, Tưới tiêu,...) (Priority: P1)
Là người vận hành trang trại thử nghiệm (Demo), khi tôi bấm công tắc bật/tắt thiết bị tại phân khu (ví dụ: bật quạt ở Zone A, kích hoạt hệ thống tưới ở Zone B), tôi muốn hệ thống tự động ghi nhận ngay một thông báo vào trung tâm thông báo.
* **Giá trị**: Cho thấy hệ thống giám sát tự động bắt trọn mọi hành động tương tác thiết bị trong trang trại.
* **Acceptance Scenarios**:
  1. **Given** quạt thông gió đang tắt, **When** người dùng bật quạt tại Khu A, **Then** hệ thống phát thông báo *"Khu A: Đã kích hoạt quạt thông gió làm mát"* (loại: Thông tin 🔵 / Cảnh báo 🟡), huy hiệu chuông tăng 1 số, dropdown xuất hiện dòng thông báo mới ở trên cùng.
  2. **Given** quạt đang chạy, **When** người dùng tắt quạt, **Then** hệ thống phát thông báo *"Khu A: Đã tắt quạt thông gió"*.
  3. **Given** hệ thống tưới tiêu đang tắt, **When** người dùng bật bơm tưới tại Khu B, **Then** hệ thống phát thông báo *"Khu B: Hệ thống tưới phun sương tự động đã bắt đầu hoạt động"*.
  4. **Given** hệ thống tưới đang chạy, **When** người dùng ngắt bơm tưới, **Then** hệ thống phát thông báo *"Khu B: Đã ngắt hệ thống tưới phun sương"*.

---

### User Story 5 - Tự động phát Thông báo khi Tạo / Cập nhật Công việc (Priority: P1)
Là người quản trị, khi tôi hoặc người khác tạo một công việc mới hoặc cập nhật trạng thái công việc trong nông trại, tôi muốn có thông báo xuất hiện để nắm bắt tiến độ công việc chung.
* **Giá trị**: Giúp quy trình vận hành nhóm và giao việc minh bạch, nhận biết ngay khi có nhiệm vụ mới phát sinh.
* **Acceptance Scenarios**:
  1. **Given** người dùng thêm một công việc mới (ví dụ: *"Bón phân hữu cơ luống 3"*), **When** công việc được lưu thành công, **Then** hệ thống tự động phát thông báo *"Công việc mới: Bón phân hữu cơ luống 3 đã được khởi tạo"* (loại: Thông tin 🔵).
  2. **Given** người dùng tick hoàn thành một công việc, **When** trạng thái được cập nhật, **Then** hệ thống phát thông báo *"Đã hoàn thành công việc: [Tên công việc]"* (loại: Thông tin / Thành công 🟢).

---

### User Story 6 - Mô phỏng Cảnh báo Vượt ngưỡng Cảm biến Cây trồng (Demo Sensor Events) (Priority: P2)
Là người xem bản demo, tôi muốn thấy hệ thống tự động đưa ra cảnh báo khẩn cấp khi các thông số môi trường giả lập (nhiệt độ, độ ẩm đất) vượt quá ngưỡng cho phép của cây trồng.
* **Giá trị**: Thể hiện trực quan kịch bản phát hiện rủi ro thời gian thực của Nông trại thông minh.
* **Acceptance Scenarios**:
  1. **Given** nhiệt độ mô phỏng vượt ngưỡng an toàn (ví dụ: > 38°C), **When** hệ thống phát hiện, **Then** sinh cảnh báo Nguy hiểm 🔴: *"Cảnh báo nhiệt độ: Khu A đạt 38.5°C vượt ngưỡng an toàn - Cần bật quạt làm mát khẩn cấp"*.
  2. **Given** độ ẩm đất giảm xuống dưới 35%, **When** hệ thống phát hiện, **Then** sinh cảnh báo Vàng 🟡: *"Độ ẩm đất thấp: Khu B chỉ còn 32% - Đất khô hạn, cần tưới nước"*.
  3. **Given** cảnh báo ngưỡng sinh ra, **Then** đồng thời kích hoạt hiệu ứng radar phát sóng (`.sf-alert-beacon`) tại đúng vị trí phân khu trên bản đồ 2D/3D.

---

### User Story 7 - Đẩy Thông báo Tức thời lên UI không cần Reload (Instant UI Push) (Priority: P1)
Là người dùng tương tác, khi một sự kiện xảy ra ở User Story 4, 5 hoặc 6, tôi muốn thông báo lập tức xuất hiện trên giao diện mà không cần phải bấm F5 / tải lại trang.
* **Giá trị**: Đem lại cảm giác mượt mà, sống động chuẩn ứng dụng hiện đại thời gian thực.
* **Acceptance Scenarios**:
  1. **Given** có sự kiện mới phát sinh, **When** thông báo được kích hoạt, **Then**:
     - Thêm ngay một thẻ `.sf-notif-item` mới vào đầu danh sách cuộn `#sf-notif-items`.
     - Tự động ẩn thông báo trống `#sf-notif-empty-state` nếu danh sách trước đó đang rỗng.
     - Tăng số lượng hiển thị trên huy hiệu chuông `#sf-notif-badge` và gỡ bỏ class ẩn `.sf-badge-hidden`.
     - Cập nhật số đếm trong header pill `#sf-notif-pill-count` và thẻ thống kê Dashboard `#sf-top-stat-alert-count`.
     - Hiển thị thông báo nổi Toast xanh/vàng/đỏ tương ứng ở góc màn hình.
     - Bản ghi thông báo được lưu vào cơ sở dữ liệu `smart.farm.alert` trên backend Odoo để khi tải lại trang vẫn được lưu giữ.

---

### User Story 8 - Hiển thị Thông báo Nổi (Toast) kèm Thanh Tiến trình Chạy Đếm ngược (Priority: P1)
Là người dùng vận hành, khi tương tác kích hoạt thiết bị hoặc có cảnh báo mới, tôi muốn nhìn thấy thông báo dạng Toast hiện đại ở góc trên bên phải, có icon trạng thái, tiêu đề đậm, nội dung mô tả rõ ràng và **thanh tiến trình đếm ngược chạy ở dưới cùng** để biết thời gian hiển thị tự đóng (4 giây).
* **Giá trị**: Nâng cao trải nghiệm thị giác theo tiêu chuẩn thiết kế UI hiện đại, giúp người dùng nhận biết ngay sự kiện mà không che khuất màn hình.
* **Acceptance Scenarios**:
  1. **Given** có sự kiện thông báo mới, **When** hàm `sfShowToast` được gọi, **Then** hiển thị thẻ toast bo góc 12px, nền trắng cao cấp, đổ bóng mờ, icon tròn theo màu (`success` xanh lá, `info` xanh dương, `warning` vàng, `danger` đỏ), kèm nút đóng "×".
  2. **Given** toast đang hiển thị, **When** thời gian trôi qua, **Then** thanh tiến trình (`.sf-toast-progress-bar`) chạy co dần từ 100% về 0% trong 4 giây rồi toast tự động trượt mờ và biến mất.

---

### User Story 9 - Tinh gọn Thẻ "Cảnh báo & Log" trên Dashboard (Tối đa 3 mục) & Điều hướng Quả Chuông (Priority: P1)
Là người quản lý xem Dashboard, tôi muốn khu vực "Cảnh báo & Log" chỉ hiển thị ngắn gọn tối đa 3 cảnh báo mới nhất để giao diện không bị dài lê thê; muốn xem toàn bộ lịch sử thì click vào liên kết xem tất cả hoặc quả chuông thông báo.
* **Giá trị**: Giữ bố cục trang tổng quan cân đối, gọn đẹp, đồng thời cung cấp lối tắt mở trung tâm thông báo đầy đủ chỉ với 1 click.
* **Acceptance Scenarios**:
  1. **Given** hệ thống có nhiều hơn 3 cảnh báo, **When** tải Dashboard, **Then** thẻ "Cảnh báo & Log" chỉ hiển thị đúng 3 cảnh báo mới nhất.
  2. **Given** tổng số cảnh báo > 3, **When** xem thẻ, **Then** xuất hiện liên kết `Xem tất cả (N) →` ở tiêu đề và nút `Xem thêm N-3 thông báo khác trong Quả Chuông 🔔` ở cuối thẻ.
  3. **Given** người dùng click nút "Xem tất cả" hoặc "Xem thêm", **When** sự kiện kích hoạt, **Then** dropdown Quả chuông (`#sf-notif-menu`) tự động mở ra, cuộn nhẹ nhàng đến vị trí chuông để người dùng xem trọn vẹn toàn bộ danh sách.
  4. **Given** sự kiện đẩy thời gian thực phát sinh (Subtask 3), **When** thêm dòng cảnh báo mới vào đầu thẻ Dashboard, **Then** nếu số lượng vượt quá 3, tự động loại bỏ dòng cũ thứ 4 để luôn duy trì đúng 3 mục.

---

## 3. Edge Cases & Xử lý lỗi (Requirements)

1. **Chống Spam Thông báo (Event Debounce / Throttle)**: Nếu người dùng click bật/tắt liên tục công tắc quạt hoặc tưới trong vòng 2 giây, chỉ gửi thông báo cho trạng thái cuối cùng, tránh làm ngập tràn danh sách thông báo.
2. **Giới hạn số lượng hiển thị trong Dropdown**: Dropdown duy trì tối đa 15 thông báo mới nhất. Khi có thông báo mới đẩy vào đầu danh sách, nếu tổng số vượt quá 15 bản ghi, tự động loại bỏ bản ghi cũ nhất ở cuối danh sách DOM.
3. **Giới hạn số lượng trên Dashboard Card**: Thẻ Dashboard luôn cố định tối đa 3 mục mới nhất, giữ chiều cao thẻ hài hòa với widget Thời tiết và GPS bên cạnh.
4. **Độ bền vững dữ liệu (Persistence)**: Mọi thông báo sinh ra từ sự kiện đều phải được gọi API lưu vào bảng `smart.farm.alert` trong database Odoo, đảm bảo người dùng F5 hoặc đăng nhập từ máy khác vẫn giữ nguyên lịch sử thông báo.
5. **Mất kết nối mạng / Lỗi server Odoo**: Nếu API lưu thông báo backend thất bại, vẫn hiển thị thông báo cục bộ trên giao diện kèm Toast cảnh báo nhẹ nhàng để trải nghiệm người dùng không bị gián đoạn.

