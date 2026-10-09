# 📝 Lịch sử thay đổi – Smart Farm Management

> File này ghi lại toàn bộ các thay đổi của dự án theo thứ tự thời gian, từ khi khởi tạo đến hiện tại.

---

## [v0.7.0] – 2026-10-10 (Hiện tại)

### 🔔 Trung Tâm Thông Báo & Cảnh Báo Sự Kiện Thời Gian Thực (Feature 004)
1. **Thông Báo Tự Động Theo Tương Tác Thiết Bị & Công Việc**:
   - Khi bật/tắt thiết bị tại các phân khu (quạt thông gió, phun sương, tưới nhỏ giọt, châm dinh dưỡng, mái che), hệ thống tự động lưu bản ghi `smart.farm.alert` vào database và trả về đối tượng alert thời gian thực.
   - Khi tạo mới công việc hoặc hoàn thành công việc, tự động sinh cảnh báo/thông báo tương ứng.
2. **Toast Notification Hiện Đại Kèm Thanh Chạy Đếm Ngược (`sfShowToast`)**:
   - Thiết kế dạng card nổi bo góc 12px, nền trắng thanh lịch, đổ bóng mờ, icon trạng thái tròn phân loại theo cấp độ (`success`, `info`, `warning`, `danger`).
   - Thanh tiến trình đếm ngược chạy ở đáy card (`@keyframes sfToastProgress`) co dần từ 100% về 0% trong 4 giây rồi tự đóng mượt mà.
3. **Giới Hạn Thẻ "Cảnh Báo & Log" Trên Dashboard (Tối đa 3 mục) & Điều Hướng Quả Chuông**:
   - Thẻ hiển thị trên Dashboard được giới hạn hiển thị tối đa 3 cảnh báo mới nhất (`alerts[:3]`).
   - Tích hợp nút `Xem tất cả (N) →` ở tiêu đề và nút `Xem thêm N-3 thông báo khác trong Quả Chuông 🔔` ở đáy thẻ, click vào sẽ tự động mở dropdown Quả chuông và cuộn mượt đến vị trí thông báo.
4. **Tiện Ích Mô Phỏng Cảnh Báo Cảm Biến Demo (`sfSimulateSensorAlert`)**:
   - Bổ sung nút **`⚡ Mô phỏng sự cố`** trên thanh công cụ lớp bản đồ.
   - Tự động sinh sự cố cảm biến ngẫu nhiên theo phân khu (nhiệt độ vượt 38°C, độ ẩm đất tụt dưới 28%, nồng độ EC/pH bất thường), đẩy thông báo vào menu chuông, hiển thị Toast và ghim điểm phát sóng radar `.sf-alert-beacon` động lên bản đồ nông trại.

---

## [v0.6.1] – 2026-09-26

### 🐛 Sửa lỗi & Nâng cấp Trải nghiệm 3D (3D Bug Fixes & Action Enhancements)
1. **Khắc Phục Triệt Để Lỗi Không Thể Nhấp Vào Cây Để Mở Bảng Cài Đặt Bên Phải (`#sf-plant-drawer`)**:
   - *Nguyên nhân cốt lõi*: Hộp va chạm `mistHit` (Hệ thống phun sương trần) được tạo với kích thước quá lớn ($16\text{m} \times 1.4\text{m} \times 30\text{m}$) che phủ kín toàn bộ nóc nhà màng; tia Raycaster từ camera nhìn xuống luôn đâm xuyên qua `mistHit` trước, dẫn đến việc luôn kích hoạt highlight thiết bị phun sương và mở bảng Zone Drawer thay vì bảng cây; đồng thời các khối tán lá xanh (`foliage`) và dây leo chưa được gán `userData` và chưa được đưa vào danh sách `interactiveObjects`.
   - *Giải pháp*:
     + Thu nhỏ hộp va chạm `mistHit` thành thanh mảnh $1.2\text{m} \times 0.5\text{m} \times (ghL - 2)$ dọc theo đúng đường ống trung tâm đỉnh nóc ($x \in [-0.6, 0.6]$), giải phóng hoàn toàn không gian trên đầu 4 luống cây.
     + Mở rộng hitbox cây `plantHit` hình trụ bán kính $1.15\text{m}$, cao $3.8\text{m}$; gán dữ liệu nông học `userData` và đăng ký tương tác cho toàn bộ các khối tán lá (`foliage`), dây leo (`cable`), quả dưa (`melon`) của cả 40 cây trồng.
     + Tái cấu trúc logic Raycast trong `handle3DClick` và `onMouseMove`: Lặp qua toàn bộ mảng `intersects` và **ưu tiên tuyệt đối đối tượng cây trồng (`plant`, `crop`, `fruit`)** trước các thiết bị trần.
     + Bổ sung nút truy cập nhanh **`🌱 Cây`** trên cụm phím điều hướng D-Pad và thanh công cụ 3D, hỗ trợ nhấp đúp (Double-click) vào cây để mở ngay bảng điều khiển chi tiết `#sf-plant-drawer`.

2. **Bổ Sung Đầy Đủ Các Hành Động Tưới 3D Trực Quan & Sống Động (Distinct 3D Irrigation Actions)**:
   - *Hệ thống tưới phun mưa tự động (`sprinkler`)*: Bổ sung 8 béc phun xoay tự động treo dọc 2 hàng xà dầm nóc kết hợp hệ thống 480 hạt nước (`sprinklerPoints`) xòe rộng hình nón xoay tròn và rơi theo quỹ đạo trọng lực tưới đẫm tán lá cây trong vòng lặp `animate()`.
   - *Hệ thống châm dinh dưỡng NPK (`fert`)*: Bổ sung 4 đường ống dẫn vi lượng mờ trong suốt chạy dọc 4 luống máng trồng cùng hệ thống 160 hạt tinh thể vi lượng màu xanh ngọc huỳnh quang (`fertPoints`, `#22c55e`) chuyển động tuần hoàn liên tục dọc đường ống và nhỏ giọt nhịp nhàng vào từng bầu rễ cây.
   - *Hệ thống tưới nhỏ giọt (`drip`)*: Cải tiến hệ thống giọt nước tí tách rơi trực tiếp từ van tưới vào từng khối giá thể rễ cây.
   - *Đồng bộ 2 chiều*: Khi người dùng gạt công tắc các thiết bị trong bảng điều khiển, các hiệu ứng mô phỏng 3D tương ứng bật/tắt tức thì.

