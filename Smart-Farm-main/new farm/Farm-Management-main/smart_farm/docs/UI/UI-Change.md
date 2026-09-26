# 🎨 Nhật ký thay đổi giao diện (UI Changes) – Smart Farm Management

> File này chuyên theo dõi chi tiết toàn bộ các thay đổi về giao diện người dùng (UI), trải nghiệm (UX), thiết kế thành phần (Component Design) và hệ thống Style/CSS của dự án.

---

## [2026-09-26] – Hoàn Thiện Tương Tác Click Cây 3D, Diễn Hoạt Các Hệ Thống Tưới Tiêu 3D & Khắc Phục Lỗi Xoay Sơ Đồ Khu A (Feature 003.4)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **1. Khắc phục Triệt để Lỗi Không Mở Bảng Cây (`#sf-plant-drawer`) Khi Nhấp Vào Cây Trong 3D:**
  * *Thu nhỏ hitbox phun sương trần (`mistHit`):* Kích thước cũ $16\text{m} \times 1.4\text{m} \times 30\text{m}$ phủ kín trần làm tia Raycaster luôn đâm trúng trước cây trồng. Đã thu nhỏ thành thanh mảnh $1.2\text{m} \times 0.5\text{m}$ dọc đúng ống trung tâm ($x \in [-0.6, 0.6]$).
  * *Ưu tiên tuyệt đối Cây trồng trong Raycasting:* Khi duyệt qua danh sách va chạm `intersects`, hệ thống luôn ưu tiên chọn cây trồng trước các thiết bị trần.
  * *Mở rộng hitbox cây và liên kết toàn bộ bộ phận:* Mở rộng `plantHit` lên bán kính $1.15\text{m}$, cao $3.8\text{m}$; gắn `userData` và đăng ký tương tác cho toàn bộ các khối tán lá (`foliage`), dây leo (`cable`), và quả (`melon`).
  * *Bổ sung nút chọn nhanh:* Thêm nút **`🌱 Cây`** trên cụm phím điều hướng D-Pad và thanh công cụ 3D, hỗ trợ nhấp đúp (Double-click) vào cây để mở ngay bảng điều khiển chi tiết `#sf-plant-drawer`.
* **2. Bổ Sung Đầy Đủ Các Hành Động Tưới 3D Khác Nhau Trong Không Gian Nhà Màng:**
  * *Tưới phun mưa tự động (`sprinkler`):* Dựng 8 béc phun xoay tự động tại độ cao $4.2\text{m}$ dọc 2 hàng dầm nóc; diễn hoạt 480 hạt nước phun mưa (`sprinklerPoints`) xoay tròn xòe rộng hình nón và rơi phủ đều các luống lá cây trong `animate()`.
  * *Châm dinh dưỡng NPK (`fert`):* Dựng 4 đường ống mờ dẫn vi lượng dọc 4 luống trồng; diễn hoạt 160 hạt tinh thể vi lượng màu xanh ngọc huỳnh quang (`fertPoints`, `#22c55e`) chuyển động tuần hoàn liên tục dọc đường ống và nhỏ giọt vào 40 bầu rễ cây.
  * *Tưới nhỏ giọt tự động (`drip`):* Diễn hoạt 80 giọt nước rơi tí tách vào từng bầu rễ.
  * *Đồng bộ thời gian thực:* Khi bật/tắt thiết bị trong bảng điều khiển bên phải, các hành động mô phỏng 3D bật/tắt ngay lập tức.
* **3. Khắc Phục Hiện Tượng Nhạy Chuột Khi Xoay Sơ Đồ Khu A 3D:**
  * Bắt sự kiện `start` và `end` của `OrbitControls` để nhận diện chính xác trạng thái xoay phân khu (`isOrbitingCampus`).
  * So khớp điểm bắt đầu nhấn chuột (`cpDownTarget`) và điểm nhả chuột (`cpUpTarget`). Chỉ khi người dùng click dứt khoát tại chỗ (`dist < 4px`, `elapsed < 350ms`) trên cùng một ngôi nhà màng thì mới chuyển trang. Loại bỏ 100% việc xoay hoặc kéo chuột qua nhà màng làm kích hoạt chuyển vào 3D.

---

## [2026-09-26] – Thiết Kế Lại Thẻ Điều Khiển Thiết Bị IoT & Khắc Phục Tương Tác Click Cây Trồng 3D (Feature 003.3)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **1. Khắc phục Triệt để Lỗi Không Mở Bảng Cài Đặt Tưới & Thông Số Khi Click Vào Cây 3D:**
  * *Chuyển đổi Hitbox sang Transparent Opacity 0:* Loại bỏ vật liệu `{ visible: false }` gây ra hiện tượng Raycaster của Three.js bỏ qua không phát hiện va chạm. Chuyển sang `new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })` bao bọc quanh mỗi cây hình trụ rộng $0.9\text{m} \times 3.6\text{m}$.
  * *Gán tương tác cho quả dưa và tán lá:* Gán `userData` sinh học trực tiếp vào quả dưa (`melon`) và thân lá, đưa quả dưa vào `interactiveObjects` để người dùng click trúng quả hoặc thân cây đều kích hoạt tương tác ngay lập tức.
  * *Bắt sự kiện Click chuẩn xác qua `pointerdown` + `pointerup`:* Tránh hiện tượng `THREE.OrbitControls` nuốt mất sự kiện `click` khi người dùng rê nhẹ tay ($\Delta < 6\text{px}$). Bổ sung debounce $150\text{ms}$ loại bỏ xung đột click đúp.
  * *Mở bảng thông số & Đóng mượt Zone Drawer:* Khi nhấp vào cây, nếu Bảng điều khiển phân khu A đang mở, hệ thống sẽ ẩn mượt nó đi và trượt ra `#sf-plant-drawer` với `z-index: 1070;`, điền đầy đủ 6 chỉ số nông học gốc và tùy chọn tưới riêng.
  * *Nút điều hướng quay lại:* Bổ sung nút bấm `"← Quay lại thiết bị Khu A"` trên đầu `#sf-plant-drawer` giúp người dùng chuyển đổi qua lại thuận tiện.
