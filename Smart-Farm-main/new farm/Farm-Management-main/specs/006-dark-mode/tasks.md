# Tasks: Chế độ Giao diện Tối & Độ Tương Phản Cao (Dark Slate Theme & High-Contrast Mode)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Ready for Implementation (Chờ hiệu lệnh bắt đầu triển khai code từ người dùng)

---

## Danh sách công việc theo chuẩn 4 bước (Tối ưu tính độc lập & Kiểm thử trực quan)

### Subtask 1: Nút Toggle Navbar, Khung Dark Mode Nền Tảng & Thẻ Quan Trắc Chính
*Mục tiêu nghiệm thu: F5 Odoo thấy ngay nút 🌙 trên Navbar bên cạnh quả chuông; bấm vào nút là toàn bộ màn hình Tổng quan chuyển sang Dark Slate chuẩn Ảnh 2 (nền tối #0f172a, card #1e293b, viền #334155, số liệu trắng sáng, thẻ Thời tiết Hà Nội & Cảnh báo sắc nét), bấm lại về Sáng và nhớ trạng thái khi F5.*

- [x] **T001** `[frontend-developer]` 
  1. Thêm nút `#sf-theme-toggle` trên thanh Navbar và chèn inline script chống FOUC trong `<head>` tại `smart_farm/views/dashboard.xml`.
  2. Viết các hàm `sfToggleTheme()` và `sfInitTheme()` trong `smart_farm/static/src/js/dashboard.js` xử lý chuyển đổi class `sf-dark-mode`, cập nhật icon `🌙`/`☀️`, lưu vào `localStorage` và bắn Toast feedback.
  3. Bổ sung bộ quy tắc CSS `body.sf-dark-mode` trong `smart_farm/static/src/css/dashboard.css` cho: Nền trang, Navbar, 4 thẻ thống kê trên cùng, Thẻ Thời tiết Hà Nội (dải dự báo 4 ngày, lời khuyên, nút làm mới), và Thẻ Cảnh báo & Log.
- [x] **T002** `[code-reviewer]` Soi git diff `dashboard.xml`, `dashboard.js` và `dashboard.css`, kiểm tra tính sạch sẽ của selector `sf-dark-mode`, màu sắc chuẩn Sleek Slate (Ảnh 2), không lỗi cú pháp JS và cơ chế chống FOUC.
- [x] **T003** Lập trình viên nghiệm thu (F5 Odoo, bấm nút 🌙/☀️ trên Navbar), xác nhận giao diện chuyển đổi tức thời sang tông Dark Slate, card nổi rõ viền, các số liệu trắng sáng rõ nét, không bị nhấp nháy khi F5.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - dark slate theme toggle and core dashboard styling`

---

### Subtask 2: Đồng Bộ Toàn Bộ Chi Tiết Còn Lại & Sửa Lỗi Tương Phản (Thời Tiết, Cảnh Báo, Công Việc, Bản Đồ, Nhân Sự, Modals, Drawers, Scrollbars, Chart.js & Docs)
*Mục tiêu nghiệm thu: Chuyển đổi qua lại giữa các tab (Công việc, Bản đồ, Nhân sự), kiểm tra các lỗi tương phản (chữ đen trên nền tối, nền trắng chữ trắng, nền trắng trên dark mode, scrollbar trắng), xác nhận 0 visual regression và cập nhật đầy đủ tài liệu.*

- [x] **T005** `[frontend-developer]`
  1. **Khắc phục lỗi chữ đen trên nền tối**:
     - Bổ sung `html.sf-dark-mode .sf-weather-info span` $\rightarrow$ màu trắng sáng `#f8fafc !important` (gió, độ ẩm, vị trí TP. Hà Nội).
     - Bổ sung `html.sf-dark-mode .sf-asb-stats b` $\rightarrow$ số liệu thanh an toàn màu trắng sáng `#f8fafc !important`.
  2. **Khắc phục lỗi nền trắng chữ trắng**:
     - Sửa quy tắc CSS cho `.sf-alert-item`: Hàng chẵn mang nền `#1e293b !important` (thay vì kế thừa nền trắng `#ffffff`), hàng lẻ mang nền `#273549 !important`, hover `#334155 !important`.
     - Cảnh báo đã hoàn thành (`.sf-resolved`) mang màu xám `#64748b` gạch ngang, tag `Đã xong` mang màu `#94a3b8 !important`.
  3. **Khắc phục lỗi nền trắng lạc quẻ & Scrollbar trắng**:
     - Bổ sung `color-scheme: dark` và custom scrollbar Slate (`#0f172a` track / `#334155` thumb) trên toàn bộ dark mode.
     - Đồng bộ Tab Công việc (`tab-tasks`): Toolbar `#0f172a`, search input `#1e293b`, filter pills, dropdown select, task cards `#1e293b`, nút hành động.
     - Đồng bộ Tab Bản đồ (`tab-map`): Toolbar `#0f172a`, layer buttons `#1e293b`.
     - Đồng bộ Tab Nhân sự (`tab-staff`): Hero header, 3 thẻ KPI `#0f172a`, filter pills, staff cards `#1e293b`.
     - Đồng bộ Modals & Drawers: Modal card `#1e293b`, headers `#0f172a`, inputs `#0f172a`, Zone/Plant Drawers.
  4. **Tương thích Biểu đồ Môi trường 24h (`Chart.js`)**:
     - Viết hàm `window.sfApplyChartTheme(chart)` tự động đổi màu trục toạ độ và đường lưới khi toggle theme.
  5. **Phá vỡ Cache Trình duyệt (Cache Busting v=205) & Inline Critical Dark Mode CSS**:
     - Bumping `dashboard.css?v=205` và `dashboard.js?v=205` trong `views/dashboard.xml`.
     - Chèn khối CSS Dark Mode trọng yếu trực tiếp trong `<style>` của template QWeb để đảm bảo tải lại trang là có hiệu lực ngay lập tức.
  6. Cập nhật tài liệu kỹ thuật `smart_farm/docs/CHANGED.md` và `smart_farm/docs/UI/UI-Change.md`.
- [x] **T006** `[code-reviewer]` Soi git diff toàn bộ `dashboard.css`, `dashboard.js`, `dashboard.xml`, xác nhận 100% selector nhất quán, không còn bất kỳ chữ hay nền nào bị lem màu hoặc lỗi tương phản.
- [x] **T007** Lập trình viên nghiệm thu: Kiểm tra chi tiết 5 tab và tất cả popup ở cả 2 chế độ Sáng & Tối, xác nhận chuyển đổi trơn tru, không có visual regression.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - complete dark mode skinning, contrast bug fixes, chart sync and docs update`
