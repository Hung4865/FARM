# 📝 Lịch sử thay đổi – Smart Farm Management

> File này ghi lại toàn bộ các thay đổi của dự án theo thứ tự thời gian, từ khi khởi tạo đến hiện tại.

---

## [v0.6.0] – 2026-09-26 (Hiện tại)

### 🆕 Thêm mới

#### UI & Navigation
- **Nút "Công việc" trên Navbar**:
  - Bổ sung nút tab "Công việc" vào cụm điều hướng trung tâm (`.sf-nav-pills`) cạnh "Tổng quan", giúp người dùng truy cập trực tiếp danh sách công việc ở mọi vị trí trên trang web.
- **Nút điều hướng nhanh từ Dashboard Overview**:
  - Bổ sung nút liên kết `Quản lý danh sách →` (`.sf-link-btn`) ngay trên tiêu đề thẻ "Công việc hôm nay" ở trang Tổng quan, cho phép người dùng click là nhảy ngay sang tab Quản lý công việc.
- **Không gian Quản lý Công việc Nông trại (`#tab-tasks`)**:
  - Header toolbar với tiêu đề, mô tả định hướng và nút `+ Thêm công việc` nổi bật màu xanh ngọc bích (`.sf-btn-emerald`).
  - Thanh công cụ tìm kiếm và bộ lọc đa tiêu chí:
    - Ô tìm kiếm từ khóa theo thời gian thực (tên công việc, ghi chú) có icon kính lúp và nút xóa nhanh (×).
    - Bộ lọc trạng thái dạng pill: **Tất cả**, **Chưa xong**, **Đã xong**.
    - Bộ lọc phân loại công việc dạng dropdown: Tất cả, Tưới tiêu, Cảm biến, GPS, Mùa vụ, Kho & Vật tư, Báo cáo.
  - Thanh thông tin trạng thái & Gợi ý: Hiển thị số lượng công việc nhìn thấy / tổng số công việc, badge số task đã hoàn thành và hướng dẫn kéo thả.
  - Danh sách công việc dạng thẻ tương tác cao (`.sf-task-card`):
    - Cần gắp kéo thả (`.sf-drag-handle`) với biểu tượng `⋮⋮` chuyển đổi con trỏ `grab` / `grabbing`.
    - Checkbox trạng thái hoàn thành với hiệu ứng tích xanh và gạch ngang chữ tức thì.
    - Tag phân loại sắc nét chuẩn màu sắc thiết kế nông trại.
    - Badge ngày thực hiện (hiển thị "Hôm nay" nếu trùng ngày) và người phụ trách.
    - Cụm nút hành động tác vụ: nút "Sửa" (`sfOpenTaskModal`) và nút "Xóa" (`sfDeleteTask`).
  - Trạng thái trống (Empty state): Hiển thị minh họa và nút "Đặt lại bộ lọc" khi không tìm thấy kết quả phù hợp.
  - **Modal Thêm / Chỉnh sửa công việc (`#sf-task-modal`)**: Hộp thoại nổi cao cấp với nền kính mờ glassmorphism, form nhập Tiêu đề, Phân loại, Ngày thực hiện, Ghi chú và xử lý submit mượt mà.

#### Tính năng Sắp xếp Kéo thả (Drag & Drop Reordering)
- Áp dụng chuẩn HTML5 Drag and Drop API cho danh sách công việc.
- Phản hồi thị giác thời gian thực: thẻ đang kéo hiển thị mờ đục và viền nét đứt xanh dương (`.dragging`), các thẻ xung quanh tự động dịch chuyển mượt mà.
- Tự động lưu thứ tự mới: khi thả thẻ vào vị trí mới, toàn bộ danh sách ID được gửi tức thì về API `/smart_farm/api/task/reorder` để cập nhật trường `sequence` trong database, duy trì vị trí kể cả khi F5 hoặc mở lại trình duyệt.

#### Backend APIs & Database
- Model `smart.farm.task` tại `smart_farm/models/task.py`:
  - Thêm trường `sequence = fields.Integer(string='Thứ tự', default=10)`.
  - Cập nhật thứ tự sắp xếp mặc định: `_order = 'sequence asc, is_done asc, date asc, id desc'`.
- Các API endpoints mới tại `smart_farm/controllers/main.py`:
  - `POST /smart_farm/api/task/create`: Tạo công việc mới (auth: user).
  - `POST /smart_farm/api/task/update`: Cập nhật công việc (auth: user).
  - `POST /smart_farm/api/task/delete`: Xóa công việc (auth: user).
  - `POST /smart_farm/api/task/reorder`: Lưu thứ tự sắp xếp công việc sau khi kéo thả (auth: user).
  - Cập nhật controller `dashboard`: Truy vấn `all_tasks` và `today` truyền vào QWeb template.

