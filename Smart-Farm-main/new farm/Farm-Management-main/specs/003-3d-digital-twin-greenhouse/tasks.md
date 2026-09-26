# Tasks: Mô hình 3D Digital Twin Nhà màng Nông nghiệp Công nghệ cao (3D Digital Twin High-Tech Greenhouse)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Completed (Đã hoàn thành 100%)

---

## Danh sách công việc theo từng giai đoạn (Task Checklist)

### Giai đoạn 1: Cơ sở hạ tầng Thư viện 3D & Cấu trúc Bản đồ Đa tầng (Foundation & Multi-level Map)
- [x] **T001**: Nhúng thư viện Three.js (r128) và OrbitControls vào trang Dashboard trong `smart_farm/views/dashboard.xml`.
- [x] **T002**: Xây dựng cấu trúc HTML phân tầng bên trong `#tab-map` trong `smart_farm/views/dashboard.xml`:
  - `#sf-map-level-macro`: Vùng bản đồ toàn cảnh hiện tại.
  - `#sf-map-level-zone-a`: Sơ đồ mặt bằng chi tiết Khu A (lưới 12 nhà màng GH-01 đến GH-12, bể nước, tấm pin mặt trời).
  - `#sf-map-level-greenhouse-3d`: Khung nhìn 3D Digital Twin với thanh điều khiển camera và canvas WebGL.
- [x] **T003**: Định nghĩa kiểu dáng CSS cho sơ đồ mặt bằng Khu A, thanh Breadcrumb chuyển tầng và viewport 3D trong `smart_farm/static/src/css/dashboard.css`.

---

### Giai đoạn 2: Điều hướng Đa tầng giữa Bản đồ Vĩ mô và Sơ đồ Khu A (Multi-level Navigation Logic)
- [x] **T004**: Viết hàm Javascript `sfNavigateMapLevel(level, contextData)` trong `smart_farm/static/src/js/dashboard.js` để chuyển đổi mượt mà giữa các tầng (Macro $\leftrightarrow$ Zone A $\leftrightarrow$ 3D Greenhouse).
- [x] **T005**: Gắn sự kiện click vào Khu A trên bản đồ chính để kích hoạt chuyển sang sơ đồ mặt bằng Khu A, và gán sự kiện cho các nhà màng để vào không gian 3D.

---

### Giai đoạn 3: Xây dựng Không gian 3D Three.js cho Nhà màng (Procedural 3D Scene)
- [x] **T006**: Xây dựng module Three.js quản lý Scene, Camera phối cảnh, Renderer WebGL và OrbitControls với khả năng tự co giãn (Resize handler) trong `smart_farm/static/src/js/dashboard.js`.
- [x] **T007**: Dựng cấu trúc hình học 3D cho nhà màng công nghệ cao:
  - Khung vòm thép chịu lực và các tấm kính cường lực trong suốt phản chiếu ánh sáng.
  - Sàn bê tông kỹ thuật và các hàng luống giá thể trồng dưa lưới/cà chua với tán lá xanh và quả.
  - Đường ống tưới nhỏ giọt dẫn tới từng gốc cây.
- [x] **T008**: Thêm các đối tượng thiết bị IoT tương tác vào không gian 3D:
  - Cụm quạt thông gió đối lưu gắn tường với cánh quạt có thể xoay.
  - Hệ thống béc phun sương trần với Particle System hạt sương chuyển động.
  - Các cọc cảm biến môi trường IoT cắm tại luống đất có đèn LED tín hiệu phát sáng xung nhịp.

---

### Giai đoạn 4: Tương tác 2 chiều giữa Không gian 3D và Bảng điều khiển (Bidirectional Sync)
- [x] **T009**: Thiết lập Raycaster bắt sự kiện rê chuột (Hover) và nhấp chuột (Click) trên các vật thể 3D (Quạt, Béc phun sương, Cảm biến luống cây):
  - Khi click vào thiết bị $\rightarrow$ Highlight vật thể và mở Bảng điều khiển bên phải (`#sf-zone-drawer`), cuộn tới thiết bị tương ứng.
- [x] **T010**: Đồng bộ trạng thái từ Bảng điều khiển sang 3D:
  - Khi gạt công tắc Phun sương $\rightarrow$ Kích hoạt hoặc tắt hiệu ứng hạt sương trong 3D.
  - Khi gạt công tắc Quạt $\rightarrow$ Kích hoạt quay hoặc dừng cánh quạt 3D.
- [x] **T011**: Bổ sung bộ nút bấm chuyển nhanh góc nhìn camera ("Góc nhìn toàn cảnh", "Góc nhìn luống cây", "Góc nhìn trần thiết bị", "Bật/Tắt xoay tự động").

---

### Giai đoạn 5: Tối ưu hóa, Nâng cấp Module & Xác minh (Verification & Polish)
- [x] **T012**: Tối ưu hiệu năng render (RequestAnimationFrame loop chỉ chạy khi cần, giải phóng bộ nhớ khi rời tab Bản đồ).
- [x] **T013**: Nâng cấp module `smart_farm` trong container Odoo và khởi động lại dịch vụ web.
- [x] **T014**: Kiểm thử toàn diện trải nghiệm 3D trên trình duyệt: Chuyển tầng, xoay 360°, click vật thể 3D mở drawer, bật tắt công tắc kích hoạt hiệu ứng 3D.
- [x] **T015**: Ghi nhận toàn bộ thay đổi kỹ thuật vào `smart_farm/docs/UI/UI-Change.md` và `smart_farm/docs/CHANGED.md`.
