# 🎨 Nhật ký thay đổi giao diện (UI Changes) – Smart Farm Management

> File này chuyên theo dõi chi tiết toàn bộ các thay đổi về giao diện người dùng (UI), trải nghiệm (UX), thiết kế thành phần (Component Design) và hệ thống Style/CSS của dự án.

---

## [2026-09-26] – Ra mắt không gian Quản lý Công việc Nông trại (Task Management Workspace) & Kéo thả sắp xếp

### 1. 📋 Nút điều hướng Tab "Công việc" trên Navbar
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thành phần:**
  * Bổ sung nút bấm tab `Công việc` vào cụm điều hướng trung tâm `.sf-nav-pills` (nằm ngay sau tab `Tổng quan`).
  * Sử dụng cơ chế `sfOpenTab(event, 'tab-tasks')` đồng nhất với hệ thống tab hiện tại.
  * Tự động lưu và duy trì trạng thái tab đang chọn trong `localStorage` (`sf_active_tab`), giúp người dùng không bị chuyển hướng về trang chủ khi tải lại hoặc lưu dữ liệu.

---

### 2. 🔗 Nút nhảy nhanh "Quản lý danh sách →" trên Card Tổng quan
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thành phần:**
  * Thêm nút liên kết `.sf-link-btn` (`Quản lý danh sách →`) tại góc phải tiêu đề của thẻ "Công việc hôm nay" (Dashboard Overview).
  * Cho phép người dùng chỉ với 1 cú click là chuyển ngay lập tức sang tab Quản lý công việc để thực hiện các thao tác chuyên sâu.

---

### 3. 🛠️ Không gian làm việc Quản lý Công việc (`#tab-tasks`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thành phần:**
  * **Header Card Toolbar:**
    * Tiêu đề lớn kèm icon công việc xanh lá cây, mô tả hướng dẫn trực quan.
    * Nút hành động chính `+ Thêm công việc` (`.sf-btn-emerald`) nổi bật với hiệu ứng nâng thẻ và đổ bóng mềm.
  * **Thanh tìm kiếm & Bộ lọc linh hoạt:**
    * Ô tìm kiếm từ khóa real-time (`#sf-task-search-input`) lọc tức thời theo tên công việc hoặc nội dung ghi chú kèm nút xóa nhanh (×).
    * Bộ lọc trạng thái dạng viên thuốc (Filter pills): **Tất cả**, **Chưa xong**, **Đã xong**.
    * Dropdown phân loại chuyên sâu: Tất cả, Tưới tiêu, Cảm biến, GPS, Mùa vụ, Kho & Vật tư, Báo cáo.
  * **Thanh thông tin & Gợi ý (Info bar):**
    * Hiển thị số lượng công việc: `Hiển thị X / Y công việc · ✓ Z hoàn thành`.
    * Dòng nhắc nhở tương tác kéo thả với biểu tượng `⋮⋮`.
  * **Thẻ công việc tương tác cao (`.sf-task-card`):**
    * Cần gắp kéo thả (`.sf-drag-handle`): Cho phép người dùng kéo thả để thay đổi vị trí ưu tiên.
    * Checkbox trạng thái: Đánh dấu hoàn thành trực quan với màu xanh lục và gạch ngang chữ.
    * Thẻ phân loại Tag màu chuẩn thiết kế: Tưới tiêu (`tag-blue`), Cảm biến & GPS (`tag-green`), Mùa vụ & Kho (`tag-amber`).
    * Badge ngày thực hiện (tự động nhận diện "Hôm nay") và tên người phụ trách.
    * Cụm nút tác vụ: Nút `Sửa` (✏️) mở modal cập nhật và Nút `Xóa` (🗑️) có hộp thoại xác nhận an toàn.
  * **Trạng thái kết quả rỗng (Empty state):**
    * Khi tìm kiếm hoặc lọc không có kết quả, hiển thị thông báo thân thiện kèm nút `Đặt lại bộ lọc` để phục hồi danh sách ban đầu.

---