3. **Khắc Phục Triệt Để Hiện Tượng Nhạy Chuột Khi Xoay 3D Sơ Đồ Khu A (Accidental Campus Navigation)**:
   - *Nguyên nhân*: Khi người dùng giữ chuột để xoay (Orbit) góc nhìn toàn cảnh phân khu, sự kiện nhả chuột (`pointerup`) hoặc lướt chuột qua hitbox của các nhà màng dễ bị hiểu nhầm là thao tác click chọn.
   - *Giải pháp*:
     + Lắng nghe sự kiện `start` và `end` của `OrbitControls` để khóa cờ `isOrbitingCampus`.
     + Ghi nhận đối tượng nhà màng lúc bắt đầu nhấn chuột (`cpDownTarget`) và lúc nhả chuột (`cpUpTarget`).
     + Ràng buộc điều kiện điều hướng nghiêm ngặt: Chỉ chuyển vào không gian 3D của nhà màng khi `!isOrbitingCampus`, không có thao tác kéo di chuyển (`dist < 4px`, `elapsed < 350ms`), và điểm nhấn chuột xuống & nhả chuột lên **bắt buộc phải là cùng một ngôi nhà màng**. Người dùng có thể thoải mái giữ chuột xoay 360° qua mọi nhà màng mà không bao giờ bị nhảy trang ngoài ý muốn.

---

## [v0.6.0] – 2026-09-26

### 🐛 Sửa lỗi & Hoàn thiện Giao diện (Bug Fixes & UI Polish)
- **Khắc Phục 100% Lỗi Không Mở Bảng Cài Đặt Tưới & Thông Số Chi Tiết Khi Nhấp Vào Cây (`#sf-plant-drawer`)**:
  - *Nguyên nhân cốt lõi*: Vật liệu hitbox cũ sử dụng `{ visible: false }` khiến động cơ va chạm Raycaster của Three.js tự động bỏ qua toàn bộ các đối tượng va chạm của cây trồng; đồng thời thao tác nhấp chuột trên canvas WebGL dễ bị `OrbitControls` nuốt mất sự kiện nếu chuột dịch chuyển vi mô (1-2px) khi nhả chuột.
  - *Giải pháp*:
    + Chuyển toàn bộ vật liệu hitbox sang `new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })` giúp đối tượng vô hình hoàn toàn trong mắt người dùng nhưng vẫn giữ nguyên diện tích va chạm 3D hoàn chỉnh cho Raycaster.
    + Gán dữ liệu sinh học `userData` trực tiếp vào cả quả dưa (`melon`) và thân lá cây, đưa quả vào danh sách `interactiveObjects`.
    + Tích hợp cơ chế phát hiện cú nhấp chuột chính xác qua `pointerdown` + `pointerup` (khoảng cách dịch chuyển $\Delta < 6\text{px}$ và thời gian $< 600\text{ms}$) kèm debounce tránh click đúp.
    + Khi click vào cây hoặc quả dưa: Camera lướt cận cảnh cây, ẩn mượt mà bảng điều khiển Zone Drawer nếu đang mở, đồng thời trượt ra bảng `#sf-plant-drawer` với đầy đủ 6 chỉ số nông học gốc (Độ ẩm rễ, Nhiệt độ quanh gốc, pH, EC, Ánh sáng Lux, Độ ngọt Brix) và tùy chọn tưới tiêu riêng (ghi đè lịch tưới, chỉnh mức nhỏ giọt, tần suất, và nút tưới 150ml tức thời).
    + Bổ sung nút bấm điều hướng "← Quay lại thiết bị Khu A" trên header của `#sf-plant-drawer` giúp người dùng chuyển đổi qua lại thuận tiện.
- **Thiết Kế Lại Toàn Diện Layout Bảng Điều Khiển Thiết Bị IoT (Tránh Co Cụm, Vỡ Thẻ)**:
  - *Nguyên nhân*: Thẻ `.sf-device-card` sử dụng Flexbox hàng ngang (`flex-direction: row`), khi render thêm khối cài đặt phụ `.sf-device-subcontrols` (mức nhỏ giọt, chu kỳ tưới, lượng nước) khiến thẻ bị chia đôi thành 2 cột 50%-50%, ép công tắc switch chen vào giữa tiêu đề và chữ bị rớt dòng méo mó.
  - *Giải pháp*:
    + Đổi cấu trúc `.sf-device-card` thành layout chiều dọc (`flex-direction: column; align-items: stretch;`).
    + Hàng trên cùng `.sf-device-main-row`: Icon thiết bị bo góc mềm mại, tên thiết bị, badge trạng thái `ĐANG CHẠY` / `ĐANG TẮT` và mô tả phụ chiếm trọn không gian bên trái; công tắc toggle switch chuẩn iOS luôn cố định ngay ngắn ở góc trên bên phải.
    + Khối cài đặt phụ `.sf-device-subcontrols`: Nằm trọn vẹn ở hàng dưới với chiều rộng 100%, nền xám sáng thanh lịch (`#f8fafc`), bo góc 10px, hiệu ứng trượt mở mượt mà khi bật công tắc. Các hàng cài đặt (`.sf-subctrl-row`) hiển thị rõ ràng icon minh họa, nhãn và dropdown `<select>` tinh tế chuẩn thiết kế SaaS cao cấp.
