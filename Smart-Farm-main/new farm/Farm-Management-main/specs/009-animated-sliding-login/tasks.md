# Tasks: Giao Diện Đăng Nhập & Đăng Ký Trượt Kép Hiện Đại (Modern Animated Sliding Auth Screen)

**Input**: Kế hoạch từ [`plan.md`](./plan.md) và đặc tả từ [`spec.md`](./spec.md)  
**Status**: Complete (Hoàn tất 100% 4/4 Subtasks)  

---

## Danh sách công việc theo chuẩn 4 bước (Task Checklist)

### Subtask 1: Cấu trúc QWeb Template Kế Thừa Trang Đăng Nhập Odoo
- [x] **T001** `[odoo-backend-developer]` Tạo tệp template `smart_farm/views/login_templates.xml` kế thừa `web.login_layout` và `web.login`, xây dựng cấu trúc thẻ container bao gồm 2 form (Sign In, Sign Up) và 2 panel overlay xanh gradient (Welcome Back, Hello Friend) chuẩn theo 2 ảnh mẫu thiết kế, đăng ký file XML vào `__manifest__.py`.
- [x] **T002** `[odoo-code-reviewer]` Soi diff `login_templates.xml` và `__manifest__.py`, kiểm tra cú pháp QWeb XML, các thẻ input (`name="login"`, `name="password"`, `csrf_token`), form action và tính tương thích với controller đăng nhập của Odoo 18.
- [x] **T003** Lập trình viên nghiệm thu (cập nhật module trên Odoo, truy cập `http://localhost:8060/web/login`), xác nhận template mới được nạp vào hệ thống mà không bị lỗi cú pháp XML.
- [x] **T004** Commit: `feat(smart_farm): subtask 1 - implement custom sliding login qweb template`

---

### Subtask 2: Hệ Thống CSS & Hiệu Ứng Chuyển Động Trượt Kép
- [x] **T005** `[odoo-frontend-styler]` Xây dựng tệp CSS `smart_farm/static/src/css/login.css`: thiết lập bộ màu gradient xanh ngọc nông nghiệp sinh thái (`#10b981` -> `#059669` -> `#0d9488`), các khối hình học nền accent, thiết kế form dạng pill bo tròn cao cấp, và xây dựng động cơ keyframes/transitions trượt ngang mượt mà 0.6s (`.right-panel-active`, `@keyframes sfShow`, Parallax shift) tương ứng hoàn hảo với 2 ảnh mẫu.
- [x] **T006** `[odoo-code-reviewer]` Soi diff `login.css`, kiểm tra các thuộc tính CSS animation, flexbox/absolute layout, box-shadows, z-index layering và độ mượt khi chuyển đổi trạng thái giữa 2 form.
- [x] **T007** Lập trình viên nghiệm thu (F5 trang `/web/login`), xác nhận giao diện tĩnh hiển thị sắc nét chuẩn xác theo ảnh mẫu số 2 (Sign In Mode).
- [x] **T008** Commit: `feat(smart_farm): subtask 2 - design sliding login animation and modern styles`

---

### Subtask 3: JavaScript Kích Hoạt Chuyển Đổi Trạng Thái Trượt & Asset Bundle
- [x] **T009** `[odoo-frontend-developer]` Viết mã JavaScript trong `smart_farm/static/src/js/login.js` xử lý sự kiện click các nút "SIGN UP" và "SIGN IN" để bật/tắt class `.right-panel-active` trên container; đăng ký asset CSS và JS vào bundle `web.assets_frontend` trong `__manifest__.py`.
- [x] **T010** `[odoo-code-reviewer]` Soi diff `login.js` và `__manifest__.py`, kiểm tra logic event listener, DOM readiness, tính cô lập tránh conflict và cấu hình asset bundle.
- [x] **T011** Lập trình viên nghiệm thu (F5 trang `/web/login`, bấm thử các nút chuyển đổi "SIGN UP" và "SIGN IN"), xác nhận hiệu ứng trượt hoán đổi 2 trạng thái hoạt động mượt mà 0.6s đúng như mô tả.
- [x] **T012** Commit: `feat(smart_farm): subtask 3 - implement sliding interaction javascript and bundle assets`

---

### Subtask 4: Hoàn Thiện Luồng Xác Thực Odoo, Thông Báo Lỗi, Responsive Mobile & Nghiệm Thu Tổng Thể
- [x] **T013** `[odoo-fullstack-dev]` Tinh chỉnh form POST xác thực Odoo (CSRF token, tự động redirect vào `/smart_farm/dashboard`), thiết kế hộp thông báo lỗi đăng nhập đẹp mắt dạng card thông báo, tối ưu hiển thị responsive trên màn hình điện thoại/tablet nhỏ, và cập nhật tài liệu `smart_farm/docs/CHANGED.md`.
- [x] **T014** `[odoo-code-reviewer]` Soi diff toàn bộ các file, kiểm tra an toàn dữ liệu, tính toàn vẹn của luồng đăng nhập và tài liệu dự án.
- [x] **T015** Lập trình viên nghiệm thu (thử nhập sai mật khẩu để kiểm tra thông báo lỗi; thử đăng nhập đúng tài khoản `admin123@gmail.com` / `abc123` để xác nhận chuyển hướng mượt mà vào Dashboard nông trại), xác nhận 0 lỗi.
- [x] **T016** Commit: `feat(smart_farm): subtask 4 - auth validation flow, error handling and responsive polish`
