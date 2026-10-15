# Specification: Chế độ Giao diện Tối & Độ Tương Phản Cao (Dark Slate Theme & High-Contrast Mode)

**Feature ID**: `006-dark-mode`  
**Nhánh Git**: `Update-UI-v2`  
**Trạng thái**: Hoàn thiện & Đã nghiệm thu (Implemented & Polished)

---

## 1. Mục tiêu (Objective)
Hiện tại giao diện Smart Farm Dashboard đang sử dụng tông màu Sáng (Light Mode - nền `#eef2f6`, thẻ card `#ffffff`), trên một số màn hình có độ sáng cao hoặc độ tương phản thấp dễ tạo cảm giác chói mắt, bạc màu và khó phân biệt ranh giới giữa các khối thẻ dữ liệu. Khi người dùng chuyển sang Chế độ Tối (Dark Mode), giao diện cần chuyển đổi đồng bộ sang bảng màu **Sleek Slate (High-Contrast Dark Mode)** với nền tối sâu `#0f172a`, card xám than `#1e293b`, viền `#334155` và chữ trắng `#f8fafc`.

Mục tiêu của đợt cập nhật này là:
1. Xử lý triệt để các lỗi hiển thị tương phản (visual contrast defects):
   - **Chữ đen trên nền tối**: Khắc phục các thẻ dữ liệu thời tiết (`.sf-weather-info span`), số liệu thanh an toàn (`.sf-asb-stats b`), tiêu đề tab Công việc/Nhân sự bị chìm màu đen trên nền tối.
   - **Nền trắng chữ trắng**: Khắc phục các item chẵn trong danh sách Cảnh báo (`.sf-alert-item`) bị rơi về nền trắng `#ffffff` trong khi chữ mang màu trắng `#f8fafc`.
   - **Nền trắng lạc quẻ trong Dark Mode**: Khắc phục các card công việc, thanh tìm kiếm, filter pills, dropdown select, modal popup, drawer và thanh cuộn scrollbar trắng toát khi đã chuyển sang giao diện tối.
2. Tích hợp chuyển đổi màu trục tọa độ và lưới động cho Biểu đồ môi trường 24h (`Chart.js`) theo theme.
3. Đồng bộ hoàn chỉnh 100% trên cả 5 Tab (Tổng quan, Công việc, Bản đồ, Kho, Nhân sự) và duy trì qua `localStorage`.

---

## 2. Yêu cầu & Kịch bản người dùng (User Stories & Acceptance Criteria)

### User Story 1: Nút chuyển đổi Giao diện Tối / Sáng tức thời trên Navbar
*Là người quản lý nông trại, tôi muốn có một nút bấm nhanh để chuyển đổi qua lại giữa Giao diện Sáng và Giao diện Tối ngay trên thanh điều hướng để tôi có thể chọn tông màu phù hợp nhất với điều kiện ánh sáng của mắt.*

- **AC 1.1**: Trên thanh Navbar (cạnh nút Quả chuông 🔔 và avatar người dùng), hiển thị một nút toggle tròn thanh lịch với biểu tượng:
  - Khi đang ở giao diện Sáng: hiển thị icon mặt trăng **🌙** (với tooltip *"Chuyển sang Chế độ Tối"*).
  - Khi đang ở giao diện Tối: hiển thị icon mặt trời **☀️** (với tooltip *"Chuyển sang Chế độ Sáng"*).
- **AC 1.2**: Khi người dùng click vào nút, toàn bộ giao diện dashboard chuyển đổi trạng thái màu sắc ngay lập tức mà không cần phải tải lại (reload) trang.
- **AC 1.3**: Hiệu ứng chuyển đổi màu nền và màu thẻ được áp dụng mượt mà (`transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease`).

---

