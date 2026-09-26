# Implementation Plan: Mô hình 3D Digital Twin Nhà màng Nông nghiệp Công nghệ cao (3D Digital Twin High-Tech Greenhouse)

**Feature**: `003-3d-digital-twin-greenhouse` | **Spec**: [`spec.md`](./spec.md)  
**Status**: Ready for Execution

---

## 1. Kiến trúc Kỹ thuật (Technical Architecture)

### 1.1 Thư viện Đồ họa 3D (3D Graphics Stack)
* **Thư viện chính**: Three.js (r128) + OrbitControls.
* **Cơ chế nạp**: Tích hợp CDN ổn định cao với fallback nạp file local hoặc khởi tạo script động an toàn trong `dashboard.xml`.
* **Kỹ thuật dựng hình 3D (Procedural Modeling)**:
  * Không phụ thuộc vào file model `.glb` nặng từ bên ngoài, toàn bộ không gian nhà màng được sinh động bằng Procedural Primitives của Three.js:
    * Khung dầm vòm kính: `TubeGeometry` / `CylinderGeometry` phủ vật liệu kim loại nhôm bạc (`MeshStandardMaterial`).
    * Kính vòm nhà màng: `BoxGeometry` / `PlaneGeometry` với `opacity: 0.35`, `transparent: true`, độ phản chiếu nhẹ.
    * Luống cây trồng: Luống đất luống composite, các khóm cây xanh (dưa lưới / cà chua) dựng bằng cụm khối tán lá và quả sinh động.
    * Hệ thống béc phun sương: `Points` Particle System phát hạt nước màu trắng xanh rơi/phun nhẹ nhàng dưới trần.
    * Quạt thông gió: Khung trụ tròn gắn cánh quạt có animation xoay trục liên tục khi bật.
    * Cảm biến IoT: Trụ cắm gắn đầu đọc cảm biến có đèn LED phát sáng xung nhịp (`PointLight` + Glowing material).

### 1.2 Cấu trúc Giao diện Đa tầng trong Tab Bản đồ (`#tab-map`)
* **Tầng 1: `#sf-map-level-macro` (Bản đồ vĩ mô toàn farm hiện tại):**
  * Hiển thị toàn cảnh Zone A, Zone B, Zone C.
  * Khi click Zone A $\rightarrow$ Kích hoạt chuyển cảnh sang Tầng 2.
* **Tầng 2: `#sf-map-level-zone-a` (Sơ đồ mặt bằng chi tiết Khu A):**
  * Thanh breadcrumb điều hướng: `← Quay lại Bản đồ Tổng thể` | `Khu A: High-Tech Glass Greenhouses`.
  * Grid sơ đồ mặt bằng hiển thị 12 nhà kính (GH-01 đến GH-12), pin năng lượng mặt trời, hồ chứa dinh dưỡng và các luống rau ngoài trời.
  * Mỗi nhà kính là một thẻ tương tác với badge nhiệt độ/độ ẩm, click vào Nhà 1 (GH-01) $\rightarrow$ Kích hoạt Tầng 3.
* **Tầng 3: `#sf-map-level-greenhouse-3d` (Không gian tham quan 3D Digital Twin):**
  * Thanh điều khiển 3D trên đỉnh: Nút quay lại sơ đồ Khu A, các nút chọn góc camera (`Toàn cảnh`, `Luống cây`, `Thiết bị trần`), nút bật/tắt xoay tự động (Auto-Rotate).
  * Canvas WebGL Three.js chiếm toàn bộ vùng trung tâm (`#sf-greenhouse-3d-canvas`).
  * Đồng bộ với Bảng điều khiển Drawer bên phải (`#sf-zone-drawer`):
    * Khi click vào thiết bị 3D trong canvas (bằng `Raycaster`), Drawer mở ra và highlight thiết bị tương ứng.
    * Khi bấm nút bật/tắt thiết bị trên Drawer, mô hình 3D cập nhật hiệu ứng (phun sương, quạt quay) lập tức.

### 1.3 Backend & APIs
* Mở rộng API `POST /smart_farm/api/zone/control` hoặc cung cấp endpoint nhận diện trạng thái thiết bị của từng nhà màng (ví dụ `GH-01`).
* Truyền danh sách thông số của từng nhà màng (GH-01 đến GH-12) vào dashboard context.

---

## 2. Kế hoạch Kiểm thử & Xác minh (Verification Plan)

1. **Kiểm tra Điều hướng Đa tầng:**
   * Từ Bản đồ chính $\rightarrow$ Click Khu A $\rightarrow$ Hiện sơ đồ chi tiết 12 nhà màng.
   * Từ sơ đồ Khu A $\rightarrow$ Click `← Quay lại` $\rightarrow$ Trở về Bản đồ chính.
2. **Kiểm tra Khởi tạo & Tương tác 3D:**
   * Từ sơ đồ Khu A $\rightarrow$ Click Nhà màng GH-01 $\rightarrow$ Canvas 3D Three.js khởi tạo mượt mà, khung nhà kính, luống cây và thiết bị hiển thị sắc nét.
   * Dùng chuột xoay 360°, cuộn zoom, chuyển đổi các góc nhìn camera hoạt động trơn tru.
3. **Kiểm tra Tương tác 2 chiều (3D $\leftrightarrow$ Bảng điều khiển):**
   * Click vào Quạt thông gió trong 3D $\rightarrow$ Drawer bên phải mở ra và nhấp nháy dòng điều khiển quạt.
   * Bật công tắc Phun sương ở Drawer $\rightarrow$ Xuất hiện hiệu ứng hạt sương mù chuyển động trong 3D.
   * Bật công tắc Quạt $\rightarrow$ Cánh quạt 3D quay liên tục.
4. **Kiểm tra Tương thích & Hiệu năng:**
   * Đảm bảo khung hình đạt 60 FPS, không gây giật lag hoặc rò rỉ bộ nhớ (dispose animation frame khi chuyển tab).