* **2. Thiết Kế Lại Toàn Diện Thẻ Thiết Bị IoT (Tránh Co Cụm, Vỡ Bố Cục Thẻ):**
  * *Tách biệt bố cục 2 tầng (Column Layout):* Sửa `.sf-device-card` từ `display: flex; flex-direction: row` thành `flex-direction: column; align-items: stretch;`.
  * *Hàng chính phía trên (`.sf-device-main-row`):* Icon thiết bị bo góc mềm $40\times 40\text{px}$, tiêu đề, badge trạng thái `ĐANG CHẠY` / `ĐANG TẮT` và mô tả phụ chiếm trọn không gian bên trái; công tắc toggle switch cố định ngay ngắn ở góc trên bên phải, không còn bị ép chen vào giữa dòng chữ.
  * *Khối cài đặt phụ phía dưới (`.sf-device-subcontrols`):* Chiếm trọn $100\%$ chiều rộng thẻ, nền xám thanh lịch `#f8fafc`, viền vi mô `#e2e8f0`, bo góc $10\text{px}$, hiệu ứng chuyển cảnh trượt mở (`@keyframes sfFadeSlideDown`).
  * *Hàng cài đặt (`.sf-subctrl-row`):* Icon minh họa rõ ràng (`💧 Mức nhỏ giọt`, `🕒 Chu kỳ tưới`, `🚿 Lượng nước`, `⏱️ Thời gian tưới`), nhãn căn trái, và dropdown select căn phải với viền mềm, bo góc $8\text{px}$, chuẩn SaaS hiện đại.

---

## [2026-09-26] – Giám Sát Cây Trồng Gốc 1-1, Hệ Thống Điều Khiển Tưới Tiêu Thông Minh & Điều Hướng Đi Dạo 3D (Feature 003.2)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **1. Đồng nhất 100% Định dạng Thông số khi Di chuột (Uniform Hover Metrics):**
  * Chuẩn hóa định dạng hiển thị thông số vi khí hậu & sinh trưởng cho toàn bộ 40 cây trồng độc lập trong nhà màng:
    - *Tiêu đề:* `🌱 [Tên giống cây] #[Mã cây]` (Ví dụ: `🌱 Dưa Lưới Nhật Bản CNC #GH01-P05`)
    - *Nội dung:* `Độ ẩm: 72% • Nhiệt độ quanh gốc: 26.5°C • Độ tuổi: 45 ngày • Dự kiến thu hoạch: 20 ngày nữa`
  * Đảm bảo tính nhất quán tuyệt đối, không còn hiện tượng mỗi cây hiển thị một kiểu thông số rời rạc.
* **2. Bảng Giám Sát Cây Trồng Gốc 1-1 & Cài Đặt Tưới Tiêu Riêng (`#sf-plant-drawer`):**
  * Khi nhấp chuột vào bất kỳ cây trồng nào trong mô hình 3D, camera sẽ lướt nhẹ nhàng đến cận cảnh cây đó và mở bảng điều khiển trượt độc lập từ cạnh phải:
    - **Tóm tắt sức khỏe sinh học:** Tình trạng sinh trưởng (🟢 Khỏe mạnh tối ưu), thanh tiến trình vòng đời (45/65 ngày).
    - **Lưới 6 chỉ số nông học cảm biến rễ:** Độ ẩm bầu rễ (72%), Nhiệt độ quanh gốc (26.5°C), Độ chua đất (6.2 pH), Dinh dưỡng khoáng (1.8 mS/cm EC), Cường độ quang hợp (8,400 lux), Độ ngọt Brix ước tính (14.2° Brix chuẩn GlobalGAP).
    - **Hệ thống điều khiển tưới tiêu riêng cho từng cây:**
      - Công tắc: *Kích hoạt chế độ tưới riêng (Ghi đè cài đặt tổng)*.
      - Phương thức tưới: Tưới nhỏ giọt bù ẩm gốc / Tưới châm phân NPK / Tạm ngưng (xiết nước làm ngọt).
      - Lượng nước: Ít (100ml) / Chuẩn (200ml) / Nhiều (350ml).
      - Tần suất: Mỗi 2h / Mỗi 4h / Tự động theo cảm biến rễ.
      - Nút bấm tức thời: **`💧 Kích hoạt tưới ngay cho cây này (150ml)`** kèm hiệu ứng giọt nước và tăng trực tiếp chỉ số độ ẩm rễ trong thời gian thực.
* **3. Điều Hướng Đi Dạo 3D Toàn Diện (Camera Walk & D-Pad Navigation):**
  * Tích hợp cụm phím điều hướng HUD nổi góc trên bên trái (`.sf-3d-nav-overlay`):
    - **`▲ Tiến vào trong (W)`**, **`▼ Lùi ra ngoài (S)`**, **`◀ Sang trái (A)`**, **`▶ Sang phải (D)`**, **`● Đặt lại vị trí mặc định`**, **`🔍+ Phóng to`**, **`🔍- Thu nhỏ`**.
  * Hỗ trợ phím tắt bàn phím trực tiếp: `W` / `↑` (Đi sâu vào hành lang), `S` / `↓` (Lùi ra ngoài), `A` / `←` (Trượt trái), `D` / `→` (Trượt phải), `R` (Đặt lại góc nhìn).
  * Hỗ trợ **Double-click (Nhấp đúp chuột)** vào bất kỳ vị trí lối đi hoặc luống cây để lướt camera đến ngay vị trí đó.
* **4. Khắc phục Triệt để Lỗi Không Đồng Bộ Thiết bị IoT & Lưu trữ Bền vững (`sfDeviceStore`):**
  * Xây dựng module `window.sfDeviceStore` lưu trữ tập trung vào `localStorage`, khắc phục lỗi công tắc bị reset về trạng thái bật mặc định khi đóng/mở bảng hay chuyển tab.
  * Sửa lỗi sai lệch định danh thiết bị (`mist` / `fan` / `shade` / `drip` / `sprinkler`), gạt công tắc là mô hình 3D bên ngoài lập tức phản hồi (quạt dừng quay, sương mù biến mất, hạt nước tưới nhỏ giọt ngắt).
  * Khi mở bảng điều khiển trong chế độ 3D, backdrop chuyển sang kính trong suốt (`.sf-3d-clean`), giúp người dùng nhìn rõ mô hình 3D phản ứng ngay bên cạnh bảng điều khiển.
