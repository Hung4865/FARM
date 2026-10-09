# Tasks: Hệ thống Giám sát & Dự báo Thời tiết Nông nghiệp Thông minh tại Hà Nội

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Ready for Implementation (Chờ hiệu lệnh bắt đầu triển khai code)

---

## Danh sách công việc theo chuẩn 4 bước (Tối ưu tính độc lập & Kiểm thử trực quan)

### Subtask 1: Hiển thị Dữ liệu Thực tế Thời tiết Hà Nội & Dự báo 4 Ngày Động (Full-stack Data & Render)
*Mục tiêu nghiệm thu: F5 Odoo thấy ngay thẻ Thời tiết chuyển sang "TP. Hà Nội", nhiệt độ/gió/ẩm thực tế từ Open-Meteo, icon thời tiết sinh động, 4 ngày dự báo động (không còn fix cứng 29°, 28°, 30°) và lời khuyên nông nghiệp.*
- [x] **T001** `[odoo-backend-developer]` Cập nhật model `smart.farm.weather` tại `smart_farm/models/weather.py` (tọa độ Hà Nội `21.0285, 105.8542`, địa danh 'TP. Hà Nội', thêm `weather_code`); nâng cấp hàm `dashboard` trong `smart_farm/controllers/main.py` lấy dữ liệu thực tế tại Hà Nội và `daily forecast` 4 ngày, mapping WMO code sang icon (☀️, ⛅, 🌧️,...) và sinh `agri_advice`; cập nhật `smart_farm/views/dashboard.xml` và `dashboard.css` hiển thị thẻ Thời tiết Hà Nội với icon động, dải 4 ngày dự báo thực tế và lời khuyên nông nghiệp.
- [x] **T002** `[odoo-code-reviewer]` Soi diff `weather.py`, `main.py`, `dashboard.xml` và `dashboard.css`, kiểm tra logic mapping WMO code, vòng lặp QWeb dự báo, tọa độ Hà Nội và xác nhận không còn giá trị fix cứng 29°, 28°, 30°.
- [x] **T003** Lập trình viên nghiệm thu (F5 Odoo), xác nhận thẻ Thời tiết đổi sang "TP. Hà Nội", số liệu thực tế, icon hiển thị chuẩn, 4 ô dự báo động và lời khuyên nông vụ rõ ràng.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - real-time hanoi weather display and dynamic 4-day forecast`

---

### Subtask 2: Nút Làm mới Dữ liệu 1-Chạm & Toast Feedback (AJAX API & UI Interaction)
*Mục tiêu nghiệm thu: Bấm nút 🔄 trên thẻ thời tiết thấy icon xoay, số liệu cập nhật tức thời không cần reload trang và Toast thông báo 4s hiện lên.*
- [x] **T005** `[odoo-fullstack-dev]` Xây dựng API `POST /smart_farm/api/weather/refresh` trong `smart_farm/controllers/main.py` (lưu CSDL và trả về JSON); thêm nút làm mới 🔄 trên header thẻ Thời tiết trong `dashboard.xml`; viết hàm `sfRefreshWeather(btn)` trong `dashboard.js` gọi AJAX không reload trang, hiệu ứng icon xoay, cập nhật số liệu/icon tức thời và kích hoạt Toast feedback 4s.
- [x] **T006** `[odoo-code-reviewer]` Soi diff `main.py`, `dashboard.xml`, `dashboard.css` và `dashboard.js`, kiểm tra cơ chế chống spam click (disabled khi đang tải), format JSON phản hồi và toast notification.
- [x] **T007** Lập trình viên nghiệm thu (mở Dashboard, bấm nút làm mới 🔄), xác nhận icon xoay, số liệu cập nhật tức thời không giật màn hình và Toast thông báo hiện lên 4s.
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - instant 1-click weather refresh api and toast feedback`

---

### Subtask 3: Chế độ Ngoại tuyến (Offline Fallback) & Kiểm thử Toàn diện
*Mục tiêu nghiệm thu: Kiểm tra cơ chế tự động fallback khi mất mạng, hiển thị badge "Từ DB", chống spam click và đối chiếu tài liệu kỹ thuật.*
- [ ] **T009** `[odoo-fullstack-dev]` Hoàn thiện cơ chế fallback ngoại tuyến khi mất mạng hoặc API Open-Meteo timeout $\rightarrow$ tự động nạp bản ghi gần nhất trong `smart.farm.weather`, đổi badge sang "Từ DB"; cập nhật tài liệu kỹ thuật `smart_farm/docs/CHANGED.md`.
- [ ] **T010** `[odoo-code-reviewer]` Soi diff toàn bộ các file đã thay đổi, kiểm tra tính nhất quán mã nguồn, tài liệu và không có lỗi console JavaScript.
- [ ] **T011** Lập trình viên nghiệm thu (F5 Odoo, kiểm tra tổng thể kịch bản online, refresh và fallback offline), xác nhận 0 visual regression.
- [ ] **T012** Commit: `feat(smart_farm): subtask 3 - offline fallback resilience and comprehensive verification`