- **Đồng nhất 100% Định dạng Thông số khi Di chuột vào Cây trồng**: Chuẩn hóa định dạng hiển thị thông số vi khí hậu & sinh trưởng cho toàn bộ 40 cây trồng độc lập trong nhà màng (`🌱 [Tên giống cây] #[Mã cây]`, `Độ ẩm: 72% • Nhiệt độ quanh gốc: 26.5°C • Độ tuổi: 45 ngày • Dự kiến thu hoạch: 20 ngày nữa`).
- **Bảng Giám Sát Cây Trồng Gốc 1-1 & Điều Khiển Tưới Tiêu Riêng (`#sf-plant-drawer`)**: Nhấp vào từng cây mở bảng trượt bên phải hiển thị đầy đủ 6 chỉ số nông học cảm biến rễ (Độ ẩm rễ, Nhiệt độ quanh gốc, pH, EC, PAR/Lux, Độ ngọt Brix), hỗ trợ thiết lập chế độ tưới riêng (nhỏ giọt, châm phân NPK, tạm ngưng, chỉnh lượng nước 100-350ml, tần suất) và nút bấm "💧 Tưới ngay lập tức (150ml)" kèm hiệu ứng thời gian thực.
- **Điều Hướng Đi Dạo 3D Toàn Diện (Camera Walk & D-Pad Navigation)**: Tích hợp cụm phím điều hướng HUD nổi (`.sf-3d-nav-overlay`) cho phép tiến sâu vào hành lang (`W` / `↑`), lùi ra ngoài (`S` / `↓`), trượt sang trái/phải (`A` / `D`), phóng to/thu nhỏ và nhấp đúp chuột (Double-click) lướt camera đến bất kỳ điểm nào.
- **Khắc phục Triệt để Lỗi Không Đồng Bộ Thiết bị IoT & Lưu trữ Bền vững (`sfDeviceStore`)**: Xây dựng `window.sfDeviceStore` lưu trữ `localStorage`, sửa lỗi định danh thiết bị (`mist` / `fan` / `shade` / `drip` / `sprinkler`), gạt công tắc là mô hình 3D phản hồi ngay lập tức và giữ nguyên trạng thái khi đóng/mở bảng hoặc chuyển tab. Backdrop chuyển sang kính trong suốt giúp người dùng quan sát trực tiếp mô hình 3D.
- **Hệ Thống Điều Khiển Thủy Lợi & Tưới Tiêu Toàn Khu**: Bổ sung điều khiển hệ thống tưới nhỏ giọt tự động (chỉnh lưu lượng 20-100ml/h, chu kỳ 2-4h), hệ thống tưới phun mưa tự động (chỉnh lượng nước 3-8L/m², thời gian ca tưới 10-30m), và hệ thống châm phân vi lượng NPK.
- **Giám Sát Mực Nước Bồn Chứa Khu A 3D (Water Tank Telemetry)**: Di chuột vào 4 bồn chứa nước hiển thị thông số dung tích còn lại (ví dụ $42.500 / 50.000\text{ Lít}$ - $85\%$), tình trạng bơm áp lực và nguồn cấp.
- **Nâng cấp Toàn cảnh 3D Phân Khu A (3D Campus Overview)**:
  - Thay thế sơ đồ tĩnh 2D bằng mô hình 3D tương tác toàn diện cho toàn bộ phân khu Khu A (`#sf-zone-a-3d-viewport`), dựng 16 nhà màng kính 3D với ánh sáng và bóng đổ chân thực, hạ tầng đường nội bộ asphalt, tấm pin mặt trời và hồ chứa nước.
  - Tích hợp Raycasting tương tác: Rê chuột làm sáng khối nhà và hiện thẻ vi khí hậu (`#sf-zone-a-hover-card`), nhấp chuột phóng camera vào tham quan nội thất 3D bên trong.
  - Cụm nút chuyển đổi mượt mà giữa chế độ **🎮 3D Phân khu** và **🗺️ Sơ đồ 2D**.
- **Hoàn thiện Đồ họa Nội thất 3D Nhà màng (Greenhouse 3D Overhaul)**:
  - Khắc phục triệt để lỗi kết cấu xà dầm lơ lửng: Tính toán góc nghiêng kèo mái chính xác (`rafterAngle = 0.291 rad`), kết nối khớp tuyệt đối từ mép tường lên đỉnh nóc nhà màng.
  - Bổ sung chân móng bê tông đúc khối (`curbH = 0.7m`) bao quanh 4 mặt, tạo điểm tựa kiến trúc kiên cố và chân thực.
  - Tinh chỉnh độ trong suốt và tương phản kính (`opacity: 0.40, color: 0x93c5fd`), nẹp khung nhôm rõ nét giúp phân tầng rõ ràng giữa mái vòm và lòng nhà màng.
  - Bổ sung hệ thống lưới cắt nắng nhiệt phản xạ ánh sáng (`Aluminet`) và giàn đèn LED quang phổ hồng/magenta chuyên dụng cho quang hợp cây trồng.
- **Tương tác Cảm biến Sinh học Cây trồng & Trái cây (Plant & Fruit Raycasting)**:
  - Bổ sung Raycasting cho toàn bộ 4 dãy luống cây và quả dưa lưới: Khi di chuột vào cây hoặc trái dưa, hiển thị ngay HUD Card chi tiết các thông số nông học (giống cây, ngày tuổi, chiều cao, độ ẩm bầu rễ, EC, pH, độ ngọt Brix ước tính, khối lượng).