#### Trải nghiệm người dùng (UX)
- Ghi nhớ tab đang chọn: Tự động lưu tab hiện tại vào `localStorage`, giữ nguyên ngữ cảnh khi reload hoặc sau khi tạo/sửa công việc.
- Đồng bộ hai chiều (Two-way sync): Đánh dấu hoàn thành một công việc ở tab Quản lý công việc sẽ tự động cập nhật trạng thái tương ứng tại thẻ Tổng quan và ngược lại.
- Hỗ trợ phím tắt `Escape` để đóng nhanh các cửa sổ Modal.

---

## [v0.5.0] – 2026-09-26

### 🆕 Thêm mới

#### UI & Navigation
- **Floating Pill Header (Boltshift Style)**:
  - Thêm thanh điều hướng dạng viên thuốc nổi (`sf-navbar`) cố định đầu trang.
  - Cụm điều hướng trung tâm (`sf-nav-pills`) dạng tab phân đoạn (Segmented control) với nút chọn đen tuyền `#0f172a`.
  - Brand Logo SmartFarm với icon tia sét nền xanh dương `#2563eb`.
  - Cụm action buttons (Chuông thông báo có badge đỏ + Cài đặt Odoo).
  - Khối Profile hiển thị avatar, tên người dùng, email và Dropdown menu (Quản trị Odoo, Đăng xuất).
- **Hệ thống Quản lý Công việc Nông trại (Farm Task Management)**:
  - Model `smart.farm.task` tại `models/task.py`: Quản lý công việc nông trại (`name`, `task_type`, `date`, `is_done`, `user_id`, `notes`).
  - Giao diện Odoo Backend: List view (với `boolean_toggle`, `many2one_avatar_user`), Form view, Search view (lọc Hôm nay, Chưa xong, Đã xong, Group by).
  - Menu con "Công việc" (`menu_smart_farm_task`, sequence=5) trong menu Smart Farm.
  - Cấu hình phân quyền `ir.model.access.csv` cho User và Admin.
- **Tài liệu dự án & Spec Kit**:
  - `docs/CREDENTIALS.md`: Lưu trữ thông tin đăng nhập, Master Password, Database name và các liên kết truy cập hệ thống.
  - `docs/UI/UI-Change.md`: Nhật ký chuyên sâu ghi lại toàn bộ các thay đổi về giao diện người dùng (UI/UX).
  - `specs/001-farm-task-management/`: Khởi tạo trọn bộ đặc tả tính năng (`spec.md`, `plan.md`, `tasks.md`) theo chuẩn GitHub Spec Kit và hoàn thành 100% 14/14 task.

### 🔄 Cập nhật

#### Controllers
- `controllers/main.py`:
  - Bổ sung truyền biến `user` (`env.user`) vào QWeb template values để lấy thông tin tài khoản hiển thị lên Header.
  - Bổ sung endpoint API `POST /smart_farm/profile/update` (auth: user) xử lý cập nhật hồ sơ cá nhân: đổi họ tên, số điện thoại, email đăng nhập (kiểm tra tránh trùng lặp tài khoản) và đổi mật khẩu mới.
  - Bổ sung truy vấn danh sách công việc hôm nay (`smart.farm.task`) và tính toán số task hoàn thành / còn lại truyền vào template Dashboard.
  - Bổ sung endpoint API `POST /smart_farm/api/task/toggle` (auth: user) cập nhật trạng thái `is_done` qua AJAX và trả về bộ đếm mới.

