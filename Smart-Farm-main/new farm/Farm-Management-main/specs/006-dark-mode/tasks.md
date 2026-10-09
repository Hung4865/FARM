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

### Subtask 2: Đồng Bộ Toàn Bộ Chi Tiết Còn Lại (Cảm Biến Đất, Công Việc, Bản Đồ, Drawer & CHANGED.md)
*Mục tiêu nghiệm thu: Chuyển đổi qua lại giữa các tab (Công việc, Bản đồ), mở bảng cảm biến đất, checklist việc, Zone Drawer, Plant Drawer, menu chuông thông báo; tất cả đều hiển thị hoàn hảo ở Chế độ Tối, 0 lỗi tương phản và cập nhật tài liệu kỹ thuật.*

- [ ] **T005** `[frontend-developer]`
  1. Bổ sung CSS `body.sf-dark-mode` cho: Thẻ Cảm biến đất (thanh progress bar), Thẻ Công việc nông trại (checklist, icon checkbox), Thẻ Bản đồ định vị GPS, Menu Quả chuông (`.sf-notif-menu`), Bảng cài đặt Zone Drawer & Plant Drawer, Toast notification container.
  2. Cập nhật tài liệu kỹ thuật `smart_farm/docs/CHANGED.md` ghi nhận phiên bản mới của hệ thống.
- [ ] **T006** `[code-reviewer]` Soi git diff toàn bộ các file đã chỉnh sửa, đảm bảo không có bất kỳ thành phần nào bị "chìm" chữ (chữ tối trên nền tối hoặc ngược lại) và tài liệu được cập nhật đầy đủ.
- [ ] **T007** Lập trình viên nghiệm thu (F5 Odoo, kiểm tra tổng thể toàn bộ các tab và popup ở cả 2 chế độ Sáng & Tối), xác nhận 0 visual regression.
- [ ] **T008** Commit: `feat(smart_farm): subtask 2 - complete dark mode skinning for all tabs drawers and docs`
