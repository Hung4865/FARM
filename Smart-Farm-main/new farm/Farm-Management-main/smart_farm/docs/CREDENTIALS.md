# 📋 Thông Tin Hệ Thống, Tài Khoản & Đường Dẫn Web (Smart Farm)

Tài liệu này lưu trữ toàn bộ thông tin đăng nhập, liên kết truy cập web và hướng dẫn vận hành cho module **smart_farm** (Odoo 18).

---

## 🌐 1. Danh sách đường dẫn Web (URLs)

| Chức năng | Đường dẫn (URL) | Ghi chú |
| :--- | :--- | :--- |
| **Trang đăng nhập Odoo** | [http://localhost:8060/web/login](http://localhost:8060/web/login) | Trang đăng nhập hệ thống chính |
| **Giao diện Dashboard Nông Trại** | [http://localhost:8060/smart_farm/dashboard](http://localhost:8060/smart_farm/dashboard) | Giao diện điều khiển, theo dõi chỉ số & công việc |
| **Quản lý Database (Database Manager)** | [http://localhost:8060/web/database/manager](http://localhost:8060/web/database/manager) | Tạo mới, Sao lưu (Backup), Khôi phục (Restore), Xóa DB |
| **API GPS Cảm Biến** | [http://localhost:8060/smart_farm/api/gps](http://localhost:8060/smart_farm/api/gps) | Endpoint nhận/gửi dữ liệu định vị |

---

## 🔐 2. Thông tin tài khoản & Cơ sở dữ liệu (Database)

| Thông tin | Giá trị | Chi tiết |
| :--- | :--- | :--- |
| **Tên Database (Database Name)** | `Farm` | CSDL chính của hệ thống |
| **Email đăng nhập** | `admin123@gmail.com` | Tài khoản Quản trị viên (Administrator) |
| **Mật khẩu đăng nhập** | `abc123` *(hoặc `admin123`)* | Mật khẩu tài khoản (6 ký tự đã nhập trên form) |
| **Master Password (Đã thiết lập)** | `abc123` | Dùng khi thao tác tại Database Manager |
| **Master Password (Mã tự sinh Odoo)** | `hcd2-8tdq-fbcp` | Mã dự phòng hệ thống Odoo tự sinh ra ban đầu |
| **Ngôn ngữ (Language)** | `English (US)` | Ngôn ngữ giao diện |
| **Quốc gia (Country)** | `Vietnam` | Thiết lập múi giờ & định dạng vùng |
| **Demo Data** | Không kích hoạt (False) | Dữ liệu sạch, không chứa data mẫu mặc định |

> [!TIP]
> **Về Master Password:**  
> Khi bạn muốn Backup (Sao lưu), Restore (Khôi phục) hoặc Duplicate (Nhân bản) CSDL, Odoo sẽ hỏi **Master Password**. Hãy dùng mật khẩu `abc123`. Nếu Odoo không nhận, hãy dùng mã dự phòng gốc do hệ thống sinh: `hcd2-8tdq-fbcp`.

---

## 🚀 3. Hướng dẫn khởi động & Quản lý Service (Docker)

Thư mục chạy Docker Compose:
`"new farm/Farm-Management-main"`

### Khởi động hệ thống:
```bash
cd "new farm/Farm-Management-main"
docker compose up -d
```

### Dừng hệ thống:
```bash
cd "new farm/Farm-Management-main"
docker compose down
```

### Xem logs kiểm tra hệ thống:
```bash
cd "new farm/Farm-Management-main"
docker compose logs -f web
```