#### Views & Styles
- `views/dashboard.xml`:
  - Bọc `sf-navbar` trong container `sf-navbar-sticky` để ngăn nội dung trang lọt qua khe hở phía trên khi cuộn.
  - Thiết kế lại `sf-header` thành hàng ngang: tiêu đề bên trái, badge trạng thái cập nhật thời gian thực (`sf-sub-badge`) có chấm xanh nhấp nháy (`sf-pulse-dot`) bên phải.
  - Chuyển đổi nút Setting (Bánh răng) từ link trực tiếp sang Dropdown menu (Cài đặt hệ thống, Quản lý cơ sở dữ liệu, Làm mới dữ liệu).
  - Nâng cấp khối Hồ sơ cá nhân (`.sf-user-profile`): chuyển sang click mở dropdown tài khoản, thêm icon chevron mũi tên chỉ xuống xoay khi mở.
  - Thay thế mục "Quản trị Odoo" trong Dropdown Account thành **"Hồ sơ cá nhân" (Profile)** kích hoạt Modal chỉnh sửa thông tin.
  - Thêm cấu trúc Dialog Modal `#sf-profile-modal` cho phép thay đổi: Họ và tên, Số điện thoại, Email đăng nhập, Mật khẩu mới & Xác nhận mật khẩu.
  - Cập nhật khối Brand Logo SmartFarm (`.sf-brand`) thành liên kết kích hoạt hàm `sfGoToOverview(event)` để khi nhấp vào logo/chữ SmartFarm sẽ lập tức chuyển về tab Tổng quan và cuộn lên đầu trang.
  - Thêm liên kết Favicon trang web (`/smart_farm/static/src/img/Favicon.jpg`) qua các thẻ `<link rel="icon">`, `<link rel="shortcut icon">`, `<link rel="apple-touch-icon">` hiển thị biểu tượng mầm lá công nghệ phát sáng trên tab trình duyệt.
  - Chuyển đổi card "Công việc hôm nay" từ demo tĩnh sang render động dữ liệu thực tế từ Database qua vòng lặp `<t t-foreach="tasks" t-as="task">`.
  - Tăng version CSS lên `?v=16` và JS lên `?v=6`.