- **Chuyển liên kết "Hệ thống Odoo" vào Cài đặt (Settings Dropdown)**: Bỏ nút "Hệ thống Odoo" khỏi cụm điều hướng chính giữa Navbar (`.sf-nav-pills`), đưa vào vị trí đầu tiên trong menu dropdown Cài đặt (`#sf-settings-menu`), giúp navbar trung tâm tinh gọn và cân đối.
- **Tách biệt Header Độc lập theo Tab**: Di chuyển cụm tiêu đề "Tổng quan trang trại" và nhịp tim "Cập nhật..." vào hẳn bên trong `#tab-overview`. Khi chuyển sang các tab khác ("Bản đồ", "Công việc", "Kho vật tư"), tiêu đề tổng quan và badge tự động biến mất, tab Bản đồ sở hữu tiêu đề riêng biệt "Bản đồ số nông trại" kèm badge "🟢 Giám sát trực tuyến".
- **Khắc phục triệt để vỡ giao diện Bảng điều khiển Phân khu (Zone Drawer)**: Di chuyển `#sf-zone-drawer` và backdrop ra cấp `<body>` với `style="display:none;"` phòng vệ, loại bỏ hoàn toàn hiện tượng text tràn dưới chân bản đồ khi tải trang.
- **Nâng cấp Thẩm mỹ Bản đồ Nông nghiệp Thông minh**: Thay thế tooltip thô sơ bằng HUD Chips kính mờ (`.sf-zone-chip`) trên từng phân khu (ẩn mặc định để lộ toàn bộ chữ và hình vẽ gốc trên bản đồ, chỉ hiện lên khi rê chuột vào khu vực), ghim máy cày định vị telemetry có chip vận tốc và radar 2 nhịp, thanh lọc lớp bản đồ dạng Pill (`.sf-layer-btn-pro`), và bảng điều khiển IoT Offcanvas cao cấp với công tắc trượt chuẩn iOS.
- **Sửa lỗi Internal Server Error (500) khi tải Dashboard**:
  - Khắc phục lỗi biên dịch QWeb template tại `smart_farm/views/dashboard.xml`: Biểu thức `alert.area or \'Toàn trang trại\'` trong `t-attf-onclick` chứa ký tự escape quote `\'` làm engine QWeb báo lỗi `ValueError: Can not compile expression`.
  * Chuyển các tham số sang thuộc tính HTML5 `data-*` (`t-att-data-id`, `t-att-data-name`, `t-att-data-area`, `t-att-data-content`) và ủy quyền xử lý sự kiện qua `onclick="sfOnAlertClick(event, this)"` trong `dashboard.js`.
  * Đã nâng cấp module Odoo và khởi động lại dịch vụ thành công, trang Dashboard render hoàn hảo không còn lỗi 500.

### 🆕 Thêm mới

#### UI & Navigation
- **Mô hình 3D Digital Twin Nhà màng Nông nghiệp Công nghệ cao (3D Digital Twin High-Tech Greenhouse – Feature 003)**:
  - **Hệ thống Bản đồ Đa tầng (Multi-level Navigation)**:
    - *Tầng 1 (Vĩ mô toàn trang trại)*: Click vào **Khu A (Nhà màng công nghệ cao)** để tiến vào sơ đồ phân khu chi tiết.
    - *Tầng 2 (Sơ đồ mặt bằng chi tiết Khu A)*: Thể hiện cụm 12+ nhà kính công nghệ cao (GH-01 đến GH-16), hồ điều hòa, tấm pin mặt trời và luống ngoài trời. Mỗi nhà màng là một hotspot tương tác có chip vi khí hậu hiển thị nhiệt độ & độ ẩm khi hover.
    - *Tầng 3 (Không gian 3D Digital Twin)*: Click vào bất kỳ nhà màng nào (đặc biệt **Nhà màng 01 (GH-01) - Dưa lưới CNC**) sẽ mở ra viewport 3D Three.js WebGL tương tác trực quan 360 độ.
  - **Mô phỏng 3D Procedural Sinh động & Tối ưu**:
    - Khung vòm thép chịu lực mạ kẽm trắng, vách và mái kính cường lực trong suốt phản chiếu ánh sáng tự nhiên.
    - 4 dãy luống máng trồng dưa lưới/cà chua thủy canh với tán lá xanh mướt, quả chín vàng treo dọc giàn dây leo, đường ống tưới nhỏ giọt dẫn tới từng gốc cây.
    - Quạt thông gió đối lưu gắn tường với cánh quạt quay tít theo trạng thái thời gian thực.
    - Hệ thống béc phun sương trần phát hạt sương mù hạt nước chuyển động li ti lơ lửng trong không gian nhà kính.
    - Cọc cảm biến môi trường IoT cắm tại luống đất có đèn LED xanh ngọc bích phát sáng nhịp tim.
  - **Tương tác 2 chiều (Bidirectional Sync)**:
    - Raycasting nhận diện con trỏ chuột: Rê chuột hiện thẻ thông tin thiết bị, Click vào thiết bị 3D sẽ tự động mở Bảng điều khiển IoT bên phải (`#sf-zone-drawer`) và làm nhấp nháy công tắc điều khiển tương ứng.
    - Bật/Tắt công tắc quạt hoặc phun sương ở Drawer bên phải lập tức kích hoạt hiệu ứng quay quạt hoặc phun hạt sương trong mô hình 3D.
    - Cụm nút chuyển nhanh góc nhìn camera: **🎥 Toàn cảnh**, **🌱 Luống dưa**, **⚙️ Thiết bị trần**, và **🔄 Tự động xoay 360°**.
  - Chi tiết tại [UI/UI-Change.md](UI/UI-Change.md).
- **Bản đồ Nông trại Tương tác (Interactive Smart Farm Map – Feature 002)**:
  - Nâng cấp `#tab-map` thành trung tâm điều hành trực quan với thanh lọc lớp bản đồ (Phương tiện, Thủy lợi, Cảnh báo), điểm ghim máy kéo GPS có radar ping, điểm cảnh báo sự cố nhấp nháy hỗ trợ giải quyết nhanh qua API, và thanh trượt Offcanvas (`#sf-zone-drawer`) hiển thị vi khí hậu cùng công tắc điều khiển IoT thực tế cho từng phân khu. Chi tiết tại [UI/UI-Change.md](UI/UI-Change.md).
