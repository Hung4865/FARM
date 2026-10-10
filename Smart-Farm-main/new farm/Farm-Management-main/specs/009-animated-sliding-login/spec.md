# Feature Specification: Giao Diện Đăng Nhập & Đăng Ký Trượt Kép Hiện Đại (Modern Animated Sliding Auth Screen)

**Feature Branch**: `009-animated-sliding-login`  
**Created**: 2026-10-10  
**Status**: Chờ Duyệt Đặc Tả (Bước 1 của Lifecycle Policy)  
**Input**: Yêu cầu thay đổi toàn diện giao diện trang đăng nhập mặc định của Odoo (`/web/login`) sang thiết kế giao diện kép cao cấp với hiệu ứng chuyển động trượt mượt mà (Double Sliding Overlay Panel Animation), lấy cảm hứng trực tiếp từ 2 ảnh mẫu thiết kế (Ảnh 1: Form Đăng ký + Overlay Trái; Ảnh 2: Form Đăng nhập + Overlay Phải). Khi người dùng nhấn nút chuyển đổi ("SIGN IN" hoặc "SIGN UP"), lớp panel overlay xanh lá và các form sẽ trượt hoán đổi vị trí qua lại sống động.

---

## 1. Mục Tiêu (Objective)

1. **Xóa Bỏ Giao Diện Đăng Nhập Mặc Định Cũ Của Odoo**: Thay thế toàn bộ khung login đơn điệu bằng trải nghiệm người dùng (UX) hiện đại, đậm chất công nghệ nông nghiệp thông minh.
2. **Thiết Kế Hai Trạng Thái Chuẩn Theo Ảnh Mẫu**:
   - **Trạng thái Đăng Nhập (Sign In Mode - Ảnh 2)**:
     - *Nửa Trái (Form trắng)*: Logo Smart Farm, Tiêu đề *"Sign in to Smart Farm"*, các nút liên kết mạng xã hội (Google, Facebook, LinkedIn), trường nhập Email (icon phong bì), Mật khẩu (icon ổ khóa), liên kết *"Forgot your password?"*, và nút bấm *"SIGN IN"* xanh ngọc nguyên khối.
     - *Nửa Phải (Panel Overlay Xanh)*: Nền gradient xanh ngọc nông nghiệp sinh thái (`#10b981` đến `#0d9488`) có họa tiết hình học chìm, Tiêu đề *"Hello, Friend!"*, dòng mô tả *"Enter your personal details and start journey with us"*, và nút bấm viền trắng *"SIGN UP"*.
   - **Trạng thái Đăng Ký (Sign Up Mode - Ảnh 1)**:
     - *Nửa Trái (Panel Overlay Xanh)*: Nền gradient xanh ngọc với họa tiết hình học chìm, Tiêu đề *"Welcome Back!"*, dòng mô tả *"To keep connected with us please login with your personal info"*, và nút bấm viền trắng *"SIGN IN"*.
     - *Nửa Phải (Form trắng)*: Tiêu đề *"Create Account"*, các nút mạng xã hội, trường nhập Họ tên (icon người dùng), Email (icon phong bì), Mật khẩu (icon ổ khóa), và nút bấm *"SIGN UP"* xanh ngọc nguyên khối.
3. **Động Cơ Hiệu Ứng Chuyển Động Trượt Kép (Double Sliding Animation)**:
   - Khi bấm nút *"SIGN UP"* ở trạng thái Đăng nhập: Khung overlay xanh trượt mượt mà từ phải sang trái (0.6s `ease-in-out`), form Đăng nhập trượt nhẹ và mờ dần, form Đăng ký trượt vào từ bên phải và hiện rõ.
   - Khi bấm nút *"SIGN IN"* ở trạng thái Đăng ký: Khung overlay xanh trượt từ trái sang phải, form Đăng ký ẩn đi và form Đăng nhập trượt vào vị trí cũ.
   - Hiệu ứng thị giác thị sai (Parallax / Content Shift): Các nội dung văn bản bên trong panel overlay chuyển động ngược chiều với hướng trượt của panel để tạo cảm giác chiều sâu 3D cao cấp.