- `static/src/css/dashboard.css`:
  - Kéo dài giao diện full-width 100% màn hình (`width: 100%; max-width: 100%; padding: 0 28px 40px 28px`), loại bỏ phần lề thừa 2 bên mạn.
  - Cấu hình lớp nền `background: #eef2f6` cho `sf-navbar-sticky` giúp che chắn triệt để chữ phía dưới khi cuộn trang.
  - Đổi màu nền trang `body` sang `#eef2f6` tăng độ tương phản rõ rệt với các card trắng.
  - Tăng độ đậm đường viền các thẻ (`.sf-stat`, `.sf-card`) lên `1.5px solid #cbd5e1` kèm hiệu ứng đổ bóng `box-shadow: 0 2px 4px rgba(0,0,0,0.05)`.
  - Tăng độ dày thanh tiến trình cảm biến đất từ 3px lên 6px và thêm đường kẻ phân cách tiêu đề thẻ.
  - Tinh chỉnh hiệu ứng Hover nút điều hướng Navbar (`.sf-nav-item:hover`): nền `#cbd5e1`, màu chữ `#0f172a`, `font-weight: 600`, đổ bóng `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, phân biệt rõ rệt với trạng thái thường.
  - Thêm hiệu ứng nhấn nút (`:active`) và hiệu ứng hover nút icon (`.sf-icon-btn:hover`).
  - Thêm hệ thống Dropdown menu (`.sf-dropdown-menu`, `.sf-dropdown-menu.show`, animation `sfFadeSlide`) kích hoạt theo cơ chế click thay vì hover.
  - Thiết kế bộ giao diện Profile Modal cao cấp (`.sf-modal-backdrop`, `.sf-modal-card`, `.sf-modal-header`, `.sf-input`, `.sf-btn`, `.sf-alert`) với nền mờ glassy `backdrop-filter: blur(4px)` và hiệu ứng mở mượt mà.
  - Thêm hiệu ứng con trỏ chuột (`cursor: pointer`), hover nhấc nhẹ và phản hồi nhấn nút cho logo thương hiệu `.sf-brand`.
  - Bổ sung hiệu ứng tương tác checkbox công việc (`.sf-check:hover`), gạch ngang chữ khi xong (`.sf-task-text.done`) và màu sắc tag phân loại.
- `static/src/js/dashboard.js`:
  - Bổ sung hàm `sfToggleDropdown(event, menuId)` điều khiển mở/đóng dropdown và xoay chevron icon.
  - Bổ sung sự kiện lắng nghe đóng toàn bộ dropdown khi click ra ngoài (`click outside`).
  - Xây dựng các hàm xử lý Profile Modal: `sfOpenProfileModal()`, `sfCloseProfileModal()`, `sfSaveProfile()`, `sfShowProfileAlert()`, lắng nghe phím `Escape` đóng popup.
  - Cập nhật thời gian thực (live update) tên và email người dùng trên thanh Header ngay sau khi lưu thành công không cần tải lại toàn bộ trang.
  - Nâng cấp hàm `sfOpenTab(evt, tabName)` và bổ sung hàm `sfGoToOverview(event)` giúp nhấp vào logo SmartFarm kích hoạt trở về tab Tổng quan và smooth scroll lên đầu trang.
  - Bổ sung hàm `sfToggleTask(taskId, element)` xử lý cập nhật giao diện hoàn thành công việc một chạm (Optimistic UI) và đồng bộ qua API AJAX tức thì.

---

## [v0.4.0] – 2026-08-07

### 🆕 Thêm mới

#### Controllers
- `controllers/__init__.py` – Import controller `main`.
- `controllers/main.py` – HTTP Controller `SmartFarmDashboard`:
  - Route `GET /smart_farm/dashboard` (auth: user).
  - Lấy 5 bản ghi GPS mới nhất, cảnh báo chưa xử lý, dữ liệu thời tiết.
  - Fallback thời tiết: API trực tiếp → DB → mock data.
  - Render QWeb template `smart_farm.dashboard_main`.

#### Views (Giao diện XML)
- `views/dashboard.xml` – QWeb template dashboard đầy đủ:
  - Action URL `/smart_farm/dashboard`.
  - Menu "Tổng quan" (sequence=1, ưu tiên cao nhất).
  - Template hiển thị: thẻ thống kê, card thời tiết, card cảnh báo, card GPS, card cảm biến (demo), card công việc (demo).
- `views/menu.xml` – Định nghĩa menu chính + 3 sub-menu:
  - `Smart Farm` (root) → GPS & Vị trí / Thời tiết / Cảnh báo.
- `views/gps_views.xml` – Form & list view cho `smart.farm.gps`.
- `views/weather_views.xml` – Form & list view cho `smart.farm.weather`.
- `views/alert_views.xml` – Form & list view cho `smart.farm.alert`.

#### Static Assets
- `static/src/css/dashboard.css` – CSS tùy chỉnh hoàn chỉnh cho dashboard (grid layout, cards, badges, weather, alerts, GPS map, sensors, tasks).
- `static/src/js/dashboard.js` – File JS placeholder (sẽ bổ sung logic tương tác sau).

#### Security
- `security/ir.model.access.csv` – Cấp quyền CRUD đầy đủ (read/write/create/unlink) cho 3 model: `smart.farm.gps`, `smart.farm.weather`, `smart.farm.alert`.

#### Cấu hình
- `.gitignore` – Bổ sung các rule loại trừ: `__pycache__/`, `*.py[cod]`, `venv/`, `env/`, `odoo-data/`, `db-data/`, `.DS_Store`, `Thumbs.db`.

### 🔄 Cập nhật

#### `__manifest__.py`
- `version`: `17.0.1.0.0` → `18.0.1.0.0` (khớp với Odoo 18).
- Thêm đủ mục `data`: `security/ir.model.access.csv`, `views/dashboard.xml`, `views/menu.xml`, `views/gps_views.xml`, `views/weather_views.xml`, `views/alert_views.xml`.

#### `__init__.py` (root)
- Import cả `models` và `controllers`.

#### `models/alert.py`
- **Refactor hoàn toàn**: Chuyển từ hàm script `send_message()` sang Odoo Model `SmartFarmAlert`:
  - Fields: `name`, `content`, `alert_type` (danger/warning/info/success), `area`, `timestamp`, `is_resolved`.
  - Method `action_resolve()` – đánh dấu cảnh báo đã xử lý.

#### `docker-compose.yml`
- Nâng cấp image: `odoo:17` → `odoo:18`.

### ❌ Xóa
- `smart_farm/config.py` – Không còn cần thiết (module Odoo không dùng XML-RPC thủ công).
- `smart_farm/web_app.py` – File không thuộc cấu trúc module Odoo.
- `views/weather.xml`, `views/gps.xml`, `views/alert.xml` – Đổi tên thành `weather_views.xml`, `gps_views.xml`, `alert_views.xml` cho nhất quán.

### 🚀 Triển khai
- Module được copy vào container và restart:
  ```bash
  docker exec -u root smart_farm-web-1 rm -rf /mnt/extra-addons/smart_farm
  docker cp ~/projects/Farm\ Management/Farm-Management/smart_farm smart_farm-web-1:/mnt/extra-addons/
  docker compose -f .../docker-compose.yml restart web
  ```

---

## [v0.3.0] – 2026-08-07

### 🆕 Thêm mới
- Tạo thư mục `docs/` để quản lý tài liệu nội bộ dự án.
- Thêm file `docs/overview.md` – mô tả tổng quan kiến trúc, công nghệ và luồng dữ liệu.
- Thêm file `docs/CHANGED.md` – ghi lại lịch sử thay đổi toàn bộ dự án.

### ❌ Xóa
- `smart_farm/README.md` – Thông tin cũ và lỗi thời, tài liệu được tổng hợp vào `README.md` gốc.

---

## [v0.2.0] – 2026-08-07

### 🔄 Tái cấu trúc (Script Python → Odoo Custom Module)

Dự án chuyển từ mô hình **script Python độc lập** sang **Odoo Custom Module** tích hợp hoàn toàn vào Odoo.

#### ❌ Xóa (các file script cũ)
- `smart_farm/main.py` – Điểm vào kịch bản Python cũ.
- `smart_farm/services/odoo_client.py` – Lớp kết nối XML-RPC thủ công.
- `smart_farm/services/gps.py` – Script GPS độc lập.
- `smart_farm/services/message.py` – Script gửi thông báo độc lập.
- `smart_farm/services/weather.py` – Script thời tiết độc lập.
- Toàn bộ thư mục `smart_farm/services/` bị loại bỏ.

#### 🆕 Thêm mới (cấu trúc Odoo Module chuẩn)
- `smart_farm/__manifest__.py` – Khai báo module Odoo.
- `smart_farm/__init__.py` – Khởi tạo package Python.
- `smart_farm/models/__init__.py` – Import gps, weather, alert.
- `smart_farm/models/gps.py` – Model `SmartFarmGPS` (Odoo ORM).
- `smart_farm/models/weather.py` – Model `SmartFarmWeather` + method `fetch_and_save()`.
- `smart_farm/models/alert.py` – (Lúc đầu là refactor từ `message.py` cũ).
- `smart_farm/views/` – Thư mục giao diện XML.
- `smart_farm/security/` – Thư mục phân quyền.

### ⚙️ Thay đổi cấu hình

| Thông số        | Giá trị cũ              | Giá trị mới             |
|-----------------|-------------------------|-------------------------|
| Port (host)     | `8069`                  | `8060`                  |
| Database name   | `my_smart_farm`         | `Farm_Management`       |
| Admin email     | `admin@example.com`     | `admin123@gmail.com`    |
| Admin password  | `admin`                 | `abc123`                |
| URL             | `http://localhost:8069` | `http://localhost:8060` |