- **APIs Điều khiển & Cảnh báo mới**:
  - `POST /smart_farm/api/alert/resolve`: Xác nhận xử lý cảnh báo sự cố tức thời.
  - `POST /smart_farm/api/zone/control`: Điều khiển bật/tắt thiết bị IoT (van tưới, máy bơm, phun sương) theo phân khu.
- **Đồng bộ động tiêu đề trang & Huy hiệu cập nhật**:
  - Tiêu đề trang và huy hiệu thời gian được đồng bộ động theo từng tab: chỉ hiển thị huy hiệu thời gian và tiêu đề "Tổng quan trang trại" ở tab Tổng quan; khi chuyển sang các tab "Bản đồ nông trại", "Quản lý công việc", "Kho vật tư & Sản phẩm", tiêu đề tự đổi tương ứng và ẩn huy hiệu cập nhật. Chi tiết tại [UI/UI-Change.md](UI/UI-Change.md).
- **Nút "Công việc" trên Navbar**:
  - Bổ sung nút tab "Công việc" vào cụm điều hướng trung tâm (`.sf-nav-pills`) cạnh "Tổng quan", giúp người dùng truy cập trực tiếp danh sách công việc ở mọi vị trí trên trang web.
- **Nút điều hướng nhanh từ Dashboard Overview**:
  - Bổ sung nút liên kết `Quản lý danh sách →` (`.sf-link-btn`) ngay trên tiêu đề thẻ "Công việc hôm nay" ở trang Tổng quan, cho phép người dùng click là nhảy ngay sang tab Quản lý công việc.
- **Không gian Quản lý Công việc Nông trại (`#tab-tasks`)**:
  - Header toolbar với tiêu đề, mô tả định hướng và nút `+ Thêm công việc` nổi bật màu xanh ngọc bích (`.sf-btn-emerald`).
  - Thanh công cụ tìm kiếm và bộ lọc đa tiêu chí:
    - Ô tìm kiếm từ khóa theo thời gian thực (tên công việc, ghi chú) có icon kính lúp và nút xóa nhanh (×).
    - Bộ lọc trạng thái dạng pill: **Tất cả**, **Chưa xong**, **Đã xong**.
    - Bộ lọc phân loại công việc dạng dropdown: Tất cả, Tưới tiêu, Cảm biến, GPS, Mùa vụ, Kho & Vật tư, Báo cáo.
  - Thanh thông tin trạng thái & Gợi ý: Hiển thị số lượng công việc nhìn thấy / tổng số công việc, badge số task đã hoàn thành và hướng dẫn kéo thả.
  - Danh sách công việc dạng thẻ tương tác cao (`.sf-task-card`):
    - Cần gắp kéo thả (`.sf-drag-handle`) với biểu tượng `⋮⋮` chuyển đổi con trỏ `grab` / `grabbing`.
    - Checkbox trạng thái hoàn thành với hiệu ứng tích xanh và gạch ngang chữ tức thì.
    - Tag phân loại sắc nét chuẩn màu sắc thiết kế nông trại.
    - Badge ngày thực hiện (hiển thị "Hôm nay" nếu trùng ngày) và người phụ trách.
    - Cụm nút hành động tác vụ: nút "Sửa" (`sfOpenTaskModal`) và nút "Xóa" (`sfDeleteTask`).
  - Trạng thái trống (Empty state): Hiển thị minh họa và nút "Đặt lại bộ lọc" khi không tìm thấy kết quả phù hợp.
  - **Modal Thêm / Chỉnh sửa công việc (`#sf-task-modal`)**: Hộp thoại nổi cao cấp với nền kính mờ glassmorphism, form nhập Tiêu đề, Phân loại, Ngày thực hiện, Ghi chú và xử lý submit mượt mà.

#### Tính năng Sắp xếp Kéo thả (Drag & Drop Reordering)
- Áp dụng chuẩn HTML5 Drag and Drop API cho danh sách công việc.
- Phản hồi thị giác thời gian thực: thẻ đang kéo hiển thị mờ đục và viền nét đứt xanh dương (`.dragging`), các thẻ xung quanh tự động dịch chuyển mượt mà.
- Tự động lưu thứ tự mới: khi thả thẻ vào vị trí mới, toàn bộ danh sách ID được gửi tức thì về API `/smart_farm/api/task/reorder` để cập nhật trường `sequence` trong database, duy trì vị trí kể cả khi F5 hoặc mở lại trình duyệt.

#### Backend APIs & Database
- Model `smart.farm.task` tại `smart_farm/models/task.py`:
  - Thêm trường `sequence = fields.Integer(string='Thứ tự', default=10)`.
  - Cập nhật thứ tự sắp xếp mặc định: `_order = 'sequence asc, is_done asc, date asc, id desc'`.
- Các API endpoints mới tại `smart_farm/controllers/main.py`:
  - `POST /smart_farm/api/task/create`: Tạo công việc mới (auth: user).
  - `POST /smart_farm/api/task/update`: Cập nhật công việc (auth: user).
  - `POST /smart_farm/api/task/delete`: Xóa công việc (auth: user).
  - `POST /smart_farm/api/task/reorder`: Lưu thứ tự sắp xếp công việc sau khi kéo thả (auth: user).
  - Cập nhật controller `dashboard`: Truy vấn `all_tasks` và `today` truyền vào QWeb template.

#### Trải nghiệm người dùng (UX)
- Ghi nhớ tab đang chọn: Tự động lưu tab hiện tại vào `localStorage`, giữ nguyên ngữ cảnh khi reload hoặc sau khi tạo/sửa công việc.
- Đồng bộ hai chiều (Two-way sync): Đánh dấu hoàn thành một công việc ở tab Quản lý công việc sẽ tự động cập nhật trạng thái tương ứng tại thẻ Tổng quan và ngược lại.
- Hỗ trợ phím tắt `Escape` để đóng nhanh các cửa sổ Modal.