4. **Tích Hợp Xác Thực Odoo 18 Hoàn Hảo**:
   - Gửi dữ liệu form qua phương thức `POST` tới endpoint `/web/login`.
   - Bảo toàn đầy đủ token CSRF (`csrf_token()`) và tham số `redirect` (tự động điều hướng thẳng vào `/smart_farm/dashboard` sau khi đăng nhập thành công).
   - Xử lý và hiển thị thông báo lỗi đẹp mắt (sai mật khẩu, sai email, tài khoản bị khóa) trực tiếp trên form mà không làm mất hiệu ứng trượt.
5. **Khả Năng Thích Ứng Thiết Bị (Responsive Design)**:
   - Trên Desktop/Laptop: Hiển thị đầy đủ 2 cột (50% - 50%) và kích hoạt hiệu ứng trượt ngang.
   - Trên Mobile/Tablet nhỏ (< 768px): Tự động chuyển đổi mượt mà sang dạng Tabs chuyển đổi hoặc xếp tầng dọc thông minh, vẫn bảo đảm thẩm mỹ và dễ thao tác cảm ứng.

---

## 2. User Stories & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### User Story 1: Trải nghiệm Giao diện Đăng nhập Hiện đại (Sign In State - Ảnh 2) (Priority: P1)
Là người vận hành hoặc khách tham quan, khi truy cập vào đường dẫn đăng nhập hệ thống, tôi muốn nhìn thấy một giao diện đăng nhập cao cấp, trực quan với màu sắc chủ đạo xanh nông nghiệp thông minh.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** người dùng chưa đăng nhập mở URL `/web/login`, **When** trang tải xong, **Then** hiển thị thẻ container bo tròn góc lớn (20px), đổ bóng mờ sang trọng trên nền xám nhạt (`#f1f5f9`).
  2. **Given** giao diện ở trạng thái mặc định, **When** quan sát bên trái, **Then** form hiển thị logo Smart Farm, tiêu đề *"Sign in to Smart Farm"*, các trường nhập liệu Email và Mật khẩu có placeholder và icon trực quan.
  3. **Given** giao diện ở trạng thái mặc định, **When** quan sát bên phải, **Then** panel xanh gradient hiển thị dòng chữ chào mừng *"Hello, Friend!"* kèm nút bấm outline trắng *"SIGN UP"*.
  4. **Given** người dùng nhập đúng tài khoản (`admin123@gmail.com` / `abc123`) và bấm *"SIGN IN"*, **Then** hệ thống xác thực thành công và tự động chuyển hướng người dùng vào `/smart_farm/dashboard`.

---

### User Story 2: Hiệu ứng Chuyển động Trượt Chuyển sang Màn hình Đăng ký (Sign Up State - Ảnh 1) (Priority: P1)
Là người dùng muốn tạo tài khoản mới, khi tôi bấm vào nút "SIGN UP" trên panel màu xanh, tôi muốn nhìn thấy hiệu ứng trượt mượt mà chuyển sang form đăng ký mà không cần tải lại trang.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** đang ở màn hình Đăng nhập (Ảnh 2), **When** người dùng nhấp nút *"SIGN UP"* trên panel xanh bên phải, **Then** container nhận class kích hoạt hiệu ứng (ví dụ: `.right-panel-active`).
  2. **Given** hiệu ứng được kích hoạt, **When** quan sát trong 0.6 giây, **Then** panel màu xanh trượt êm ái sang bên trái, đồng thời form Đăng ký *"Create Account"* xuất hiện ở bên phải (chính xác như Ảnh 1).
  3. **Given** đang ở màn hình Đăng ký (Ảnh 1), **When** người dùng nhấp nút *"SIGN IN"* trên panel xanh bên trái, **Then** panel xanh trượt trở lại bên phải, đưa giao diện về trạng thái Đăng nhập ban đầu (Ảnh 2).
  4. **Given** thao tác bấm nút trượt nhiều lần, **When** diễn ra liên tục, **Then** không xảy ra hiện tượng chớp nháy (flicker), vỡ layout hay tràn lề màn hình (`overflow: hidden`).