* **5. Hệ Thống Điều Khiển Thủy Lợi & Tưới Tiêu Tổng Phân Khu:**
  * Bổ sung vào Bảng điều khiển phân khu A:
    - **Hệ thống tưới nhỏ giọt tự động:** Công tắc Master, chọn tốc độ nhỏ giọt (Chậm 20ml/h, Chuẩn 50ml/h, Bù ẩm nhanh 100ml/h), chu kỳ tưới (2h, 4h, theo cảm biến).
    - **Hệ thống tưới phun mưa tự động:** Công tắc Master, điều chỉnh lượng nước (3L, 5L, 8L/m²), thời gian ca tưới (10m, 15m, 30m).
    - **Hệ thống châm dinh dưỡng NPK:** Bơm định lượng hòa tan vi lượng tự động.
* **6. Giám Sát Dung Tích Bồn Chứa Nước Ở Khu A 3D (Water Tank Telemetry):**
  * Trang bị vòng đo mực nước kỹ thuật số (LED Ring) và hitbox cảm biến cho 4 bồn chứa nước (`WT-01` đến `WT-04`).
  * Khi di chuột vào bồn nước, hiển thị ngay thẻ HUD: Tên bồn chứa, Dung tích còn lại (ví dụ $42.500 / 50.000\text{ Lít}$ - $85\%$), Tình trạng áp lực bơm (3.2 bar) và trạm cấp nước.

---

## [2026-09-26] – Nâng cấp Mô hình 3D Campus Phân Khu A & Hoàn thiện Đồ họa Nội thất Nhà màng (Feature 003.1)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **1. Toàn cảnh 3D Phân Khu A (3D Campus Overview - `sfInitZoneA3D`):**
  * Thay thế sơ đồ 2D tĩnh bằng mô hình không gian 3D tương tác toàn diện với cụm 16 nhà màng công nghệ cao (lưới 4x4) bằng kính phản chiếu.
  * Tích hợp mạng lưới hạ tầng đồng bộ: Đường nhựa nội bộ Asphalt có vạch kẻ tim đường phản quang, 4 cụm giàn pin năng lượng mặt trời trên mái, 2 bồn chứa nước tưới và trạm bơm điều áp.
  * Tương tác thông minh (Raycasting): Rê chuột qua bất kỳ nhà màng nào sẽ phát sáng viền và hiển thị HUD Card vi khí hậu (`#sf-zone-a-hover-card`). Click vào nhà màng lập tức lướt camera vào bên trong mô hình 3D Digital Twin của nhà màng đó.
  * Cụm nút chuyển đổi chế độ hiển thị linh hoạt: **`🎮 3D Phân khu`** và **`🗺️ Sơ đồ 2D`**.
* **2. Khắc phục triệt để Lỗi Đồ họa Khung Kính & Xà dầm Nội thất 3D:**
  * **Chân móng bê tông vững chắc**: Bổ sung hệ dầm móng bê tông đúc khối (`curbH = 0.7m`) bao quanh 4 mặt chân tường, loại bỏ tình trạng cột thép cắm lơ lửng.
  * **Sửa góc nghiêng xà gồ mái chính xác**: Tính toán lại độ dốc hình học (`rafterAngle = Math.atan2(3.0, 10) = 0.291 rad`), các thanh xà kèo trái và phải nối khớp hoàn hảo từ mép tường lên đỉnh nóc (ridge beam), giải quyết triệt để lỗi các thanh xà lơ lửng trong không trung.
  * **Tối ưu độ trong suốt và tương phản kính**: Nâng độ chắn sáng kính (`opacity: 0.40, color: 0x93c5fd`), nẹp khung nhôm đố kính dày dặn rõ nét giúp nhìn rõ phân tầng giữa mái trần và đáy sàn luống dưa.
  * **Bổ sung phụ kiện nhà màng chuyên nghiệp**: Lưới cắt nắng nhiệt dạng sợi nhôm phản xạ (`Aluminet`) màu xám bạc luồn dưới xà mái và hệ thống thanh đèn LED quang phổ hồng/magenta chuyên dụng cho quang hợp.
* **3. Tương tác Cảm biến Sinh học Cây trồng & Trái cây (Plant & Fruit Raycasting):**
  * Mở rộng phạm vi tương tác con trỏ chuột sang toàn bộ sinh khối nông nghiệp trong nhà màng: Bọc hitbox cho 4 luống cây dưa lưới và từng trái dưa chín vàng.
  * Khi rê chuột vào luống cây hoặc trái dưa, hiển thị ngay thẻ thông số sinh học chi tiết: Giống cây (*Dưa lưới TL3 GlobalGAP*), Ngày tuổi (*42/65 ngày*), Chiều cao cây (*1.85m*), Độ ẩm rễ (*72%*), Nồng độ dinh dưỡng EC (*1.8 mS/cm*), Độ pH (*6.2*), Độ ngọt Brix ước tính (*14.2° Brix*) và Khối lượng (*1.42 kg*).

---
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`specs/003-3d-digital-twin-greenhouse/`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/specs/003-3d-digital-twin-greenhouse/)
* **1. Điều hướng Bản đồ Đa tầng (Multi-level Map Navigation):**
  * **Tầng 1 (Toàn cảnh Farm)**: Giữ nguyên bản đồ GIS vĩ mô. Nhấp vào Khu A chuyển cảnh mượt sang sơ đồ mặt bằng chi tiết Khu A.
  * **Tầng 2 (Sơ đồ Mặt bằng Khu A - `#sf-map-level-zone-a`)**: Hiển thị ảnh quy hoạch chi tiết 16 nhà kính công nghệ cao (lưới 4 hàng x 4 cột). Từng nhà kính là một hotspot tương tác (`.sf-gh-hotspot`) kèm badge vi khí hậu nổi bật khi rê chuột.
  * **Tầng 3 (Không gian 3D Digital Twin - `#sf-map-level-greenhouse-3d`)**: Nhấp chọn bất kỳ nhà màng nào (ví dụ GH-01) để bước vào không gian 3D Three.js WebGL tham quan nội thất thực tế.