---

## [v0.5.0] – 2026-09-26

### 🆕 Thêm mới

#### UI & Navigation
- **Floating Pill Header (Boltshift Style)**:
  - Thêm thanh điều hướng dạng viên thuốc nổi (`sf-navbar`) cố định đầu trang.
  - Cụm điều hướng trung tâm (`sf-nav-pills`) dạng tab phân đoạn (Segmented control) với nút chọn đen tuyền `#0f172a`.
  - Brand Logo SmartFarm với icon tia sét nền xanh dương `#2563eb`.
  - Cụm action buttons (Chuông thông báo có badge đỏ + Cài đặt Odoo).
  - Khối Profile hiển thị avatar, tên người dùng, email và Dropdown menu (Quản trị Odoo, Đăng xuất).
- **Hệ thống Quản lý Công việc Nông trại (Farm Task Management)**:
  - Model `smart.farm.task` tại `models/task.py`: Quản lý công việc nông trại (`name`, `task_type`, `date`, `is_done`, `user_id`, `notes`).
  - Giao diện Odoo Backend: List view (với `boolean_toggle`, `many2one_avatar_user`), Form view, Search view (lọc Hôm nay, Chưa xong, Đã xong, Group by).
  - Menu con "Công việc" (`menu_smart_farm_task`, sequence=5) trong menu Smart Farm.
  - Cấu hình phân quyền `ir.model.access.csv` cho User và Admin.
- **Tài liệu dự án & Spec Kit**:
  - `docs/CREDENTIALS.md`: Lưu trữ thông tin đăng nhập, Master Password, Database name và các liên kết truy cập hệ thống.
  - `docs/UI/UI-Change.md`: Nhật ký chuyên sâu ghi lại toàn bộ các thay đổi về giao diện người dùng (UI/UX).
  - `specs/001-farm-task-management/`: Khởi tạo trọn bộ đặc tả tính năng (`spec.md`, `plan.md`, `tasks.md`) theo chuẩn GitHub Spec Kit và hoàn thành 100% 14/14 task.

### 🔄 Cập nhật

#### Controllers
- `controllers/main.py`:
  - Bổ sung truyền biến `user` (`env.user`) vào QWeb template values để lấy thông tin tài khoản hiển thị lên Header.
  - Bổ sung endpoint API `POST /smart_farm/profile/update` (auth: user) xử lý cập nhật hồ sơ cá nhân: đổi họ tên, số điện thoại, email đăng nhập (kiểm tra tránh trùng lặp tài khoản) và đổi mật khẩu mới.
  - Bổ sung truy vấn danh sách công việc hôm nay (`smart.farm.task`) và tính toán số task hoàn thành / còn lại truyền vào template Dashboard.
  - Bổ sung endpoint API `POST /smart_farm/api/task/toggle` (auth: user) cập nhật trạng thái `is_done` qua AJAX và trả về bộ đếm mới.

#### Views & Styles
- `views/dashboard.xml`:
  - Bọc `sf-navbar` trong container `sf-navbar-sticky` để ngăn nội dung trang lọt qua khe hở phía trên khi cuộn.
  - Thiết kế lại `sf-header` thành hàng ngang: tiêu đề bên trái, badge trạng thái cập nhật thời gian thực (`sf-sub-badge`) có chấm xanh nhấp nháy (`sf-pulse-dot`) bên phải.
  - Chuyển đổi nút Setting (Bánh răng) từ link trực tiếp sang Dropdown menu (Cài đặt hệ thống, Quản lý cơ sở dữ liệu, Làm mới dữ liệu).
  - Nâng cấp khối Hồ sơ cá nhân (`.sf-user-profile`): chuyển sang click mở dropdown tài khoản, thêm icon chevron mũi tên chỉ xuống xoay khi mở.
  - Thay thế mục "Quản trị Odoo" trong Dropdown Account thành **"Hồ sơ cá nhân" (Profile)** kích hoạt Modal chỉnh sửa thông tin.
  - Thêm cấu trúc Dialog Modal `#sf-profile-modal` cho phép thay đổi: Họ và tên, Số điện thoại, Email đăng nhập, Mật khẩu mới & Xác nhận mật khẩu.
  - Cập nhật khối Brand Logo SmartFarm (`.sf-brand`) thành liên kết kích hoạt hàm `sfGoToOverview(event)` để khi nhấp vào logo/chữ SmartFarm sẽ lập tức chuyển về tab Tổng quan và cuộn lên đầu trang.
  - Thêm liên kết Favicon trang web (`/smart_farm/static/src/img/Favicon.jpg`) qua các thẻ `<link rel="icon">`, `<link rel="shortcut icon">`, `<link rel="apple-touch-icon">` hiển thị biểu tượng mầm lá công nghệ phát sáng trên tab trình duyệt.
  - Chuyển đổi card "Công việc hôm nay" từ demo tĩnh sang render động dữ liệu thực tế từ Database qua vòng lặp `<t t-foreach="tasks" t-as="task">`.
  - Tăng version CSS lên `?v=16` và JS lên `?v=6`.