### User Story 2: Bảng màu Dark Slate chuẩn Sleek Slate & Sửa Lỗi Tương Phản
*Là người dùng, tôi muốn khi bật Chế độ Tối thì màu sắc giao diện phải sâu, các khối thẻ nổi rõ, số liệu sắc nét và không có bất kỳ thành phần nào bị chìm chữ hay chói lóa.*

- **AC 2.1**: **Nền chính trang** (`body`, `.sf-wrap`, `.sf-navbar-sticky`): chuyển sang tông Slate tối sâu `#0f172a` (hoặc `#111827`).
- **AC 2.2**: **Thanh Navbar & Thẻ Card** (`.sf-navbar`, `.sf-card`, `.sf-stat-card`, `.sf-map-card-pro`): chuyển sang nền xám than `#1e293b` với viền sắc nét `#334155` cùng bóng đổ mờ nhẹ tạo chiều sâu 3D.
- **AC 2.3**: **Chữ & Số liệu**:
  - Tiêu đề chính, số liệu quan trắc to (`24.4°C`, `12.4 ha`, `0 bản ghi`): chuyển sang màu trắng sáng `#f8fafc`.
  - Nhãn phụ, thông tin chú thích: chuyển sang xám bạc dịu mắt `#94a3b8`.
  - **Sửa triệt để**: Toàn bộ nhãn số liệu trong thẻ Thời tiết (`.sf-weather-info span` - gió, độ ẩm, vị trí TP. Hà Nội) và số liệu thanh an toàn (`.sf-asb-stats b`) hiển thị màu trắng sáng `#f8fafc`, không còn chữ đen trên nền tối.
- **AC 2.4**: **Thẻ Thời tiết & Dự báo 4 ngày**:
  - Dải 4 ô dự báo động (`.sf-fc-day`): chuyển sang nền `#334155`, viền `#475569`, chữ trắng, hover sáng nhẹ.
  - Lời khuyên nông nghiệp: chuyển sang nền `#064e3b` / viền `#059669` / chữ `#6ee7b7` thanh nhã trên nền tối.
- **AC 2.5**: **Danh sách Cảnh báo & Log (Alert List)**:
  - Tất cả các item (`.sf-alert-item`) kể cả hàng chẵn và lẻ đều mang nền tối đồng nhất (`#1e293b` cho chẵn, `#273549` cho lẻ, hover `#334155`, viền `#334155`).
  - Triệt tiêu 100% lỗi nền trắng chữ trắng ở các dòng cảnh báo đã xử lý và chưa xử lý.
  - Cảnh báo đã hoàn thành (`.sf-resolved`) mang màu xám `#64748b` gạch ngang nhẹ nhàng, tag `Đã xong` mang màu xám dịu `#94a3b8`.
- **AC 2.6**: **Thanh cuộn đồng bộ (Dark Scrollbars)**:
  - Áp dụng `color-scheme: dark` và CSS scrollbar custom: track `#0f172a`, thumb `#334155`, hover `#475569`.
  - Triệt tiêu hoàn toàn hiện tượng thanh cuộn trắng bệch mặc định của trình duyệt trên danh sách công việc và thông báo.

---

### User Story 3: Đồng bộ toàn diện trên các Tab, Modal, Drawer & Biểu Đồ
*Là người dùng, khi tôi chuyển sang bất kỳ tab hay mở popup nào trong Chế độ Tối, toàn bộ giao diện đều phải khoác giao diện tối đồng nhất.*