* **2. Mô phỏng 3D Procedural Kiến trúc & Thiết bị Nông nghiệp Thông minh:**
  * Dựng khung vòm thép chịu lực mạ kẽm trắng cao cấp, vách và mái kính cường lực mờ phản chiếu ánh sáng tự nhiên.
  * 4 dãy máng composite trồng dưa lưới thủy canh đều đặn, giàn dây leo vươn lên xà mái, khóm lá xanh và chùm dưa lưới chín vàng rực rỡ.
  * Hệ thống quạt đối lưu gắn tường với cánh quạt xoay tít theo trạng thái thời gian thực.
  * Hệ thống béc phun sương trần phát 700 hạt nước chuyển động li ti tạo hiệu ứng sương mù thực tế.
  * Cọc cảm biến môi trường IoT cắm tại luống đất có đèn LED xanh ngọc bích phát sáng nhịp tim.
* **3. Tương tác 2 chiều (Bidirectional Interaction & Raycasting):**
  * Raycasting 3D nhận diện con trỏ: Rê chuột hiện thẻ thông tin thiết bị, Click vào thiết bị trong 3D lập tức mở Drawer bên phải và làm nhấp nháy công tắc điều khiển tương ứng.
  * Gạt công tắc ở Drawer bên phải đồng bộ ngay lập tức sang mô hình 3D (kích hoạt quay quạt, phun sương hạt nước).
  * Bộ nút chuyển nhanh góc nhìn camera trực quan: Toàn cảnh, Luống dưa, Thiết bị trần, Tự động xoay 360 độ.

---

## [2026-09-26] – Nâng cấp Thiết kế Bản đồ GIS Cao cấp & Tách biệt Header Độc lập theo Tab
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **1. Đóng gói Header & Huy hiệu Cập nhật vào Tab Tổng quan:**
  * Di chuyển thẻ `.sf-header` (chứa tiêu đề "Tổng quan trang trại" và nhịp tim "Cập nhật: ...") vào bên trong vùng chứa `#tab-overview`. Khi người dùng chuyển sang tab "Bản đồ", "Công việc" hoặc "Kho vật tư", header này tự động ẩn hoàn toàn theo cơ chế đóng gói giao diện tự nhiên.
  * Trang Bản đồ được trang bị header riêng biệt: *"Bản đồ số nông trại"* kèm huy hiệu trạng thái *"🟢 Giám sát trực tuyến"*.
  * **Chuyển liên kết "Hệ thống Odoo" vào menu Cài đặt (Settings)**: Bỏ nút "Hệ thống Odoo" khỏi cụm điều hướng chính giữa Navbar (`.sf-nav-pills`), giữ navbar cân đối và thuần túy các phân hệ Farm. Bổ sung mục "Hệ thống Odoo" vào đầu menu dropdown Cài đặt hệ thống (`#sf-settings-menu`).
* **2. Nâng cấp Thẩm mỹ Bản đồ & Tránh vỡ giao diện (Offcanvas Drawer):**
  * Di chuyển Backdrop và Drawer (`#sf-zone-drawer`) ra cấp độc lập ở cuối thẻ `<body>` với thuộc tính phòng vệ `style="display:none;"`, triệt tiêu hoàn toàn hiện tượng text trôi xuống dưới chân bản đồ khi tải trang.
  * Tích hợp thanh điều khiển lớp bản đồ kiểu Pill hiện đại (`.sf-layer-btn-pro`) với số lượng đếm trực quan và hiệu ứng phát sáng khi kích hoạt.
  * Thay thế tooltip vuông thô sơ bằng các Chip HUD vi khí hậu kính mờ cao cấp (`.sf-zone-chip`) trên từng phân khu (Zone A, Zone B, Zone C). **Ẩn mặc định (`opacity: 0; visibility: hidden;`) để không che khuất chữ và chi tiết gốc trên bản đồ**, chỉ khi người dùng di chuột (hover) vào phân khu thì chip mới trượt nhẹ và hiện lên mượt mà.
  * Thiết kế lại ghim máy cày định vị GPS (`.sf-vehicle-hud-pin`) với chip vận tốc và sóng radar 2 tầng.
  * Tối ưu hóa bảng trượt Offcanvas Drawer với hệ thống lưới 4 thẻ vi khí hậu có thanh tiến độ (Progress bar) và danh sách thiết bị IoT gắn công tắc trượt chuẩn iOS cùng huy hiệu trạng thái "ĐANG CHẠY / ĐANG TẮT" cập nhật thời gian thực.
  * Nhúng CSS trọng yếu trực tiếp trong `<style>` với CDATA và nâng cấp tham số cache buster `?v=105` cho cả CSS và JS.

---

## [2026-09-26] – Sửa lỗi QWeb 500 & Chuẩn hoá Data Attributes cho Điểm Cảnh báo Sự cố
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Nguyên nhân lỗi 500:** Trong `dashboard.xml` tại thẻ `.sf-alert-beacon`, thuộc tính `t-attf-onclick` chứa chuỗi lồng dấu nháy thoát `\'Toàn trang trại\'` khiến bộ phân tích QWeb của Odoo báo lỗi biên dịch cú pháp `ValueError: Can not compile expression`.
* **Giải pháp khắc phục:**
  * Chuyển toàn bộ tham số truyền hàm (`alert.id`, `alert.name`, `alert.area`, `alert.content`) sang chuẩn HTML5 `data-*` attributes (`t-att-data-id`, `t-att-data-name`, `t-att-data-area`, `t-att-data-content`).
  * Gọi hàm trung gian `onclick="sfOnAlertClick(event, this)"` trong `dashboard.js` để đọc dữ liệu từ `dataset` và gọi `sfShowAlertDetails()`.
  * Đảm bảo tính tương thích tuyệt đối với engine biên dịch QWeb Odoo 18.

---

## [2026-09-26] – Ra mắt Bản đồ Nông trại Tương tác (Interactive Smart Farm Map – Feature 002)

### 1. 🗂️ Thanh bộ lọc lớp bản đồ đa tầng (`.sf-map-toolbar`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết kỹ thuật:**
  * Bổ sung thanh công cụ `.sf-map-toolbar` với 3 nút chuyển đổi trạng thái lớp: `🚜 Phương tiện GPS`, `💧 Thủy lợi & Cảm biến`, `⚠️ Cảnh báo sự cố`.
  * Xử lý ẩn/hiện tức thì qua hàm `sfToggleMapLayer(layerName, btn)` mà không giật khung hình.