- `static/src/css/dashboard.css`:
  - Kéo dài giao diện full-width 100% màn hình (`width: 100%; max-width: 100%; padding: 0 28px 40px 28px`), loại bỏ phần lề thừa 2 bên mạn.
  - Cấu hình lớp nền `background: #eef2f6` cho `sf-navbar-sticky` giúp che chắn triệt để chữ phía dưới khi cuộn trang.
  - Đổi màu nền trang `body` sang `#eef2f6` tăng độ tương phản rõ rệt với các card trắng.
  - Tăng độ đậm đường viền các thẻ (`.sf-stat`, `.sf-card`) lên `1.5px solid #cbd5e1` kèm hiệu ứng đổ bóng `box-shadow: 0 2px 4px rgba(0,0,0,0.05)`.
  - Tăng độ dày thanh tiến trình cảm biến đất từ 3px lên 6px và thêm đường kẻ phân cách tiêu đề thẻ.
  - Tinh chỉnh hiệu ứng Hover nút điều hướng Navbar (`.sf-nav-item:hover`): nền `#cbd5e1`, màu chữ `#0f172a`, `font-weight: 600`, đổ bóng `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, phân biệt rõ rệt với trạng thái thường.
  - Thêm hiệu ứng nhấn nút (`:active`) và hiệu ứng hover nút icon (`.sf-icon-btn:hover`).
  - Thêm hệ thống Dropdown menu (`.sf-dropdown-menu`, `.sf-dropdown-menu.show`, animation `sfFadeSlide`) kích hoạt theo cơ chế click thay vì hover.
  - Thiết kế bộ giao diện Profile Modal cao cấp (`.sf-modal-backdrop`, `.sf-modal-card`, `.sf-modal-header`, `.sf-input`, `.sf-btn`, `.sf-alert`) với nền mờ glassy `backdrop-filter: blur(4px)` và hiệu ứng mở mượt mà.
  - Thêm hiệu ứng con trỏ chuột (`cursor: pointer`), hover nhấc nhẹ và phản hồi nhấn nút cho logo thương hiệu `.sf-brand`.
  - Bổ sung hiệu ứng tương tác checkbox công việc (`.sf-check:hover`), gạch ngang chữ khi xong (`.sf-task-text.done`) và màu sắc tag phân loại.
- `static/src/js/dashboard.js`:
  - Bổ sung hàm `sfToggleDropdown(event, menuId)` điều khiển mở/đóng dropdown và xoay chevron icon.
  - Bổ sung sự kiện lắng nghe đóng toàn bộ dropdown khi click ra ngoài (`click outside`).
  - Xây dựng các hàm xử lý Profile Modal: `sfOpenProfileModal()`, `sfCloseProfileModal()`, `sfSaveProfile()`, `sfShowProfileAlert()`, lắng nghe phím `Escape` đóng popup.
  - Cập nhật thời gian thực (live update) tên và email người dùng trên thanh Header ngay sau khi lưu thành công không cần tải lại toàn bộ trang.
  - Nâng cấp hàm `sfOpenTab(evt, tabName)` và bổ sung hàm `sfGoToOverview(event)` giúp nhấp vào logo SmartFarm kích hoạt trở về tab Tổng quan và smooth scroll lên đầu trang.
  - Bổ sung hàm `sfToggleTask(taskId, element)` xử lý cập nhật giao diện hoàn thành công việc một chạm (Optimistic UI) và đồng bộ qua API AJAX tức thì.

---

## [v0.4.0] – 2026-08-07

### 🆕 Thêm mới

#### Controllers
- `controllers/__init__.py` – Import controller `main`.
- `controllers/main.py` – HTTP Controller `SmartFarmDashboard`:
  - Route `GET /smart_farm/dashboard` (auth: user).
  - Lấy 5 bản ghi GPS mới nhất, cảnh báo chưa xử lý, dữ liệu thời tiết.
  - Fallback thời tiết: API trực tiếp → DB → mock data.
  - Render QWeb template `smart_farm.dashboard_main`.

#### Views (Giao diện XML)
- `views/dashboard.xml` – QWeb template dashboard đầy đủ:
  - Action URL `/smart_farm/dashboard`.
  - Menu "Tổng quan" (sequence=1, ưu tiên cao nhất).
  - Template hiển thị: thẻ thống kê, card thời tiết, card cảnh báo, card GPS, card cảm biến (demo), card công việc (demo).
- `views/menu.xml` – Định nghĩa menu chính + 3 sub-menu:
  - `Smart Farm` (root) → GPS & Vị trí / Thời tiết / Cảnh báo.
- `views/gps_views.xml` – Form & list view cho `smart.farm.gps`.
- `views/weather_views.xml` – Form & list view cho `smart.farm.weather`.
- `views/alert_views.xml` – Form & list view cho `smart.farm.alert`.

#### Static Assets
- `static/src/css/dashboard.css` – CSS tùy chỉnh hoàn chỉnh cho dashboard (grid layout, cards, badges, weather, alerts, GPS map, sensors, tasks).
- `static/src/js/dashboard.js` – File JS placeholder (sẽ bổ sung logic tương tác sau).

#### Security
- `security/ir.model.access.csv` – Cấp quyền CRUD đầy đủ (read/write/create/unlink) cho 3 model: `smart.farm.gps`, `smart.farm.weather`, `smart.farm.alert`.

#### Cấu hình
- `.gitignore` – Bổ sung các rule loại trừ: `__pycache__/`, `*.py[cod]`, `venv/`, `env/`, `odoo-data/`, `db-data/`, `.DS_Store`, `Thumbs.db`.

### 🔄 Cập nhật

#### `__manifest__.py`
- `version`: `17.0.1.0.0` → `18.0.1.0.0` (khớp với Odoo 18).
- Thêm đủ mục `data`: `security/ir.model.access.csv`, `views/dashboard.xml`, `views/menu.xml`, `views/gps_views.xml`, `views/weather_views.xml`, `views/alert_views.xml`.

#### `__init__.py` (root)
- Import cả `models` và `controllers`.

#### `models/alert.py`
- **Refactor hoàn toàn**: Chuyển từ hàm script `send_message()` sang Odoo Model `SmartFarmAlert`:
  - Fields: `name`, `content`, `alert_type` (danger/warning/info/success), `area`, `timestamp`, `is_resolved`.
  - Method `action_resolve()` – đánh dấu cảnh báo đã xử lý.

#### `docker-compose.yml`
- Nâng cấp image: `odoo:17` → `odoo:18`.

### ❌ Xóa
- `smart_farm/config.py` – Không còn cần thiết (module Odoo không dùng XML-RPC thủ công).
- `smart_farm/web_app.py` – File không thuộc cấu trúc module Odoo.
- `views/weather.xml`, `views/gps.xml`, `views/alert.xml` – Đổi tên thành `weather_views.xml`, `gps_views.xml`, `alert_views.xml` cho nhất quán.

### 🚀 Triển khai
- Module được copy vào container và restart:
  ```bash
  docker exec -u root smart_farm-web-1 rm -rf /mnt/extra-addons/smart_farm
  docker cp ~/projects/Farm\ Management/Farm-Management/smart_farm smart_farm-web-1:/mnt/extra-addons/
  docker compose -f .../docker-compose.yml restart web
  ```

---

## [v0.3.0] – 2026-08-07

### 🆕 Thêm mới
- Tạo thư mục `docs/` để quản lý tài liệu nội bộ dự án.
- Thêm file `docs/overview.md` – mô tả tổng quan kiến trúc, công nghệ và luồng dữ liệu.
- Thêm file `docs/CHANGED.md` – ghi lại lịch sử thay đổi toàn bộ dự án.

### ❌ Xóa
- `smart_farm/README.md` – Thông tin cũ và lỗi thời, tài liệu được tổng hợp vào `README.md` gốc.

---

## [v0.2.0] – 2026-08-07

### 🔄 Tái cấu trúc (Script Python → Odoo Custom Module)

Dự án chuyển từ mô hình **script Python độc lập** sang **Odoo Custom Module** tích hợp hoàn toàn vào Odoo.

#### ❌ Xóa (các file script cũ)
- `smart_farm/main.py` – Điểm vào kịch bản Python cũ.
- `smart_farm/services/odoo_client.py` – Lớp kết nối XML-RPC thủ công.
- `smart_farm/services/gps.py` – Script GPS độc lập.
- `smart_farm/services/message.py` – Script gửi thông báo độc lập.
- `smart_farm/services/weather.py` – Script thời tiết độc lập.
- Toàn bộ thư mục `smart_farm/services/` bị loại bỏ.

#### 🆕 Thêm mới (cấu trúc Odoo Module chuẩn)
- `smart_farm/__manifest__.py` – Khai báo module Odoo.
- `smart_farm/__init__.py` – Khởi tạo package Python.
- `smart_farm/models/__init__.py` – Import gps, weather, alert.
- `smart_farm/models/gps.py` – Model `SmartFarmGPS` (Odoo ORM).
- `smart_farm/models/weather.py` – Model `SmartFarmWeather` + method `fetch_and_save()`.
- `smart_farm/models/alert.py` – (Lúc đầu là refactor từ `message.py` cũ).
- `smart_farm/views/` – Thư mục giao diện XML.
- `smart_farm/security/` – Thư mục phân quyền.

### ⚙️ Thay đổi cấu hình

| Thông số        | Giá trị cũ              | Giá trị mới             |
|-----------------|-------------------------|-------------------------|
| Port (host)     | `8069`                  | `8060`                  |
| Database name   | `my_smart_farm`         | `Farm_Management`       |
| Admin email     | `admin@example.com`     | `admin123@gmail.com`    |
| Admin password  | `admin`                 | `abc123`                |
| URL             | `http://localhost:8069` | `http://localhost:8060` |

