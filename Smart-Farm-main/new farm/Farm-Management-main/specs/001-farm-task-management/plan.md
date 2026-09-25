# Implementation Plan: Quản lý Công việc Nông trại (Farm Task Management)

**Branch**: `001-farm-task-management` | **Date**: 2026-09-26 | **Spec**: [`spec.md`](./spec.md)

---

## 1. Tóm tắt giải pháp kỹ thuật (Summary)

Xây dựng module con quản lý công việc trong `smart_farm`:
1. **Model ORM**: Tạo model `smart.farm.task` lưu trữ thông tin công việc, phân loại, trạng thái hoàn thành và ngày thực hiện.
2. **Security**: Cấu hình quyền truy cập CRUD trong `security/ir.model.access.csv`.
3. **Backend Views**: Tạo List view, Form view, Search view và Menuitem trong `views/task_views.xml`.
4. **Dashboard Controller & API**:
   - Cập nhật hàm `dashboard` trong `controllers/main.py` để query các task có ngày là hôm nay (`date = fields.Date.today()`).
   - Tạo endpoint API `POST /smart_farm/api/task/toggle` nhận `task_id` và cập nhật trường `is_done`.
5. **Dashboard Frontend**:
   - Cập nhật QWeb template trong `views/dashboard.xml` để render động danh sách task.
   - Bổ sung hàm Javascript trong `static/src/js/dashboard.js` xử lý sự kiện click checkbox và gửi AJAX cập nhật mượt mà.

---

## 2. Thông số kỹ thuật (Technical Context)

* **Nền tảng**: Odoo 18, Python 3, PostgreSQL 15, QWeb, Vanilla JS, CSS3.
* **Thời gian đáp ứng**: API toggle task < 100ms.
* **Tương thích**: Tích hợp đồng bộ với thiết kế giao diện hiện tại của Dashboard.

---

## 3. Cấu trúc thư mục & File thay đổi

```text
smart_farm/
├── models/
│   ├── __init__.py           # [Sửa] import task
│   └── task.py               # [Mới] Model smart.farm.task
├── views/
│   ├── menu.xml              # [Sửa] Thêm menuitem Công việc
│   ├── dashboard.xml         # [Sửa] Render task động thay cho demo hardcode
│   └── task_views.xml        # [Mới] List, Form, Search view cho task
├── controllers/
│   └── main.py               # [Sửa] Query task hôm nay + API /smart_farm/api/task/toggle
├── static/src/js/
│   └── dashboard.js          # [Sửa] Hàm sfToggleTask() gửi AJAX
├── security/
│   └── ir.model.access.csv   # [Sửa] Cấp quyền cho smart.farm.task
└── __manifest__.py           # [Sửa] Đăng ký task_views.xml vào mục data
```

---

## 4. Thiết kế chi tiết Entity & API

### Entity: `smart.farm.task`
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `name` | `fields.Char` (required=True) | Tiêu đề công việc |
| `task_type` | `fields.Selection` | `[('irrigation', 'Tưới tiêu'), ('sensor', 'Cảm biến'), ('gps', 'GPS'), ('season', 'Mùa vụ'), ('inventory', 'Kho'), ('report', 'Báo cáo')]` |
| `date` | `fields.Date` (default=fields.Date.today) | Ngày thực hiện |
| `is_done` | `fields.Boolean` (default=False) | Trạng thái hoàn thành |
| `user_id` | `fields.Many2one('res.users')` | Người phụ trách |
| `notes` | `fields.Text` | Ghi chú chi tiết |

### API Endpoint: `/smart_farm/api/task/toggle`
* **Method**: `POST`
* **Auth**: `user`
* **Input (JSON)**: `{"task_id": 12}`
* **Output (JSON)**: `{"success": true, "is_done": true, "unresolved_tasks": 2, "resolved_tasks": 4}`
