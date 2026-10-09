# Tasks: Nâng Cấp Widget GPS & Vị Trí Trực Quan (Interactive GPS Mini-Map & Seed Data)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Ready for Implementation (Chờ hiệu lệnh bắt đầu triển khai code từ người dùng)

---

## Danh Sách Công Việc Theo Chuẩn 4 Bước Bắt Buộc

### Subtask 1: Tự Động Khởi Tạo Dữ Liệu GPS & Khung Bản Đồ Mini Sinh Động
*Mục tiêu nghiệm thu: F5 Odoo thấy ngay thẻ thống kê "BẢN GHI GPS" nhảy lên số 4; widget "GPS & Vị trí" không còn ô trắng "Chưa có dữ liệu GPS" mà hiển thị bản đồ nông trại thu nhỏ với các điểm ghim phương tiện (Máy kéo Kubota, Xe tuần tra, Drone, Trạm IoT) kèm hiệu ứng radar ping.*

- [x] **T001** `[frontend-developer & backend-developer]`
  1. Thêm logic auto-seed dữ liệu mẫu trong `smart_farm/controllers/main.py`: khi `smart.farm.gps` có 0 bản ghi thì tự động tạo 4 bản ghi thiết bị thực tế (Máy kéo, Xe tuần tra, Drone, Trạm IoT).
  2. Nâng cấp cấu trúc XML thẻ "GPS & Vị trí" trong `smart_farm/views/dashboard.xml`: thay ô tĩnh bằng Bản đồ Mini `.sf-mini-map` thể hiện phân khu, các điểm ghim phương tiện `.sf-mini-pin`, tooltip thông tin và danh sách thiết bị chi tiết.
- [x] **T002** `[code-reviewer]` Soi git diff `main.py` và `dashboard.xml`, kiểm tra tính an toàn của lệnh tạo dữ liệu Odoo, cú pháp QWeb template và độ chính xác của các điểm ghim.
- [ ] **T003** Lập trình viên nghiệm thu (F5 Odoo trên trình duyệt), xác nhận: thẻ BẢN GHI GPS = 4, bản đồ mini hiển thị các điểm định vị, danh sách 4 thiết bị hiển thị đầy đủ tọa độ.
- [ ] **T004** Commit: `feat(smart_farm): subtask 1 - gps auto-seed data and interactive mini map widget`

---

### Subtask 2: Hiệu Ứng Radar Ping, Tương Thích Dark Slate, Chuyển Tab & Tài Liệu
*Mục tiêu nghiệm thu: Bản đồ mini có hiệu ứng radar ping tỏa tròn bắt mắt; hiển thị hoàn hảo ở cả 2 chế độ Sáng và Dark Slate (0 lỗi chói lóa); nút "Xem bản đồ toàn cảnh →" chuyển ngay sang tab Bản đồ lớn; cập nhật đầy đủ tài liệu CHANGED.md.*

- [ ] **T005** `[frontend-developer]`
  1. Bổ sung CSS trong `smart_farm/static/src/css/dashboard.css`: hiệu ứng sóng tỏa tròn `@keyframes sfRadarPulse`, style phân khu bản đồ mini, tooltip hover, và đồng bộ trọn vẹn cả 2 chế độ Light Mode & Dark Slate Mode.
  2. Thêm nút tác vụ chân thẻ "Xem bản đồ toàn cảnh →" kích hoạt chuyển nhanh sang tab Bản đồ (`#tab-map`).
  3. Cập nhật tài liệu kỹ thuật `smart_farm/docs/CHANGED.md` ghi nhận tính năng GPS Mini-Map.
- [ ] **T006** `[code-reviewer]` Soi git diff `dashboard.css` và `CHANGED.md`, kiểm tra độ tương phản màu sắc cả 2 theme, không giật lag animation.
- [ ] **T007** Lập trình viên nghiệm thu (F5 Odoo, thử bấm chuyển Dark/Light mode, bấm "Xem bản đồ toàn cảnh →" chuyển tab), xác nhận trải nghiệm mượt mà và thẩm mỹ cao cấp.
- [ ] **T008** Commit: `feat(smart_farm): subtask 2 - gps widget dark slate polish navigation and docs`