- **AC 3.1**: **Tab Quản lý Công việc (`tab-tasks`)**: Card quản lý, thanh toolbar tìm kiếm, ô search input, filter pills (Tất cả / Chưa xong / Đã xong), dropdown danh mục, và các thẻ công việc kéo thả (`.sf-task-card`) đều chuyển sang nền tối `#1e293b`/`#0f172a`, viền `#334155`, chữ trắng sáng `#f8fafc`.
- **AC 3.2**: **Tab Bản đồ (`tab-map`)**: Thanh công cụ điều khiển lớp bản đồ (`.sf-map-toolbar`), các nút bộ lọc lớp (`.sf-layer-btn`), zone tag và drawer thông tin đều mang tông Dark Slate.
- **AC 3.3**: **Tab Nhân sự (`tab-staff`)**: Khối hero, 3 thẻ KPI nhân sự, thanh tìm kiếm nhân viên, nút phân quyền và thẻ nhân viên chuyển sang giao diện tối hoàn hảo.
- **AC 3.4**: **Hộp thoại (Modals) & Bảng trượt (Drawers)**: Modal thêm công việc (`#sf-task-modal`), Modal hồ sơ người dùng (`#sf-profile-modal`), Zone Drawer (`#sf-zone-drawer`), Plant Drawer (`#sf-plant-drawer`) và Task Detail Drawer đều hiển thị nền `#1e293b`, header `#0f172a`, form input `#0f172a`, label sáng rõ `#cbd5e1`.
- **AC 3.5**: **Biểu đồ Môi trường 24h (`historyChart`)**: Trục nhiệt độ và độ ẩm, nhãn thời gian và đường lưới grid tự động chuyển sang màu sáng `#94a3b8` / `#334155` khi bật Dark Mode, và về lại màu sáng khi tắt.

---

### User Story 4: Ghi nhớ trạng thái qua `localStorage` & Chống Chớp Trắng
- **AC 4.1**: Lựa chọn của người dùng được lưu trữ tự động vào `localStorage.setItem('sf_theme', 'dark' | 'light')`.
- **AC 4.2**: Script nạp sớm (Zero-FOUC) trong `<head>` kích hoạt class `sf-dark-mode` ngay khi trang bắt đầu tải, không xuất hiện hiện tượng chớp trắng.

---

## 3. Các trường hợp ngoại lệ (Edge Cases)

1. **Canvas 3D Nhà Màng & Bản Đồ Tọa Độ**: Nền canvas Three.js và bản đồ tương tác vẫn hoạt động mượt mà; HUD card và HUD guide nổi bật với nền tối mờ kính `rgba(15, 23, 42, 0.9)`.
2. **Toast Notification**: Card Toast nổi bật trên nền tối với viền và shadow rõ ràng, giữ trọn thanh tiến trình đếm ngược.
3. **Trình duyệt ở Chế độ Ẩn danh (Private/Incognito)**: Nếu `localStorage` bị hạn chế ghi, hệ thống không gây ra lỗi JavaScript trong console mà tự động áp dụng theme cho phiên làm việc hiện tại.

---

## 4. Kế hoạch nghiệm thu trực quan (Acceptance Verification)

- **Bước kiểm thử 1**: Mở `http://localhost:8060/smart_farm/dashboard`, nhấp nút 🌙.
- **Kiểm tra Thẻ Thời tiết**: Chữ "Gió: 3.6 km/h", "Độ ẩm: 96%", "TP. Hà Nội" hiển thị màu trắng sáng rõ nét, không bị đen trên nền tối.
- **Kiểm tra Thẻ Cảnh báo & Log**: Tất cả 5 dòng cảnh báo hiển thị trên nền tối xen kẽ (`#1e293b` và `#273549`). Item "Đã xong" hiển thị chữ gạch ngang rõ ràng, hoàn toàn không có nền trắng chữ trắng.
- **Kiểm tra Thanh cuộn**: Thanh cuộn trong danh sách công việc hiển thị tông xám than `#334155`, ăn nhập hoàn toàn với nền tối.
- **Kiểm tra chuyển Tab**: Chuyển sang Tab "Công việc", "Bản đồ", "Nhân sự" $\rightarrow$ Tất cả đều mang nền tối `#1e293b`, 0 thành phần bị nền trắng lạc loài.
- **Kiểm tra F5**: Nhấn F5 $\rightarrow$ Giao diện giữ nguyên Chế độ Tối, không bị giật/chớp trắng.