---

### User Story 3: Xử lý Xác thực, Phản hồi Lỗi & Ghi nhớ Đăng nhập (Priority: P1)
Là người dùng nhập sai thông tin đăng nhập, tôi muốn nhận được thông báo lỗi rõ ràng, tinh tế ngay trên giao diện mà không làm mất bố cục hay hiệu ứng.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** người dùng nhập sai mật khẩu hoặc tài khoản không tồn tại, **When** bấm nút *"SIGN IN"*, **Then** hệ thống hiển thị thông báo lỗi nền đỏ nhạt bo góc ngay phía trên các trường nhập liệu với nội dung thân thiện (ví dụ: *"Tài khoản hoặc mật khẩu không chính xác"*).
  2. **Given** sau khi hiển thị lỗi, **When** người dùng thao tác chuyển đổi qua lại giữa Sign In và Sign Up, **Then** các form vẫn hoạt động bình thường, thông báo lỗi tự động ẩn hoặc cập nhật tương ứng.
  3. **Given** người dùng nhấn liên kết *"Forgot your password?"*, **When** click, **Then** mở popup hoặc điều hướng tới trang khôi phục mật khẩu hỗ trợ gửi email reset.

---

### User Story 4: Tinh Chỉnh Thẩm Mỹ & Trải Nghiệm Responsive Đa Thiết Bị (Priority: P2)
Là người dùng truy cập từ điện thoại di động hoặc máy tính bảng, tôi muốn trang đăng nhập tự co dãn vừa vặn, nút bấm to rõ và dễ thao tác bằng ngón tay.

* **Tiêu chí nghiệm thu (Acceptance Scenarios)**:
  1. **Given** màn hình Desktop (≥ 992px), **Then** kích thước container cố định chuẩn ~768px - 850px, chiều cao ~500px, 2 cột 50/50 cân đối và hiệu ứng trượt đầy đủ.
  2. **Given** màn hình Mobile (< 768px), **Then** bố cục tự động chuyển sang dạng responsive thông minh: overlay hiển thị linh hoạt hoặc thanh chuyển tab [Đăng nhập | Đăng ký] ở trên đầu để người dùng vuốt chạm thuận tiện.
  3. **Given** các nút bấm và ô input, **When** di chuột (hover) hoặc nhấp chuột (focus), **Then** có hiệu ứng chuyển màu, viền xanh phát sáng dịu mắt (`outline/box-shadow focus ring`).

---

## 3. Edge Cases & Xử Lý Ngoại Lệ

1. **Hệ thống có nhiều Cơ sở dữ liệu (Multi-Database)**: Nếu Odoo chưa chọn CSDL mặc định, hệ thống tự động gắn selector database kín đáo hoặc tự động chọn database `Farm` theo cấu hình.
2. **Trình duyệt tắt Javascript**: Nếu client không kích hoạt JS, form Sign In mặc định vẫn hiển thị đầy đủ và cho phép submit POST truyền thống để đảm bảo tính sẵn sàng.
3. **Mạng chậm hoặc Đang xử lý đăng nhập**: Khi bấm *"SIGN IN"*, nút hiển thị trạng thái loading xoay tròn nhẹ và tạm thời disable để tránh việc người dùng nhấp đúp (anti-double submit).
4. **Trường Đăng ký người dùng (Sign Up)**: Trong trường hợp Odoo chưa bật tính năng cho phép đăng ký tự do (bảng `auth_signup`), form Sign Up sẽ thông báo hướng dẫn liên hệ quản trị viên hoặc tích hợp API tạo tài khoản chờ duyệt.