### 2. 🚜 Giám sát Phương tiện GPS di động & Popover thông tin (`.sf-vehicle-marker`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết kỹ thuật:**
  * Tạo marker nổi `.sf-vehicle-marker` định vị tại Khu B với hiệu ứng sóng radar tỏa ra 2 nhịp (`.sf-radar-ring`).
  * Khi click, hiển thị thẻ nổi `#sf-vehicle-popover` với đầy đủ thông tin: Tên máy cày Kubota L4018, Tọa độ GPS thực tế từ database, Tốc độ (7.2 km/h), Tài xế phụ trách và Trạng thái hoạt động.

### 3. ⚠️ Điểm Cảnh báo Sự cố nhấp nháy & Xác nhận xử lý nhanh (`.sf-alert-beacon`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết kỹ thuật:**
  * Render tự động các điểm ghim cảnh báo `.sf-alert-beacon` theo các khu vực đang có sự cố (`active_alerts`).
  * Hiệu ứng sóng nhịp đập cảnh báo màu đỏ (`@keyframes sfBeaconWave`).
  * Click mở popover chi tiết sự cố và nút `✓ Xác nhận đã xử lý` kết nối API `POST /smart_farm/api/alert/resolve` cập nhật database tức thì và xóa icon khỏi bản đồ.

### 4. 🎛️ Bảng Chi tiết Phân khu & Điều khiển Thiết bị IoT (`#sf-zone-drawer`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết kỹ thuật:**
  * Nhấp vào từng phân khu (Zone A, B, C) sẽ kích hoạt thanh trượt Offcanvas `#sf-zone-drawer` với backdrop làm mờ.
  * Hiển thị lưới chỉ số môi trường (Độ ẩm đất, nhiệt độ, độ ẩm không khí, cường độ ánh sáng lux).
  * Danh sách công tắc điều khiển IoT thực tế theo phân khu:
    * **Khu A (Nhà màng):** Phun sương làm mát, Quạt thông gió đối lưu, Mái che tự động.
    * **Khu B (Cánh đồng):** Tưới nhỏ giọt ngầm, Bơm phân bón tự động.
    * **Khu C (Hồ chứa):** Trạm máy bơm cấp nước hồ, Máy sục khí đáy hồ.
  * Mỗi lần gạt công tắc, hệ thống gửi lệnh qua API `POST /smart_farm/api/zone/control` và hiển thị thông báo Toast xác nhận.

---

## [2026-09-26] – Đồng bộ động tiêu đề trang và huy hiệu thời gian theo từng Tab điều hướng

### 1. 🏷️ Đổi tiêu đề trang (`#sf-page-title`) & Trạng thái huy hiệu (`#sf-page-badge`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/js/dashboard.js`](file:///home/tom/projects/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thay đổi:**
  * Bổ sung định danh `id="sf-page-title"` cho tiêu đề trang và `id="sf-page-badge"` cho huy hiệu nhịp tim hiển thị thời gian cập nhật.
  * Cập nhật hàm điều hướng tab `sfOpenTab(evt, tabName)` trong Javascript:
    * Khi ở tab **Tổng quan (`tab-overview`)**: Tiêu đề hiển thị `"Tổng quan trang trại"`, huy hiệu thời gian được bật hiển thị (`display: inline-flex`).
    * Khi chuyển sang tab **Công việc (`tab-tasks`)**: Tiêu đề đổi thành `"Quản lý công việc"`, huy hiệu thời gian tự động ẩn (`display: none`).
    * Khi chuyển sang tab **Bản đồ (`tab-map`)**: Tiêu đề đổi thành `"Bản đồ nông trại"`, huy hiệu thời gian tự động ẩn (`display: none`).
    * Khi chuyển sang tab **Kho & Sản phẩm (`tab-inventory`)**: Tiêu đề đổi thành `"Kho vật tư & Sản phẩm"`, huy hiệu thời gian tự động ẩn (`display: none`).
  * Khởi tạo đồng bộ ngay khi load trang từ trạng thái lưu trong `localStorage`.

---

## [2026-09-26] – Ra mắt không gian Quản lý Công việc Nông trại (Task Management Workspace) & Kéo thả sắp xếp

### 1. 📋 Nút điều hướng Tab "Công việc" trên Navbar
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thành phần:**
  * Bổ sung nút bấm tab `Công việc` vào cụm điều hướng trung tâm `.sf-nav-pills` (nằm ngay sau tab `Tổng quan`).
  * Sử dụng cơ chế `sfOpenTab(event, 'tab-tasks')` đồng nhất với hệ thống tab hiện tại.
  * Tự động lưu và duy trì trạng thái tab đang chọn trong `localStorage` (`sf_active_tab`), giúp người dùng không bị chuyển hướng về trang chủ khi tải lại hoặc lưu dữ liệu.

---

### 2. 🔗 Nút nhảy nhanh "Quản lý danh sách →" trên Card Tổng quan
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thành phần:**
  * Thêm nút liên kết `.sf-link-btn` (`Quản lý danh sách →`) tại góc phải tiêu đề của thẻ "Công việc hôm nay" (Dashboard Overview).
  * Cho phép người dùng chỉ với 1 cú click là chuyển ngay lập tức sang tab Quản lý công việc để thực hiện các thao tác chuyên sâu.

---

