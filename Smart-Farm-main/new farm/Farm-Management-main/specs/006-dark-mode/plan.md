# Kế Hoạch Kỹ Thuật (Architecture & Technical Plan)
## Feature 006: Chế độ Giao diện Tối & Độ Tương Phản Cao (Dark Slate Theme & High-Contrast Mode)

**Input**: Đặc tả từ [`spec.md`](./spec.md)  
**Nhánh Git**: `Update-UI`  
**Mục tiêu**: Xây dựng kiến trúc Dark Mode dạng class-scoped `body.sf-dark-mode` với bảng màu chuẩn Sleek Slate (Ảnh 2), nút chuyển đổi 🌙 / ☀️ tức thời trên Navbar và cơ chế nạp sớm chống chớp trắng (FOUC).

---

## 1. Thiết Kế Bảng Màu Sleek Slate (High-Contrast Dark Palette)

| Thành phần | Giao diện Sáng (Hiện tại) | Giao diện Tối (Ảnh 2) | Mục đích trực quan |
| :--- | :--- | :--- | :--- |
| **Nền trang (`body`, `.sf-wrap`, `.sf-navbar-sticky`)** | `#eef2f6` | `#0f172a` (Deep Slate) | Giảm độ chói, tạo chiều sâu tối đa cho màn hình |
| **Navbar (`.sf-navbar`)** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155` | Thanh điều hướng nổi bật, hài hòa với nền |
| **Khối thẻ (`.sf-card`, `.sf-stat-card`, `.sf-map-card-pro`)** | `#ffffff`, viền `#cbd5e1` | `#1e293b`, viền `#334155` | Nổi khối rõ nét, khắc phục hiện tượng bạc màu |
| **Chữ chính & Số liệu lớn (`.sf-temp`, `.sf-stat-val`)** | `#0f172a` | `#f8fafc` (Trắng sáng) | Tương phản cực cao, dễ nhìn từ khoảng cách xa |
| **Chữ phụ & Nhãn chú thích** | `#64748b` | `#94a3b8` (Xám bạc) | Rõ chữ nhưng dịu mắt, không gây mỏi thị giác |
| **Dải 4 ô dự báo thời tiết (`.sf-fc-day`)** | `#f8fafc`, viền `#e2e8f0` | `#334155`, viền `#475569` | Rõ từng ô dự báo, hover sáng nhẹ lên `#3f4f66` |
| **Hộp lời khuyên nông nghiệp (`.sf-weather-advice`)** | `#f0fdf4`, viền `#bbf7d0` | `#064e3b`, viền `#059669`, chữ `#6ee7b7` | Tông xanh ngọc sâu tinh tế, đọc rõ ràng |
| **Nút làm mới thời tiết (`.sf-btn-refresh-weather`)** | `#f8fafc`, viền `#cbd5e1` | `#334155`, viền `#475569`, chữ `#e2e8f0` | Đậm chất công nghệ, ăn khớp toàn thẻ |
| **Danh sách cảnh báo (`.sf-alert-item`)** | Nền `#f8fafc`, viền `#e2e8f0` | Nền `#273549`, viền `#334155` | Phân cách mạch lạc, không bị chìm |
| **Bảng trượt (Drawer) & Menu Chuông** | `#ffffff`, viền `#e2e8f0` | `#1e293b`, viền `#334155` | Đồng bộ toàn diện hệ thống điều khiển |

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
- Script chạy đồng bộ trước khi trình duyệt vẽ (paint) bất kỳ thẻ HTML nào, triệt tiêu 100% hiện tượng chớp màn hình trắng khi người dùng F5.

### 2.2 Nút Toggle Theme trên Navbar
- Bổ sung nút bấm tròn thanh lịch ngay bên trái nút Quả chuông trên Navbar:
  ```xml
  <button type="button" class="sf-nav-btn sf-theme-toggle-btn" id="sf-theme-toggle" onclick="sfToggleTheme()" title="Chuyển chế độ Tối/Sáng">
      <span id="sf-theme-icon">🌙</span>
  </button>
  ```
- Hiệu ứng hover nổi bật, chuyển icon mượt mà giữa `🌙` (khi đang ở giao diện Sáng) và `☀️` (khi đang ở giao diện Tối).

### 2.3 Quản lý trạng thái bằng JavaScript (`dashboard.js`)
- Hàm `window.sfToggleTheme()`:
  - Toggle class `sf-dark-mode` trên `document.documentElement` và `document.body`.
  - Cập nhật icon và tooltip nút toggle.
  - Lưu `'dark'` hoặc `'light'` vào `localStorage.setItem('sf_theme', ...)`.
  - Hiển thị Toast thông báo nhanh (2.5s) xác nhận trạng thái giao diện.
- Hàm `window.sfApplyThemeOnLoad()`:
  - Đồng bộ icon toggle và class trên body khi DOM hoàn tất nạp.

---

## 3. Phân Chia Subtask & Kế Hoạch Nghiệm Thu (Độc Lập & Kiểm Thử Trực Quan)

Để tránh tình trạng phụ thuộc chéo và đảm bảo mỗi subtask đều có thể nghiệm thu trực quan ngay sau khi xong:

* **Subtask 1: Nút Toggle Navbar, Khung Dark Mode Nền Tảng & Thẻ Quan Trắc Chính (Overview & Thẻ Thời Tiết Hà Nội, Cảnh Báo, Thống Kê)**
  - *Kết quả nghiệm thu*: Bấm nút 🌙 là toàn bộ màn hình Dashboard chính (Tổng quan) chuyển sang Dark Slate chuẩn Ảnh 2, các card nổi khối rõ rệt, F5 giữ nguyên trạng thái.
* **Subtask 2: Hoàn Thiện Đồng Bộ Toàn Bộ Chi Tiết (Cảm Biến Đất, Checklist Công Việc, Bản Đồ, Drawer & CHANGED.md)**
  - *Kết quả nghiệm thu*: Kiểm tra các tab Công việc, Bản đồ, bảng cảm biến đất, bảng cài đặt luống cây/phân khu (Drawer) và menu thông báo chuông đều khoác lớp áo Dark Slate hoàn hảo, 0 visual regression.
