# FEATURE DEVELOPMENT LIFECYCLE POLICY (QUY TRÌNH PHÁT TRIỂN TÍNH NĂNG)

## CRITICAL — MANDATORY PROJECT WORKFLOW RULE

Đây là **quy trình làm việc bắt buộc (Mandatory Workflow)** áp dụng cho tất cả các tính năng / phần việc mới trong dự án. 
Bạn **BẮT BUỘC** phải tuân thủ nghiêm ngặt từng bước tuần tự sau đây và **KHÔNG ĐƯỢC NHẢY CÓC**.

---

## 4 BƯỚC TUẦN TỰ BẮT BUỘC TRONG LIFECYCLE

### Bước 1: Khởi tạo Đặc tả Tính năng (`spec.md`)
- Khi người dùng yêu cầu làm một phần/tính năng mới, việc đầu tiên **DUY NHẤT** là tạo file `spec.md` (bao gồm: Mục tiêu, User Stories với Acceptance Criteria cụ thể, Edge Cases).
- **Điểm dừng bắt buộc (Stop Point)**: Sau khi tạo `spec.md`, **DỪNG LẠI**, thông báo cho người dùng xem lại spec và chờ phản hồi.
- **NGHIÊM CẤM**: Không tự ý tạo `plan.md` hay `tasks.md` hoặc viết code ở bước này.

### Bước 2: Lập Kế hoạch Kiến trúc Kỹ thuật (`plan.md`)
- **ĐIỀU KIỆN TIÊN QUYẾT**: **CHỈ KHI NGƯỜI DÙNG XÁC NHẬN `spec.md` ĐÃ ỔN / ĐÃ ĐỒNG Ý**, mới được phép chuyển sang bước này.
- Tiến hành tạo file `plan.md` (bao gồm: Kiến trúc Backend/Frontend, Database Model, API endpoints, Luồng xử lý và Kế hoạch kiểm thử).
- Sau khi hoàn thành `plan.md`, tiếp tục chuyển sang bước 3 lập task.

### Bước 3: Bóc tách Danh sách Công việc (`tasks.md`) theo Chuẩn 4 Bước
- Sau khi `plan.md` đã sẵn sàng, bóc tách toàn bộ công việc thành các **Subtask**.
- **QUY CHUẨN 4 BƯỚC BẮT BUỘC CHO MỖI SUBTASK**:
  Mỗi Subtask phải chia rõ ràng thành 4 bước con tuần tự:
  1. **Bước 1: Xử lý code** (`[developer]` Triển khai mã nguồn logic, template, css, js).
  2. **Bước 2: Review diff** (`[code-reviewer]` Soi git diff, kiểm tra syntax, regex, không thừa/thiếu code).
  3. **Bước 3: Lập trình viên nghiệm thu F5 Odoo** (Chờ lập trình viên kiểm tra trực tiếp trên trình duyệt F5 Odoo, xác nhận 0 visual regression hoặc đúng yêu cầu).
  4. **Bước 4: Commit** (Tạo git commit với message chuẩn conventional commit: `type(scope): subtask X - description`).
- Trình bày danh sách công việc `tasks.md` cho người dùng xem và xác nhận.

### Bước 4: Triển khai Mã nguồn (Implementation / Coding)
- **ĐIỀU KIỆN TIÊN QUYẾT TUYỆT ĐỐI**: **CHỈ ĐƯỢC PHÉP BẮT ĐẦU VIẾT CODE KHI NGƯỜI DÙNG BẢO BẮT ĐẦU TRIỂN KHAI CODE** (ví dụ: "triển khai code đi", "bắt đầu code nhé", "implement đi", v.v.).
- **NGHIÊM CẤM TUYỆT ĐỐI**: Không tự ý sửa đổi hoặc tạo mới file code (Python, XML, JS, CSS,...) trước khi có hiệu lệnh bắt đầu triển khai code từ người dùng.

---

## QUY ĐỊNH VỀ GIT COMMIT & PUSH

1. **Quyền Commit**: AI **ĐƯỢC PHÉP** tạo git commit (`git commit -m "..."`) tương ứng ở Bước 4 của từng Subtask sau khi lập trình viên đã nghiệm thu ở Bước 3.
2. **Nghiêm cấm Git Push**: AI **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP CHẠY LỆNH `git push`** hoặc các lệnh đưa code lên remote dưới bất kỳ hình thức nào. Việc push code và quản lý nhánh từ xa **HOÀN TOÀN do người dùng tự thực hiện**.