### 3. 🛠️ Không gian làm việc Quản lý Công việc (`#tab-tasks`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thành phần:**
  * **Header Card Toolbar:**
    * Tiêu đề lớn kèm icon công việc xanh lá cây, mô tả hướng dẫn trực quan.
    * Nút hành động chính `+ Thêm công việc` (`.sf-btn-emerald`) nổi bật với hiệu ứng nâng thẻ và đổ bóng mềm.
  * **Thanh tìm kiếm & Bộ lọc linh hoạt:**
    * Ô tìm kiếm từ khóa real-time (`#sf-task-search-input`) lọc tức thời theo tên công việc hoặc nội dung ghi chú kèm nút xóa nhanh (×).
    * Bộ lọc trạng thái dạng viên thuốc (Filter pills): **Tất cả**, **Chưa xong**, **Đã xong**.
    * Dropdown phân loại chuyên sâu: Tất cả, Tưới tiêu, Cảm biến, GPS, Mùa vụ, Kho & Vật tư, Báo cáo.
  * **Thanh thông tin & Gợi ý (Info bar):**
    * Hiển thị số lượng công việc: `Hiển thị X / Y công việc · ✓ Z hoàn thành`.
    * Dòng nhắc nhở tương tác kéo thả với biểu tượng `⋮⋮`.
  * **Thẻ công việc tương tác cao (`.sf-task-card`):**
    * Cần gắp kéo thả (`.sf-drag-handle`): Cho phép người dùng kéo thả để thay đổi vị trí ưu tiên.
    * Checkbox trạng thái: Đánh dấu hoàn thành trực quan với màu xanh lục và gạch ngang chữ.
    * Thẻ phân loại Tag màu chuẩn thiết kế: Tưới tiêu (`tag-blue`), Cảm biến & GPS (`tag-green`), Mùa vụ & Kho (`tag-amber`).
    * Badge ngày thực hiện (tự động nhận diện "Hôm nay") và tên người phụ trách.
    * Cụm nút tác vụ: Nút `Sửa` (✏️) mở modal cập nhật và Nút `Xóa` (🗑️) có hộp thoại xác nhận an toàn.
  * **Trạng thái kết quả rỗng (Empty state):**
    * Khi tìm kiếm hoặc lọc không có kết quả, hiển thị thông báo thân thiện kèm nút `Đặt lại bộ lọc` để phục hồi danh sách ban đầu.

---

