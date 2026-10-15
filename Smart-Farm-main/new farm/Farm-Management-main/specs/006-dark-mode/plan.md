# Kế Hoạch Kỹ Thuật (Architecture & Technical Plan)
## Feature 006: Chế độ Giao diện Tối & Độ Tương Phản Cao (Dark Slate Theme & High-Contrast Mode)

**Input**: Đặc tả từ [`spec.md`](./spec.md)  
**Nhánh Git**: `Update-UI-v2`  
**Mục tiêu**: Xây dựng kiến trúc Dark Mode dạng class-scoped `html.sf-dark-mode, body.sf-dark-mode` với bảng màu chuẩn Sleek Slate, giải quyết triệt để mọi lỗi tương phản (chữ đen trên nền tối, nền trắng chữ trắng, nền trắng lạc quẻ), tích hợp Dark Scrollbars và đồng bộ Chart.js.

---

## 1. Thiết Kế Bảng Màu Sleek Slate (High-Contrast Dark Palette)

| Thành phần | Giao diện Sáng (Light Mode) | Giao diện Tối (Dark Slate) | Mục đích trực quan & Giải pháp |
| :--- | :--- | :--- | :--- |
| **Nền trang (`body`, `.sf-wrap`, `.sf-navbar-sticky`)** | `#eef2f6` | `#0f172a` (Deep Slate) | Giảm độ chói, tạo chiều sâu tối đa cho màn hình |
| **Navbar (`.sf-navbar`)** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155` | Thanh điều hướng nổi bật, hài hòa với nền |
| **Khối thẻ (`.sf-card`, `.sf-stat-card`, `.sf-map-card-pro`)** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155` | Nổi khối rõ nét, khắc phục hiện tượng bạc màu |
| **Chữ chính & Số liệu lớn (`.sf-temp`, `.sf-stat-val`)** | `#0f172a` | `#f8fafc` (Trắng sáng) | Tương phản cực cao, dễ nhìn từ khoảng cách xa |
| **Chữ phụ & Nhãn chú thích** | `#64748b` | `#94a3b8` (Xám bạc) | Rõ chữ nhưng dịu mắt, không gây mỏi thị giác |
| **Dữ liệu thời tiết (`.sf-weather-info span`)** | `#0f172a` | `#f8fafc` (Trắng sáng) | **Sửa lỗi**: Triệt tiêu chữ đen chìm trên nền tối |
| **Số liệu thanh an toàn (`.sf-asb-stats b`)** | `#0f172a` | `#f8fafc` (Trắng sáng) | **Sửa lỗi**: Triệt tiêu số đếm đen trên nền tối |
| **Dải 4 ô dự báo thời tiết (`.sf-fc-day`)** | `#f8fafc`, viền `#e2e8f0` | `#273549`, viền `#334155` | Rõ từng ô dự báo, hover sáng nhẹ lên `#334155` |
| **Hộp lời khuyên nông nghiệp (`.sf-weather-advice`)** | `#f0fdf4`, viền `#bbf7d0` | `#064e3b`, viền `#059669`, chữ `#6ee7b7` | Tông xanh ngọc sâu tinh tế, đọc rõ ràng |
| **Danh sách cảnh báo hàng chẵn (`.sf-alert-item`)** | Nền `#ffffff`, viền `#e2e8f0` | Nền `#1e293b`, viền `#334155` | **Sửa lỗi**: Chấm dứt hiện tượng nền trắng chữ trắng |
| **Danh sách cảnh báo hàng lẻ (`:nth-child(odd)`)** | Nền `#f8fafc`, viền `#cbd5e1` | Nền `#273549`, viền `#334155` | Phân cách mạch lạc giữa các dòng thông báo |
| **Cảnh báo đã giải quyết (`.sf-resolved`, `.sf-dash-resolved-tag`)**| `#94a3b8` gạch ngang | `#64748b` gạch ngang, tag `#94a3b8` | Dịu mắt, không lóa trên nền xám than |
| **Thanh cuộn trình duyệt (Custom Scrollbars)** | Trắng mặc định hệ điều hành | Track `#0f172a`, Thumb `#334155` | `color-scheme: dark` ngăn chặn scrollbar trắng chói |
| **Tab Quản lý Công việc (`.sf-task-mgmt-card`, `.sf-task-card`)** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155`, chữ `#f8fafc` | **Sửa lỗi**: Không còn card công việc trắng xóa |
| **Toolbar tìm kiếm & Filter pills** | `#f8fafc`, `#e2e8f0` | Nền `#0f172a` / `#1e293b`, viền `#334155` | Đồng bộ bộ lọc công việc theo chuẩn Dark Mode |
| **Tab Bản đồ (`.sf-map-toolbar`, `.sf-layer-btn`)** | `#f8fafc`, `#ffffff` | `#0f172a`, `#1e293b`, viền `#334155` | Thanh công cụ bản đồ dịu mắt |
| **Tab Nhân sự (`.sf-staff-kpi-card`, `.sf-staff-card`)** | `#f8fafc`, `#ffffff` | `#0f172a`, `#1e293b`, viền `#334155` | Toàn bộ thẻ nhân sự và thống kê KPI đồng bộ |
| **Hộp thoại Modal & Bảng trượt Drawer** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155`, header `#0f172a` | Popup thêm việc, chi tiết và cài đặt khoác áo tối |
| **Biểu đồ Môi trường 24h (`Chart.js`)** | Grid `#e2e8f0`, Text `#64748b` | Grid `rgba(51,65,85,0.6)`, Text `#94a3b8` | Lưới và trục tọa độ tự thích ứng theo theme |

