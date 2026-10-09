# Tasks: Mô hình 3D Digital Twin Nhà màng Nông nghiệp Công nghệ cao (3D Digital Twin High-Tech Greenhouse)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Completed (Đã hoàn thành 100%)

---

## Danh sách công việc theo chuẩn 4 bước (Task Checklist)

### Subtask 1: Thư viện 3D & Cấu trúc HTML Bản đồ Đa tầng (3D Library & Multi-level DOM)
- [x] **T001** `[odoo-frontend-styler]` Nhúng Three.js (r128) và OrbitControls, tạo cấu trúc HTML phân tầng (`#sf-map-level-macro`, `#sf-map-level-zone-a`, `#sf-map-level-greenhouse-3d`) trong `smart_farm/views/dashboard.xml`, và định nghĩa CSS breadcrumb/viewport trong `dashboard.css`.
- [x] **T002** `[odoo-code-reviewer]` Soi diff QWeb và CSS, kiểm tra tính toàn vẹn của thẻ script CDN, cấu trúc vùng chứa viewport và tính responsive.
- [x] **T003** Lập trình viên nghiệm thu (F5 Odoo, kiểm tra tab Bản đồ), xác nhận thư viện Three.js nạp thành công và layout khung nhìn sẵn sàng.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - integrate threejs and multi-level map dom structure`

---

### Subtask 2: Logic Điều hướng Đa tầng Mượt mà (Multi-level Navigation Logic)
- [x] **T005** `[odoo-frontend-styler]` Xây dựng hàm `sfNavigateMapLevel(level, contextData)` trong `smart_farm/static/src/js/dashboard.js`, gán sự kiện click vào Khu A trên bản đồ vĩ mô để chuyển sang sơ đồ mặt bằng và vào nhà màng 3D.
- [x] **T006** `[odoo-code-reviewer]` Soi diff JavaScript, kiểm tra logic xử lý breadcrumb, ẩn/hiện display flex/none giữa các tầng không bị giật lag.
- [x] **T007** Lập trình viên nghiệm thu (click vào Khu A $\rightarrow$ sơ đồ mặt bằng $\rightarrow$ nhà màng 3D $\rightarrow$ bấm breadcrumb quay lại), xác nhận luồng điều hướng mượt mà.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - multi-level navigation and breadcrumb flow`

---

### Subtask 3: Không gian 3D Nhà màng Công nghệ cao (Three.js Scene & 3D Models)
- [x] **T009** `[odoo-frontend-styler]` Dựng không gian 3D Three.js trong `dashboard.js`: Scene, PerspectiveCamera, WebGLRenderer, OrbitControls, khung vòm thép, kính trong suốt, các luống dưa lưới/cà chua, hệ thống ống tưới nhỏ giọt, quạt đối lưu, béc phun sương và cọc cảm biến IoT.
- [x] **T010** `[odoo-code-reviewer]` Soi diff Three.js logic, kiểm tra mesh geometry, material ánh sáng, resize event handler và không bị memory leak.
- [x] **T011** Lập trình viên nghiệm thu (mở khung nhìn 3D), xác nhận mô hình nhà màng render sắc nét, ánh sáng tự nhiên và xoay camera 360 độ mượt mà.
- [x] **T012** Commit: `feat(smart_farm): subtask 3 - procedural 3d greenhouse scene, plants and iot fixtures`

---

### Subtask 4: Tương tác 2 chiều 3D và Bảng Điều khiển IoT (Raycaster & Bidirectional Sync)
- [x] **T013** `[odoo-fullstack-dev]` Tích hợp Raycaster bắt hover/click trên vật thể 3D mở Drawer bên phải; đồng bộ trạng thái công tắc IoT (bật quạt $\rightarrow$ quay cánh quạt 3D, bật phun sương $\rightarrow$ kích hoạt hạt sương bay); thêm cụm nút chuyển nhanh góc nhìn camera trong `dashboard.js`.
- [x] **T014** `[odoo-code-reviewer]` Soi diff, kiểm tra raycasting intersect logic, animation loop cập nhật cánh quạt và particle system.
- [x] **T015** Lập trình viên nghiệm thu (click vào quạt trong 3D $\rightarrow$ mở drawer, bật công tắc quạt $\rightarrow$ cánh quạt 3D quay), xác nhận đồng bộ 2 chiều hoàn hảo.
- [x] **T016** Commit: `feat(smart_farm): subtask 4 - bidirectional raycasting interaction and device animation sync`

---

### Subtask 5: Tối ưu Render Loop & Kiểm thử Toàn diện (Performance Polish & Verification)
- [x] **T017** `[odoo-fullstack-dev]` Tối ưu RequestAnimationFrame (tạm dừng khi rời tab Bản đồ), giải phóng bộ nhớ WebGL; cập nhật hồ sơ kỹ thuật vào `smart_farm/docs/UI/UI-Change.md` và `smart_farm/docs/CHANGED.md`.
- [x] **T018** `[odoo-code-reviewer]` Soi diff toàn bộ, kiểm tra hiệu năng CPU/GPU, dọn dẹp biến thừa và đối chiếu tài liệu kỹ thuật.
- [x] **T019** Lập trình viên nghiệm thu (F5 Odoo, test toàn diện 3D và chuyển qua lại các tab khác), xác nhận 0 visual regression và FPS ổn định 60fps.
- [x] **T020** Commit: `perf(smart_farm): subtask 5 - optimize render loop, memory management and docs update`
