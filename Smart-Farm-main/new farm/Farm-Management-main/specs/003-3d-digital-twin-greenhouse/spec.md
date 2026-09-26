# Feature Specification: Mô hình 3D Digital Twin Nhà màng Nông nghiệp Công nghệ cao (3D Digital Twin High-Tech Greenhouse)

**Feature**: `003-3d-digital-twin-greenhouse`  
**Created**: 2026-09-26  
**Status**: Ready for Implementation  
**Input**: Khi người dùng tương tác trên bản đồ nông trại (`#tab-map`), bổ sung trải nghiệm bản đồ đa tầng (Multi-level navigation): Click vào Khu A (High-tech Glass Greenhouses) sẽ mở sơ đồ mặt bằng chi tiết của toàn bộ phân khu (gồm 12 nhà màng, bể nước, pin mặt trời, luống cây ngoài trời). Khi click vào một nhà kính cụ thể (ví dụ Nhà màng 1 - GH-01), khu vực bản đồ trung tâm sẽ chuyển đổi thành không gian 3D tương tác sống động (Three.js WebGL) cho phép tham quan bên trong nhà kính (cấu trúc khung thép kính, luống cây trồng công nghệ cao, cảm biến IoT, hệ thống béc phun sương trần, quạt đối lưu, van tưới nhỏ giọt), hỗ trợ xoay 360 độ và tương tác 2 chiều với bảng điều khiển thông số vi khí hậu & thiết bị IoT ở thanh bên phải.

---

## 1. Mục tiêu & Giá trị (Objective & Value)

1. **Trải nghiệm Bản đồ Đa tầng (Multi-level Navigation):**
   * Cho phép quản lý chuyển đổi mượt mà giữa 3 cấp độ:
     * Cấp 1: Toàn cảnh nông trại (Macro Farm View - Khu A, B, C).
     * Cấp 2: Mặt bằng phân khu chi tiết (Zone Layout Sub-map - Lưới 12 nhà màng Khu A).
     * Cấp 3: Tham quan không gian 3D Digital Twin bên trong từng nhà màng (Greenhouse Interior 3D View).
2. **Mô phỏng 3D Digital Twin chân thực (Interactive 3D Walkthrough):**
   * Người dùng có thể quan sát trực quan vị trí bố trí cây trồng (dưa lưới, cà chua thủy canh), đường ống tưới và hệ thống cảm biến môi trường.
   * Xoay góc nhìn 360°, phóng to/thu nhỏ (Zoom), chuyển đổi nhanh các góc camera định sẵn (Toàn cảnh / Luống cây / Thiết bị trần).
3. **Tương tác 2 chiều thời gian thực (Bidirectional 3D & IoT Control Sync):**
   * Click vào thiết bị trong không gian 3D (Quạt thông gió, Béc phun sương, Van tưới) $\rightarrow$ Highlight và cuộn đến thiết bị tương ứng ở bảng điều khiển bên phải.
   * Gạt công tắc bật/tắt thiết bị bên phải $\rightarrow$ Không gian 3D phản hồi hiệu ứng tức thời (Phun sương hạt nước chuyển động, cánh quạt quay, đèn LED cảm biến nhấp nháy).

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 - Khám phá Phân khu Zone A chi tiết (Priority: P1)
* **Là người quản lý**, khi bấm vào Phân khu A trên bản đồ tổng quan, tôi muốn xem sơ đồ mặt bằng cụm 12 nhà màng và các công trình phụ trợ, có thanh điều hướng quay lại bản đồ tổng quan.
* **Acceptance Criteria**:
  1. Click vào "Khu A - Nhà màng" trên bản đồ chính $\rightarrow$ Chuyển cảnh mượt mà sang sơ đồ chi tiết Zone A với lưới 12 nhà kính (GH-01 đến GH-12), pin năng lượng, hồ dinh dưỡng.
  2. Nút breadcrumb/quay lại `← Quay lại bản đồ tổng thể` hiển thị rõ ràng và bấm vào sẽ trở về bản đồ toàn trang trại.
  3. Mỗi nhà màng trên sơ đồ hiển thị mã định danh, tình trạng vi khí hậu tóm tắt (Nhiệt độ, Độ ẩm) khi hover.