### 4. 🔀 Tương tác Kéo thả sắp xếp thứ tự (Drag & Drop Reordering)
* **File cập nhật:** [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết kỹ thuật:**
  * Sử dụng Native HTML5 Drag and Drop API, không phụ thuộc thư viện bên ngoài.
  * Khi kéo, thẻ hiện hiệu ứng bán trong suốt mờ ảo và viền nét đứt xanh dương (`.dragging`), các thẻ bên dưới tự động dời chỗ nhịp nhàng theo vị trí con trỏ chuột.
  * Khi thả thẻ, danh sách ID thứ tự mới lập tức được gửi về server qua API `POST /smart_farm/api/task/reorder` và lưu vào trường `sequence` của database PostgreSQL, đảm bảo thứ tự luôn được duy trì lâu dài.

---

### 5. 🪟 Hộp thoại Thêm / Chỉnh sửa công việc (`#sf-task-modal`)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thành phần:**
  * Thiết kế đồng bộ phong cách Boltshift Glassmorphism với Profile Modal.
  * Hỗ trợ 2 chế độ:
    * **Thêm mới**: Tiêu đề "Thêm công việc mới", ngày tự động gán là ngày hiện tại.
    * **Chỉnh sửa**: Tự động load dữ liệu của thẻ được chọn vào form và cập nhật nhãn nút bấm thành "Cập nhật công việc".
  * Xử lý lỗi form qua thông báo Alert đỏ và hiệu ứng Loading trên nút bấm.
  * Hỗ trợ đóng modal bằng nút X, bấm ra ngoài vùng mờ hoặc phím `Escape`.

---

## [2026-09-26] – Nâng cấp độ tương phản & Header phong cách Floating Pill (Boltshift)

### 1. 🧭 Thanh điều hướng Header nổi (Floating Pill Navbar - Boltshift Style)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py)
* **Chi tiết thành phần:**
  * **Khung chứa chính (`.sf-navbar`):**
    * Thiết kế dạng viên thuốc bo tròn tuyệt đối (`border-radius: 9999px`).
    * Nền trắng tinh (`#ffffff`), viền sắc nét `1.5px solid #cbd5e1`, hiệu ứng đổ bóng đa tầng `box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05)`.
    * Cố định ở đầu trang (`position: sticky; top: 14px; z-index: 100`) giúp dễ thao tác khi cuộn trang.
  * **Brand Logo (`.sf-brand`):**
    * Huy hiệu tròn 36px màu xanh dương `#2563eb` với biểu tượng tia sét trắng SVG và hiệu ứng đổ bóng màu.
    * Tên thương hiệu **SmartFarm** in đậm (`font-weight: 700; color: #0f172a`).
  * **Cụm điều hướng trung tâm (`.sf-nav-pills`):**
    * Container nền xám nhẹ `#f1f5f9` bo tròn 9999px.
    * Tab đang chọn (`.sf-nav-item.active`): Màu đen tuyền `#0f172a`, chữ trắng nổi bật, đổ bóng nhẹ.
    * Tích hợp cơ chế chuyển đổi tab tức thời qua hàm JS `sfOpenTab(event, '...')`:
      * **Tổng quan** (`tab-overview`)
      * **Bản đồ** (`tab-map`)
      * **Kho & Sản phẩm** (`tab-inventory`)
      * **Hệ thống Odoo** (chuyển hướng sang `/web`)
  * **Cụm tác vụ nhanh (`.sf-nav-actions`):**
    * Capsule tròn nhỏ nền `#f8fafc` chứa icon Chuông thông báo (kèm chấm đỏ trạng thái cảnh báo) và icon Bánh răng cài đặt hệ thống.
  * **Hồ sơ tài khoản (`.sf-user-profile`):**
    * Ảnh đại diện tròn (Avatar) kết nối tự động từ Odoo model `res.users` qua đường dẫn `/web/image?model=res.users&id=...`. Có fallback ảnh đại diện tự sinh.
    * Hiển thị Tên người dùng và Email đăng nhập (`admin123@gmail.com`).
    * Tích hợp Dropdown menu khi rê chuột (Hover) chứa link vào Quản trị Odoo và nút Đăng xuất.

---

### 2. 🔲 Tăng cường độ đậm đường viền & Độ tương phản (Contrast & Card Borders)
* **File cập nhật:** [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thay đổi:**
  * **Màu nền toàn trang (`body`):** Chuyển từ xám nhạt `#f5f5f3` sang `#eef2f6` (soft tech slate), tạo nền tương phản rõ rệt giúp các khối card màu trắng nổi bật, không bị chìm hay mờ nhạt.
  * **Đường viền các thẻ ([`.sf-stat`], [`.sf-card`]):**
    * Thay thế viền mờ `1px solid rgba(0,0,0,.08)` bằng viền xám công nghệ rõ nét **`1.5px solid #cbd5e1`**.
    * Bổ sung hiệu ứng nổi khối `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)` và hiệu ứng hover nhẹ nâng thẻ lên (`transform: translateY(-2px)`).
  * **Phân cách nội bộ thẻ:**
    * Thêm đường kẻ ngang `border-bottom: 1px solid #e2e8f0` dưới tiêu đề mỗi thẻ (`.sf-card-hd`).
    * Thẻ dự báo thời tiết 4 ngày (`.sf-fc-day`): Viền `1.5px solid #e2e8f0` bo góc mềm mại.
    * Tăng kích thước thanh hiển thị độ ẩm/nhiệt độ đất (`.sf-bar`) từ `3px` lên `6px`.

---

### 3. ⚡ Quản lý Cache trình duyệt
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml)
* Cập nhật query version CSS lên `?v=12` để bảo đảm trình duyệt người dùng luôn nhận bản cập nhật CSS mới nhất ngay sau khi tải lại trang.

---

### 4. 📐 Mở rộng Full-Width & Khắc phục lọt chữ cuộn trang (Sticky Bar & Layout Expansion)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css)
* **Chi tiết thay đổi:**
  * **Kéo dài giao diện full màn hình:** Thay thế `max-width: 1400px; margin: 0 auto;` bằng `width: 100%; max-width: 100%; padding: 0 28px 40px 28px;`, loại bỏ hoàn toàn khoảng trống thừa ở 2 bên mạn, giúp giao diện Dashboard phủ kín toàn bộ chiều rộng màn hình.
  * **Khắc phục lỗi lọt chữ phía sau Header:**
    * **Hiện tượng:** Khi cuộn trang, chữ tiêu đề và ngày giờ cũ trượt lên khe trống 14px phía trên navbar, bị lộ ra phía sau logo và avatar.
    * **Xử lý:** Bọc thanh `sf-navbar` trong container `sf-navbar-sticky` cố định ở `top: 0` với nền trùng màu background `#eef2f6`, đóng vai trò như một lớp khiên che chắn triệt để mọi nội dung khi cuộn lướt bên dưới.
  * **Tái thiết kế hàng tiêu đề (`.sf-header`):**
    * Bố cục ngang cân xứng:
      * **Bên trái:** Tiêu đề trang **"Tổng quan trang trại"** in đậm sắc nét.
      * **Bên phải:** Huy hiệu trạng thái thời gian thực (`.sf-sub-badge`) bo tròn dạng viên thuốc màu trắng, có chấm xanh phát sáng nhịp tim (`.sf-pulse-dot`) hiển thị thời gian cập nhật.

---

### 5. 🖱️ Tinh chỉnh Hover Navbar & Dropdown tương tác Click (Settings & Account Dropdown)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thay đổi:**
  * **1. Độ tương phản Hover các nút Navbar (`.sf-nav-item:hover`):**
    * **Trước đây:** Nền `rgba(0,0,0,0.05)` quá mờ nhạt, gần như trùng với màu nền xám nhạt `#f1f5f9` của thanh pill.
    * **Sau khi sửa:** Đổi sang nền slate **`#cbd5e1`**, màu chữ đậm **`#0f172a`**, font chữ **`font-weight: 600`**, kèm đổ bóng nhẹ **`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`** và hiệu ứng co giãn nhẹ khi bấm (`:active { transform: scale(0.97) }`). Hover hiện rõ ràng, dứt khoát và cực kỳ bắt mắt.
  * **2. Nút Cài đặt (Settings gear icon) thành Dropdown Menu:**
    * **Trước đây:** Nút bánh răng trỏ trực tiếp đến liên kết `/web` tương tự như nút Odoo.
    * **Sau khi sửa:** Chuyển thành nút kích hoạt Dropdown menu (`onclick="sfToggleDropdown(event, 'sf-settings-menu')"`). Khi click sẽ xổ danh sách tùy chọn cấu hình:
      * **Thiết lập hệ thống** (`/web#action=base_setup.action_general_configuration`)
      * **Quản lý cơ sở dữ liệu** (`/web/database/manager`)
      * **Làm mới dữ liệu** (Refresh trực tiếp không cần tải lại thủ công)
  * **3. Khắc phục Dropdown Tài khoản (Account/Profile) bị mất khi di chuột:**
    * **Nguyên nhân cũ:** Dropdown kích hoạt bằng CSS `:hover` với khoảng cách `top: calc(100% + 8px)`. Khi người dùng di chuyển con trỏ chuột từ avatar xuống menu, chuột lọt vào khoảng hở 8px làm mất trạng thái `:hover`, khiến menu biến mất trước khi kịp nhấp chọn.
    * **Giải pháp mới:** Chuyển hoàn toàn sang cơ chế **Click để mở** (`Click-to-open` via `sfToggleDropdown`). Khi nhấp chuột vào Profile, menu sẽ hiển thị cố định (`.show`), người dùng thoải mái di chuột chọn các mục bên trong mà không bao giờ bị biến mất giữa chừng.
    * **Trải nghiệm bổ sung:** Thêm icon mũi tên nhỏ (`.sf-chevron-icon`) bên cạnh avatar tự động xoay 180° khi menu mở, cùng tính năng tự động đóng lại khi click ra ngoài vùng dropdown (`click-outside`).
  * **4. Quản lý Cache:** Bumping version lên `dashboard.css?v=13` và `dashboard.js?v=3`.

---

### 6. 👤 Thay thế Quản trị Odoo bằng Modal Profile (Chỉnh sửa Họ tên, SĐT, Email, Mật khẩu)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py)
* **Chi tiết thay đổi:**
  * **1. Chuyển đổi Menu Tài khoản:**
    * Thay thế mục "Quản trị Odoo" thành **"Hồ sơ cá nhân"** kèm icon người dùng SVG hiện đại.
    * Khi click vào, hệ thống kích hoạt hàm `sfOpenProfileModal()` mở hộp thoại Modal popup ngay trên giao diện dashboard.
  * **2. Thiết kế Hộp thoại Profile Modal (`#sf-profile-modal`):**
    * **Backdrop mờ cao cấp:** Nền tối `rgba(15, 23, 42, 0.6)` kết hợp bộ lọc làm mờ phông nền `backdrop-filter: blur(4px)`.
    * **Thẻ Card Modal:** Bo góc tròn mềm mại `18px`, viền `1.5px solid #cbd5e1`, đổ bóng nổi khối đa tầng `box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25)`.
    * **Các trường thông tin form:**
      * **Họ và tên:** Tự động điền giá trị hiện tại (`user.name`), cho phép chỉnh sửa.
      * **Số điện thoại:** Trường nhập SĐT liên hệ (`user.phone`).
      * **Email đăng nhập:** Email tài khoản Odoo (`user.email` / `user.login`).
      * **Đổi mật khẩu:** Hai ô nhập Mật khẩu mới và Xác nhận mật khẩu mới (có thể bỏ trống nếu không muốn đổi mật khẩu).
  * **3. Trải nghiệm tương tác (UX):**
    * Hỗ trợ đóng modal linh hoạt: bấm nút "Hủy", nút "×", bấm click ra ngoài phông nền (backdrop click), hoặc nhấn phím `Escape`.
    * Validate dữ liệu chặt chẽ ở cả Frontend và Backend (kiểm tra rỗng, trùng lặp email, khớp mật khẩu tối thiểu 6 ký tự).
    * Phản hồi trạng thái tức thời qua thanh thông báo `.sf-alert-success` / `.sf-alert-danger`.
    * Tự động cập nhật trực tiếp tên và email trên thanh Header (`#sf-top-user-name`, `#sf-top-user-email`) ngay sau khi lưu thành công mà không cần tải lại trang.
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=14` và `dashboard.js?v=4`.

---

### 7. 🏠 Tích hợp Logo SmartFarm làm nút điều hướng về Tổng quan (Brand Overview Link)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js)
* **Chi tiết thay đổi:**
  * **1. Điều hướng thương hiệu (`.sf-brand`):**
    * Chuyển đổi khối `div.sf-brand` thành liên kết thẻ `a.sf-brand` kèm tooltip `"Về trang tổng quan"`.
    * Gắn sự kiện `onclick="sfGoToOverview(event)"`.
  * **2. Logic xử lý (`sfGoToOverview`):**
    * Khi người dùng nhấp vào Logo hoặc chữ SmartFarm, hệ thống sẽ:
      1. Tự động chuyển đổi tab nội dung về `tab-overview` (Tổng quan).
      2. Tự động đánh dấu nút "Tổng quan" trên thanh viên thuốc (`.sf-nav-pills`) thành trạng thái kích hoạt (`.active`), hủy chọn các tab khác.
      3. Cuộn mượt mà trang lên đầu (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * **3. Hiệu ứng giao diện (Style & Feedback):**
    * Con trỏ chuột chuyển thành hình bàn tay (`cursor: pointer`).
    * Hiệu ứng hover nhấc nhẹ (`transform: translateY(-1px)`, `opacity: 0.9`).
    * Hiệu ứng click phản hồi nhấn nhả (`:active { transform: scale(0.98) }`).
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=15` và `dashboard.js?v=5`.

---

### 8. 🌿 Tích hợp Favicon mầm lá công nghệ phát sáng (Favicon Integration)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), asset [`static/src/img/Favicon.jpg`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/img/Favicon.jpg)
* **Chi tiết thay đổi:**
  * Khai báo liên kết Favicon chuẩn cho các trình duyệt và thiết bị di động trong thẻ `<head>` của QWeb Template `smart_farm.dashboard_main`:
    * `<link rel="icon" type="image/jpeg" href="/smart_farm/static/src/img/Favicon.jpg"/>`
    * `<link rel="shortcut icon" type="image/jpeg" href="/smart_farm/static/src/img/Favicon.jpg"/>`
    * `<link rel="apple-touch-icon" href="/smart_farm/static/src/img/Favicon.jpg"/>`
  * Hiển thị biểu tượng nhận diện mầm cây IoT phát sáng màu xanh neon trên tab trình duyệt, bookmarks và màn hình chính khi lưu trang.

---

### 9. 📋 Hệ thống Quản lý Công việc Nông trại Động & Tương tác một chạm (Interactive Farm Task Card)
* **File cập nhật:** [`views/dashboard.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/dashboard.xml), [`views/task_views.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/task_views.xml), [`views/menu.xml`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/views/menu.xml), [`static/src/css/dashboard.css`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/css/dashboard.css), [`static/src/js/dashboard.js`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/static/src/js/dashboard.js), [`controllers/main.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/controllers/main.py), [`models/task.py`](file:///home/ubuntu/FARM/Smart-Farm-main/new%20farm/Farm-Management-main/smart_farm/models/task.py)
* **Chi tiết thay đổi:**
  * **1. Chuyển đổi dữ liệu Động (Dynamic Task Data):**
    * Loại bỏ hoàn toàn khối HTML tĩnh demo 6 công việc giả lập.
    * Thay bằng vòng lặp QWeb `<t t-foreach="tasks" t-as="task">` truy vấn trực tiếp từ bảng `smart.farm.task` cho ngày hôm nay.
    * Thẻ trạng thái tiêu đề đổi từ `badge-demo` thành `badge-live` với nhãn "Hôm nay".
    * Xử lý trường hợp không có việc với màn hình trống thân thiện (Empty state icon & text).
  * **2. Thao tác một chạm (One-click Interactive Toggle via AJAX):**
    * Người dùng có thể nhấp chuột trực tiếp vào ô vuông checkbox hoặc dòng chữ tiêu đề công việc.
    * Hàm JS `sfToggleTask(taskId, element)` thực hiện cập nhật tức thời (Optimistic UI):
      * Chuyển trạng thái checkbox sang nền xanh lá, hiện dấu tick `✓`.
      * Gạch ngang dòng chữ và làm mờ (`.sf-task-text.done`).
      * Gửi API ngầm `POST /smart_farm/api/task/toggle` cập nhật vào database.
      * Tự động cập nhật bộ đếm tiến độ ở chân thẻ (Ví dụ: `✓ 4 hoàn thành / 2 còn lại`).
      * Cơ chế tự hoàn tác (revert) an toàn nếu gặp sự cố mạng hoặc lỗi máy chủ.
  * **3. Quản trị Odoo Backend:**
    * Bổ sung menu **Smart Farm > Công việc** (`menu_smart_farm_task`).
    * Cung cấp giao diện List view (có boolean toggle), Form view và Search view (lọc Hôm nay, Đã xong, Chưa xong).
  * **4. Quản lý Cache:** Cập nhật `dashboard.css?v=16` và `dashboard.js?v=6`.