---

## [v0.1.1] – 2026-08-07

### 📄 Tài liệu
- Viết hoàn chỉnh `README.md` tại thư mục gốc (`Farm-Management/README.md`) với 3 phần:
  1. Giới thiệu tổng quan dự án.
  2. Hướng dẫn cài đặt và chạy dự án (5 bước).
  3. Quy trình làm việc nhóm (Git branching, Conventional Commits, checklist PR).

### 🐳 Hạ tầng
- Cài đặt `docker-compose-plugin` từ repository Docker chính thức để hỗ trợ lệnh `docker compose` (thay thế `docker-compose` gây lỗi `unknown shorthand flag: 'd' in -d`).
- Quy trình cài đặt plugin đã được ghi vào README (Bước 0).

---

## [v0.1.0] – Khởi tạo dự án

### 🆕 Cấu trúc ban đầu

Dự án khởi tạo với kiến trúc **script Python + Odoo XML-RPC**:

```
smart_farm/
├── docker-compose.yml       # Odoo 17 + PostgreSQL 15 (port 8069)
├── main.py                  # Script chạy tuần tự 3 kịch bản
├── config.py                # URL=localhost:8069, DB=my_smart_farm
├── requirements.txt         # requests
└── services/
    ├── odoo_client.py       # Kết nối XML-RPC
    ├── gps.py               # Ghi tọa độ GPS vào Odoo Notes
    ├── message.py           # Gửi thông báo qua Odoo Discuss
    └── weather.py           # Gọi Open-Meteo, log vào mail.message
```

### ⚙️ Cấu hình ban đầu

| Thông số        | Giá trị                  |
|-----------------|--------------------------|
| Odoo image      | `odoo:17`                |
| Port (host)     | `8069`                   |
| Database name   | `my_smart_farm`          |
| Admin email     | `admin@example.com`      |
| Admin password  | `admin`                  |
| URL             | `http://localhost:8069`  |

### 🔧 Tính năng ban đầu
- `gps.py`: Ghi tọa độ GPS (TP.HCM: lat=10.762622, lon=106.660172) vào Odoo Notes.
- `message.py`: Gửi cảnh báo lịch tưới tiêu khu vực A qua Odoo Discuss.
- `weather.py`: Gọi `api.open-meteo.com`, lấy nhiệt độ + tốc độ gió, lưu vào `mail.message` của Odoo.