### 4. 🔀 Tương tác Kéo thả sắp xếp thứ tự (Drag & Drop Reordering)
* **File cập nhật:** [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết kỹ thuật:**
  * Sử dụng Native HTML5 Drag and Drop API, không phụ thuộc thư viện bên ngoài.
  * Khi kéo, thẻ hiện hiệu ứng bán trong suốt mờ ảo và viền nét đứt xanh dương (`.dragging`), các thẻ bên dưới tự động dời chỗ nhịp nhàng theo vị trí con trỏ chuột.
  * Khi thả thẻ, danh sách ID thứ tự mới lập tức được gửi về server qua API `POST /smart_farm/api/task/reorder` và lưu vào trường `sequence` của database PostgreSQL, đảm bảo thứ tự luôn được duy trì lâu dài.

---

### 5. 🪟 Hộp thoại Thêm / Chỉnh sửa công việc (`#sf-task-modal`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thành phần:**
  * Thiết kế đồng bộ phong cách Boltshift Glassmorphism với Profile Modal.
  * Hỗ trợ 2 chế độ:
    * **Thêm mới**: Tiêu đề "Thêm công việc mới", ngày tự động gán là ngày hiện tại.
    * **Chỉnh sửa**: Tự động load dữ liệu của thẻ được chọn vào form và cập nhật nhãn nút bấm thành "Cập nhật công việc".
  * Xử lý lỗi form qua thông báo Alert đỏ và hiệu ứng Loading trên nút bấm.
  * Hỗ trợ đóng modal bằng nút X, bấm ra ngoài vùng mờ hoặc phím `Escape`.

---

## [2026-09-26] – Nâng cấp độ tương phản & Header phong cách Floating Pill (Boltshift)

### 1. 🧭 Thanh điều hướng Header nổi (Floating Pill Navbar - Boltshift Style)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py)
* **Chi tiết thành phần:**
  * **Khung chứa chính (`.sf-navbar`):**
    * Thiết kế dạng viên thuốc bo tròn tuyệt đối (`border-radius: 9999px`).
    * Nền trắng tinh (`#ffffff`), viền sắc nét `1.5px solid #cbd5e1`, hiệu ứng đổ bóng đa tầng `box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05)`.
    * Cố định ở đầu trang (`position: sticky; top: 14px; z-index: 100`) giúp dễ thao tác khi cuộn trang.
  * **Brand Logo (`.sf-brand`):**
    * Huy hiệu tròn 36px màu xanh dương `#2563eb` với biểu tượng tia sét trắng SVG và hiệu ứng đổ bóng màu.
    * Tên thương hiệu **SmartFarm** in đậm (`font-weight: 700; color: #0f172a`).
  * **Cụm điều hướng trung tâm (`.sf-nav-pills`):**
    * Container nền xám nhẹ `#f1f5f9` bo tròn 9999px.
    * Tab đang chọn (`.sf-nav-item.active`): Màu đen tuyền `#0f172a`, chữ trắng nổi bật, đổ bóng nhẹ.
    * Tích hợp cơ chế chuyển đổi tab tức thời qua hàm JS `sfOpenTab(event, '...')`:
      * **Tổng quan** (`tab-overview`)
      * **Bản đồ** (`tab-map`)
      * **Kho & Sản phẩm** (`tab-inventory`)
      * **Hệ thống Odoo** (chuyển hướng sang `/web`)
  * **Cụm tác vụ nhanh (`.sf-nav-actions`):**
    * Capsule tròn nhỏ nền `#f8fafc` chứa icon Chuông thông báo (kèm chấm đỏ trạng thái cảnh báo) và icon Bánh răng cài đặt hệ thống.
  * **Hồ sơ tài khoản (`.sf-user-profile`):**
    * Ảnh đại diện tròn (Avatar) kết nối tự động từ Odoo model `res.users` qua đường dẫn `/web/image?model=res.users&id=...`. Có fallback ảnh đại diện tự sinh.
    * Hiển thị Tên người dùng và Email đăng nhập (`admin123@gmail.com`).
    * Tích hợp Dropdown menu khi rê chuột (Hover) chứa link vào Quản trị Odoo và nút Đăng xuất.

---

### 2. 🔲 Tăng cường độ đậm đường viền & Độ tương phản (Contrast & Card Borders)
* **File cập nhật:** [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thay đổi:**
  * **Màu nền toàn trang (`body`):** Chuyển từ xám nhạt `#f5f5f3` sang `#eef2f6` (soft tech slate), tạo nền tương phản rõ rệt giúp các khối card màu trắng nổi bật, không bị chìm hay mờ nhạt.
  * **Đường viền các thẻ ([`.sf-stat`], [`.sf-card`]):**
    * Thay thế viền mờ `1px solid rgba(0,0,0,.08)` bằng viền xám công nghệ rõ nét **`1.5px solid #cbd5e1`**.
    * Bổ sung hiệu ứng nổi khối `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)` và hiệu ứng hover nhẹ nâng thẻ lên (`transform: translateY(-2px)`).
  * **Phân cách nội bộ thẻ:**
    * Thêm đường kẻ ngang `border-bottom: 1px solid #e2e8f0` dưới tiêu đề mỗi thẻ (`.sf-card-hd`).
    * Thẻ dự báo thời tiết 4 ngày (`.sf-fc-day`): Viền `1.5px solid #e2e8f0` bo góc mềm mại.
    * Tăng kích thước thanh hiển thị độ ẩm/nhiệt độ đất (`.sf-bar`) từ `3px` lên `6px`.

---

### 3. ⚡ Quản lý Cache trình duyệt
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml)
* Cập nhật query version CSS lên `?v=12` để bảo đảm trình duyệt người dùng luôn nhận bản cập nhật CSS mới nhất ngay sau khi tải lại trang.

---

### 4. 📐 Mở rộng Full-Width & Khắc phục lọt chữ cuộn trang (Sticky Bar & Layout Expansion)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thay đổi:**
  * **Kéo dài giao diện full màn hình:** Thay thế `max-width: 1400px; margin: 0 auto;` bằng `width: 100%; max-width: 100%; padding: 0 28px 40px 28px;`, loại bỏ hoàn toàn khoảng trống thừa ở 2 bên mạn, giúp giao diện Dashboard phủ kín toàn bộ chiều rộng màn hình.
  * **Khắc phục lỗi lọt chữ phía sau Header:**
    * **Hiện tượng:** Khi cuộn trang, chữ tiêu đề và ngày giờ cũ trượt lên khe trống 14px phía trên navbar, bị lộ ra phía sau logo và avatar.
    * **Xử lý:** Bọc thanh `sf-navbar` trong container `sf-navbar-sticky` cố định ở `top: 0` với nền trùng màu background `#eef2f6`, đóng vai trò như một lớp khiên che chắn triệt để mọi nội dung khi cuộn lướt bên dưới.
  * **Tái thiết kế hàng tiêu đề (`.sf-header`):**
    * Bố cục ngang cân xứng:
      * **Bên trái:** Tiêu đề trang **"Tổng quan trang trại"** in đậm sắc nét.
      * **Bên phải:** Huy hiệu trạng thái thời gian thực (`.sf-sub-badge`) bo tròn dạng viên thuốc màu trắng, có chấm xanh phát sáng nhịp tim (`.sf-pulse-dot`) hiển thị thời gian cập nhật.

---

### 5. 🖱️ Tinh chỉnh Hover Navbar & Dropdown tương tác Click (Settings & Account Dropdown)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thay đổi:**
  * **1. Độ tương phản Hover các nút Navbar (`.sf-nav-item:hover`):**
    * **Trước đây:** Nền `rgba(0,0,0,0.05)` quá mờ nhạt, gần như trùng với màu nền xám nhạt `#f1f5f9` của thanh pill.
    * **Sau khi sửa:** Đổi sang nền slate **`#cbd5e1`**, màu chữ đậm **`#0f172a`**, font chữ **`font-weight: 600`**, kèm đổ bóng nhẹ **`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`** và hiệu ứng co giãn nhẹ khi bấm (`:active { transform: scale(0.97) }`). Hover hiện rõ ràng, dứt khoát và cực kỳ bắt mắt.
  * **2. Nút Cài đặt (Settings gear icon) thành Dropdown Menu:**
    * **Trước đây:** Nút bánh răng trỏ trực tiếp đến liên kết `/web` tương tự như nút Odoo.
    * **Sau khi sửa:** Chuyển thành nút kích hoạt Dropdown menu (`onclick="sfToggleDropdown(event, 'sf-settings-menu')"`). Khi click sẽ xổ danh sách tùy chọn cấu hình:
      * **Thiết lập hệ thống** (`/web#action=base_setup.action_general_configuration`)
      * **Quản lý cơ sở dữ liệu** (`/web/database/manager`)
      * **Làm mới dữ liệu** (Refresh trực tiếp không cần tải lại thủ công)
  * **3. Khắc phục Dropdown Tài khoản (Account/Profile) bị mất khi di chuột:**
    * **Nguyên nhân cũ:** Dropdown kích hoạt bằng CSS `:hover` với khoảng cách `top: calc(100% + 8px)`. Khi người dùng di chuyển con trỏ chuột từ avatar xuống menu, chuột lọt vào khoảng hở 8px làm mất trạng thái `:hover`, khiến menu biến mất trước khi kịp nhấp chọn.
    * **Giải pháp mới:** Chuyển hoàn toàn sang cơ chế **Click để mở** (`Click-to-open` via `sfToggleDropdown`). Khi nhấp chuột vào Profile, menu sẽ hiển thị cố định (`.show`), người dùng thoải mái di chuột chọn các mục bên trong mà không bao giờ bị biến mất giữa chừng.
    * **Trải nghiệm bổ sung:** Thêm icon mũi tên nhỏ (`.sf-chevron-icon`) bên cạnh avatar tự động xoay 180° khi menu mở, cùng tính năng tự động đóng lại khi click ra ngoài vùng dropdown (`click-outside`).
  * **4. Quản lý Cache:** Bumping version lên `dashboard.css?v=13` và `dashboard.js?v=3`.

---

### 6. 👤 Thay thế Quản trị Odoo bằng Modal Profile (Chỉnh sửa Họ tên, SĐT, Email, Mật khẩu)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py)
* **Chi tiết thay đổi:**
  * **1. Chuyển đổi Menu Tài khoản:**
    * Thay thế mục "Quản trị Odoo" thành **"Hồ sơ cá nhân"** kèm icon người dùng SVG hiện đại.
    * Khi click vào, hệ thống kích hoạt hàm `sfOpenProfileModal()` mở hộp thoại Modal popup ngay trên giao diện dashboard.
  * **2. Thiết kế Hộp thoại Profile Modal (`#sf-profile-modal`):**
    * **Backdrop mờ cao cấp:** Nền tối `rgba(15, 23, 42, 0.6)` kết hợp bộ lọc làm mờ phông nền `backdrop-filter: blur(4px)`.
    * **Thẻ Card Modal:** Bo góc tròn mềm mại `18px`, viền `1.5px solid #cbd5e1`, đổ bóng nổi khối đa tầng `box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25)`.
    * **Các trường thông tin form:**
      * **Họ và tên:** Tự động điền giá trị hiện tại (`user.name`), cho phép chỉnh sửa.
      * **Số điện thoại:** Trường nhập SĐT liên hệ (`user.phone`).
      * **Email đăng nhập:** Email tài khoản Odoo (`user.email` / `user.login`).
      * **Đổi mật khẩu:** Hai ô nhập Mật khẩu mới và Xác nhận mật khẩu mới (có thể bỏ trống nếu không muốn đổi mật khẩu).
  * **3. Trải nghiệm tương tác (UX):**
    * Hỗ trợ đóng modal linh hoạt: bấm nút "Hủy", nút "×", bấm click ra ngoài phông nền (backdrop click), hoặc nhấn phím `Escape`.
    * Validate dữ liệu chặt chẽ ở cả Frontend và Backend (kiểm tra rỗng, trùng lặp email, khớp mật khẩu tối thiểu 6 ký tự).
    * Phản hồi trạng thái tức thời qua thanh thông báo `.sf-alert-success` / `.sf-alert-danger`.
    * Tự động cập nhật trực tiếp tên và email trên thanh Header (`#sf-top-user-name`, `#sf-top-user-email`) ngay sau khi lưu thành công mà không cần tải lại trang.
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=14` và `dashboard.js?v=4`.

---

### 7. 🏠 Tích hợp Logo SmartFarm làm nút điều hướng về Tổng quan (Brand Overview Link)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thay đổi:**
  * **1. Điều hướng thương hiệu (`.sf-brand`):**
    * Chuyển đổi khối `div.sf-brand` thành liên kết thẻ `a.sf-brand` kèm tooltip `"Về trang tổng quan"`.
    * Gắn sự kiện `onclick="sfGoToOverview(event)"`.
  * **2. Logic xử lý (`sfGoToOverview`):**
    * Khi người dùng nhấp vào Logo hoặc chữ SmartFarm, hệ thống sẽ:
      1. Tự động chuyển đổi tab nội dung về `tab-overview` (Tổng quan).
      2. Tự động đánh dấu nút "Tổng quan" trên thanh viên thuốc (`.sf-nav-pills`) thành trạng thái kích hoạt (`.active`), hủy chọn các tab khác.
      3. Cuộn mượt mà trang lên đầu (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * **3. Hiệu ứng giao diện (Style & Feedback):**
    * Con trỏ chuột chuyển thành hình bàn tay (`cursor: pointer`).
    * Hiệu ứng hover nhấc nhẹ (`transform: translateY(-1px)`, `opacity: 0.9`).
    * Hiệu ứng click phản hồi nhấn nhả (`:active { transform: scale(0.98) }`).
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=15` và `dashboard.js?v=5`.

---

### 8. 🌿 Tích hợp Favicon mầm lá công nghệ phát sáng (Favicon Integration)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), asset [`static/src/img/Favicon.jpg`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/img/Favicon.jpg)
* **Chi tiết thay đổi:**
  * Khai báo liên kết Favicon chuẩn cho các trình duyệt và thiết bị di động trong thẻ `<head>` của QWeb Template `smart_farm.dashboard_main`:
    * `<link rel="icon" type="image/jpeg" href="/smart_farm/static/src/img/Favicon.jpg"/>`
    * `<link rel="shortcut icon" type="image/jpeg" href="/smart_farm/static/src/img/Favicon.jpg"/>`
    * `<link rel="apple-touch-icon" href="/smart_farm/static/src/img/Favicon.jpg"/>`
  * Hiển thị biểu tượng nhận diện mầm cây IoT phát sáng màu xanh neon trên tab trình duyệt, bookmarks và màn hình chính khi lưu trang.

---

### 9. 📋 Hệ thống Quản lý Công việc Nông trại Động & Tương tác một chạm (Interactive Farm Task Card)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`views/task_views.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/task_views.xml), [`views/menu.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/menu.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py), [`models/task.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/models/task.py)
* **Chi tiết thay đổi:**
  * **1. Chuyển đổi dữ liệu Động (Dynamic Task Data):**
    * Loại bỏ hoàn toàn khối HTML tĩnh demo 6 công việc giả lập.
    * Thay bằng vòng lặp QWeb `<t t-foreach="tasks" t-as="task">` truy vấn trực tiếp từ bảng `smart.farm.task` cho ngày hôm nay.
    * Thẻ trạng thái tiêu đề đổi từ `badge-demo` thành `badge-live` với nhãn "Hôm nay".
    * Xử lý trường hợp không có việc với màn hình trống thân thiện (Empty state icon & text).
  * **2. Thao tác một chạm (One-click Interactive Toggle via AJAX):**
    * Người dùng có thể nhấp chuột trực tiếp vào ô vuông checkbox hoặc dòng chữ tiêu đề công việc.
    * Hàm JS `sfToggleTask(taskId, element)` thực hiện cập nhật tức thời (Optimistic UI):
      * Chuyển trạng thái checkbox sang nền xanh lá, hiện dấu tick `✓`.
      * Gạch ngang dòng chữ và làm mờ (`.sf-task-text.done`).
      * Gửi API ngầm `POST /smart_farm/api/task/toggle` cập nhật vào database.
      * Tự động cập nhật bộ đếm tiến độ ở chân thẻ (Ví dụ: `✓ 4 hoàn thành / 2 còn lại`).
      * Cơ chế tự hoàn tác (revert) an toàn nếu gặp sự cố mạng hoặc lỗi máy chủ.
  * **3. Quản trị Odoo Backend:**
    * Bổ sung menu **Smart Farm > Công việc** (`menu_smart_farm_task`).
    * Cung cấp giao diện List view (có boolean toggle), Form view và Search view (lọc Hôm nay, Đã xong, Chưa xong).
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=16` và `dashboard.js?v=6`.