### User Story 2 - Không gian 3D Digital Twin khi chọn Nhà màng (Priority: P1)
* **Là nhân viên vận hành kỹ thuật**, khi nhấp chọn Nhà màng GH-01, tôi muốn khu vực trung tâm mở ra mô hình 3D bên trong nhà kính, cho phép xoay 360 độ và kiểm tra cấu trúc cây cối, thiết bị.
* **Acceptance Criteria**:
  1. Click vào Nhà màng GH-01 $\rightarrow$ Khởi tạo và hiển thị khung nhìn 3D WebGL (Three.js) mượt mà ở tốc độ 60 FPS.
  2. Khung cảnh 3D bao gồm:
     * Khung nhà màng vòm thép công nghệ cao với vách kính mờ phản chiếu ánh sáng.
     * Các luống cây trồng sinh trưởng xanh tốt, chia hàng lối khoa học.
     * Cụm thiết bị IoT: Quạt thông gió đối lưu trên vách, dàn béc phun sương trên xà trần, đường ống tưới nhỏ giọt chạy dọc gốc cây, các cọc cảm biến đất có đèn LED tín hiệu.
  3. Điều khiển trực quan: Kéo chuột trái để xoay góc nhìn 360°, cuộn chuột để zoom gần/xa, kéo chuột phải để tịnh tiến góc nhìn (Pan).
  4. Cung cấp bộ nút chuyển nhanh góc nhìn camera: "Toàn cảnh", "Luống cây", "Hệ thống trần".

### User Story 3 - Tương tác 2 chiều giữa 3D và Bảng điều khiển (Priority: P1)
* **Là người vận hành**, tôi muốn các thao tác bật/tắt thiết bị ở bảng điều khiển bên phải làm thay đổi trạng thái trực quan trong không gian 3D, và ngược lại.
* **Acceptance Criteria**:
  1. Khi người dùng click vào một vật thể 3D (ví dụ Quạt thông gió hoặc Dàn phun sương) $\rightarrow$ Vật thể sáng viền nổi bật (Outline glow) và bảng bên phải tự động mở/focus vào công tắc thiết bị đó.
  2. Khi người dùng gạt công tắc "Hệ thống phun sương làm mát" sang trạng thái BẬT $\rightarrow$ Không gian 3D kích hoạt hiệu ứng sương mù hạt nước li ti (`Particle System`) bay lơ lửng dưới mái vòm.
  3. Khi gạt công tắc "Quạt thông gió đối lưu" sang trạng thái BẬT $\rightarrow$ Cánh quạt 3D quay tít liên tục; khi TẮT thì quạt dừng quay.
  4. Khi gạt công tắc "Mái che tự động" $\rightarrow$ Lưới che nắng phía trên trần kính mở ra hoặc đóng lại tương ứng.

---

## 3. Yêu cầu Phi chức năng & Hiệu năng (Non-Functional Requirements)

1. **Hiệu năng & Tối ưu hóa:**
   * Sử dụng Procedural 3D Geometry tối ưu hóa, số lượng polygons < 30,000 tris để đảm bảo chạy mượt trên mọi máy tính và không giật lag.
   * Render loop tự động tối ưu hóa (chỉ render liên tục khi có chuyển động/animation, dừng khi tab bị ẩn).
2. **Khả năng tương thích:**
   * Chạy trực tiếp trên nền tảng Odoo 16/17 QWeb Dashboard, không yêu cầu cài đặt backend plugin hay phần mềm ngoài.
   * Tự động điều chỉnh kích thước theo khung hình (Responsive Canvas Resize).
3. **Cơ chế Fallback an toàn:**
   * Nếu trình duyệt người dùng tắt WebGL, hiển thị thông báo thân thiện kèm sơ đồ 2.5D tĩnh dự phòng.