---

## 2. Kiến Trúc Kỹ Thuật (Frontend & Storage)

### 2.1 Cơ chế chống giật/chớp trắng (Zero-FOUC Early Script)
- Đặt đoạn script nhỏ ngay trong `<head>` của `dashboard.xml`:
  ```javascript
  (function() {
      var saved = localStorage.getItem('sf_theme');
      if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('sf-dark-mode');
      }
  })();
  ```

### 2.2 Nút Toggle Theme trên Navbar
- Bổ sung nút bấm tròn thanh lịch ngay bên trái nút Quả chuông trên Navbar:
  ```xml
  <button type="button" class="sf-nav-btn sf-theme-toggle-btn" id="sf-theme-toggle" onclick="sfToggleTheme()" title="Chuyển chế độ Tối/Sáng">
      <span id="sf-theme-icon">🌙</span>
  </button>
  ```

### 2.3 Quản lý trạng thái bằng JavaScript (`dashboard.js`)
- Hàm `window.sfApplyChartTheme(chart)`: Đồng bộ màu sắc trục toạ độ $X, Y, Y_1$, đường lưới grid và nhãn legend của Chart.js theo class `sf-dark-mode`.
- Hàm `window.sfToggleTheme()`:
  - Toggle class `sf-dark-mode` trên `document.documentElement` và `document.body`.
  - Cập nhật icon và tooltip nút toggle.
  - Lưu `'dark'` hoặc `'light'` vào `localStorage.setItem('sf_theme', ...)`.
  - Tự động gọi `sfApplyChartTheme` cập nhật biểu đồ 24h tức thì.
  - Hiển thị Toast thông báo xác nhận trạng thái.
- Hàm `window.sfInitTheme()`:
  - Đồng bộ icon toggle và class trên body khi DOM hoàn tất nạp.
  - Khởi tạo màu Chart.js phù hợp theme ban đầu.

---

## 3. Phân Chia Subtask & Kế Hoạch Nghiệm Thu

* **Subtask 1: Nút Toggle Navbar, Khung Dark Mode Nền Tảng & Thẻ Quan Trắc Chính**
  - Nghiệm thu: Nút 🌙 trên Navbar, F5 nhớ trạng thái, nền `#0f172a`, card `#1e293b`.
* **Subtask 2: Đồng Bộ Chi Tiết, Sửa Lỗi Tương Phản & Toàn Bộ 5 Tab, Drawers, Modals**
  - Nghiệm thu:
    1. Thẻ Thời tiết: Gió, độ ẩm, vị trí trắng sáng (`#f8fafc`), không còn đen trên nền tối.
    2. Thẻ Cảnh báo: Loại bỏ hoàn toàn nền trắng chữ trắng, hiển thị xen kẽ `#1e293b` và `#273549`.
    3. Thanh cuộn: Custom scrollbar Slate `#334155` trên `#0f172a`.
    4. Tab Công việc: Toolbar, thẻ công việc, nút hành động khoác màu tối.
    5. Tab Bản đồ, Nhân sự, Modals, Drawers và Chart.js chuyển đổi đồng bộ 100%.