---

## [v0.1.1] – 2026-08-07

### 📄 Tài liệu
- Viết hoàn chỉnh `README.md` tại thư mục gốc (`Farm-Management/README.md`) với 3 phần:
  1. Giới thiệu tổng quan dự án.
  2. Hướng dẫn cài đặt và chạy dự án (5 bước).
  3. Quy trình làm việc nhóm (Git branching, Conventional Commits, checklist PR).

### 🐳 Hạ tầng
- Cài đặt `docker-compose-plugin` từ repository Docker chính thức để hỗ trợ lệnh `docker compose` (thay thế `docker-compose` gây lỗi `unknown shorthand flag: 'd' in -d`).
- Quy trình cài đặt plugin đã được ghi vào README (Bước 0).

---

## [v0.1.0] – Khởi tạo dự án

### 🆕 Cấu trúc ban đầu

Dự án khởi tạo với kiến trúc **script Python + Odoo XML-RPC**:

```
smart_farm/
├── docker-compose.yml       # Odoo 17 + PostgreSQL 15 (port 8069)
├── main.py                  # Script chạy tuần tự 3 kịch bản
├── config.py                # URL=localhost:8069, DB=my_smart_farm
├── requirements.txt         # requests
└── services/
    ├── odoo_client.py       # Kết nối XML-RPC
    ├── gps.py               # Ghi tọa độ GPS vào Odoo Notes
    ├── message.py           # Gửi thông báo qua Odoo Discuss
    └── weather.py           # Gọi Open-Meteo, log vào mail.message
```

### ⚙️ Cấu hình ban đầu

| Thông số        | Giá trị                  |
|-----------------|--------------------------|
| Odoo image      | `odoo:17`                |
| Port (host)     | `8069`                   |
| Database name   | `my_smart_farm`          |
| Admin email     | `admin@example.com`      |
| Admin password  | `admin`                  |
| URL             | `http://localhost:8069`  |

### 🔧 Tính năng ban đầu
- `gps.py`: Ghi tọa độ GPS (TP.HCM: lat=10.762622, lon=106.660172) vào Odoo Notes.
- `message.py`: Gửi cảnh báo lịch tưới tiêu khu vực A qua Odoo Discuss.
- `weather.py`: Gọi `api.open-meteo.com`, lấy nhiệt độ + tốc độ gió, lưu vào `mail.message` của Odoo.
