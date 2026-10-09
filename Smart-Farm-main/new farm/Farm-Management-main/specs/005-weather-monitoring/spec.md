# Feature Specification: Hệ thống Giám sát & Dự báo Thời tiết Nông nghiệp Thông minh (Smart Farm Weather & Agri-Forecast Center)

**Feature Branch**: `005-weather-monitoring`  
**Created**: 2026-10-10  
**Status**: In Progress (Spec Review - Chờ lập trình viên phê duyệt)  
**Input**: Nâng cấp thẻ "Thời tiết" trên Dashboard từ giao diện hiển thị bán tĩnh (hiện tại dự báo các ngày tới đang gán cứng 29°, 28°, 30°) thành Trung tâm Giám sát & Dự báo Thời tiết Nông nghiệp Thông minh toàn diện: tích hợp dữ liệu thời tiết thực tế từ trạm khí tượng/Open-Meteo API, dự báo động nhiều ngày kèm icon thời tiết sinh động, cơ chế làm mới 1-chạm không reload trang, lưu trữ đồng bộ vào CSDL Odoo và đưa ra các khuyến nghị/cảnh báo thời tiết chuyên biệt cho canh tác nông nghiệp.

---

## 1. Mục tiêu (Objective)

1. **Dữ liệu Hiện tại Thực tế tại TP. Hà Nội (Real-Time Weather in Hanoi)**:
   - Thu thập và hiển thị chính xác dữ liệu khí tượng thực tế tại **Thành phố Hà Nội** (Tọa độ địa lý: Vĩ độ `21.0285°N`, Kinh độ `105.8542°E`).
   - Hiển thị nhiệt độ hiện tại (°C), tốc độ gió (km/h), độ ẩm không khí (%), và tên địa danh hiển thị rõ ràng là **"TP. Hà Nội"**.
   - Bổ sung icon thời tiết đồ họa trực quan (Nắng vàng ☀️, Nhiều mây ⛅, Mưa rào 🌧️, Dông bão ⛈️, Sương mù 🌫️) phản ánh đúng mã thời tiết (WMO Weather Code) thực tế tại Hà Nội từ Open-Meteo API.
2. **Dự báo Đa ngày Động Thực tế tại Hà Nội (Dynamic Multi-Day Forecast)**:
   - Thay thế hoàn toàn các con số nhiệt độ fix cứng (29°, 28°, 30°) bằng dữ liệu dự báo động 4 ngày tới của khu vực Hà Nội: ngày trong tuần, icon thời tiết, dải nhiệt độ thực tế theo dự báo khí tượng.
3. **Cơ chế Làm mới Dữ liệu 1-Chạm (Instant 1-Click Refresh)**:
   - Tích hợp nút làm mới 🔄 ngay trên tiêu đề thẻ thời tiết. Khi người dùng click, hệ thống tự động gọi API lấy số liệu thời tiết Hà Nội mới nhất, lưu vào bảng `smart.farm.weather` trong PostgreSQL và cập nhật lại giao diện ngay tức thì mà không cần tải lại toàn bộ trang web.
4. **Cảnh báo & Khuyến nghị Nông nghiệp Thông minh (Agri-Weather Advice)**:
   - Dựa trên điều kiện thời tiết thực tế tại Hà Nội để đưa ra lời khuyên nông vụ trực quan (ví dụ: *"Độ ẩm cao >90%: Đề phòng nấm bệnh lá, hạn chế tưới phun sương"*, *"Nhiệt độ >35°C: Kéo mái che tự động và kích hoạt quạt thông gió"*).
5. **Độ Bền vững Dữ liệu & Khả năng Hoạt động Ngoại tuyến (Offline Resilience)**:
   - Mọi lần cập nhật thành công đều được lưu bản ghi vào `smart.farm.weather`.
   - Nếu trạm khí tượng bên ngoài gặp sự cố hoặc mất kết nối mạng, hệ thống tự động fallback sang bản ghi gần nhất trong cơ sở dữ liệu Odoo kèm badge nhận biết rõ ràng (`Trực tiếp` vs `Từ DB`), tuyệt đối không làm gãy vỡ layout Dashboard.

---

## 2. User Scenarios & Testing (Ưu tiên theo P1, P2)

### User Story 1 - Xem Dữ liệu Thời tiết Thực tế tại TP. Hà Nội kèm Icon Trực quan (Priority: P1)
Là người quản lý nông trại, khi truy cập Dashboard, tôi muốn thấy thông số thời tiết thực tế tại Thành phố Hà Nội hiện tại kèm icon đồ họa sinh động phản ánh đúng bầu trời thực tế để nhanh chóng nắm bắt điều kiện canh tác tại nông trại.
* **Acceptance Scenarios**:
  1. **Given** người dùng mở Dashboard, **When** hệ thống tải thẻ Thời tiết, **Then** hiển thị nhiệt độ lớn rõ ràng, tốc độ gió (km/h), độ ẩm (%), địa danh rõ ràng **"TP. Hà Nội"** và icon thời tiết tương ứng (Nắng ☀️, Mây ⛅, Mưa 🌧️).
  2. **Given** nguồn dữ liệu lấy trực tiếp từ API khí tượng Open-Meteo theo tọa độ Hà Nội (`lat=21.0285, lon=105.8542`), **When** hiển thị trên thẻ, **Then** huy hiệu nguồn hiển thị nhãn xanh lá *"Trực tiếp"*.

---

### User Story 2 - Dự báo Thời tiết Động 4 Ngày Tới tại Hà Nội (Priority: P1)
Là người lên kế hoạch sản xuất, tôi muốn xem dự báo thời tiết cho các ngày tới tại Hà Nội (Hôm nay, Ngày mai, Ngày kia, Ngày sau) với số liệu nhiệt độ thực tế lấy từ dự báo khí tượng thay vì các con số mặc định cố định.
* **Acceptance Scenarios**:
  1. **Given** API Open-Meteo trả về mảng dự báo hàng ngày của Hà Nội (`daily forecast`), **When** render thẻ thời tiết, **Then** 4 ô dự báo hiển thị đúng thứ/ngày, nhiệt độ dự báo tương ứng và icon thời tiết từng ngày.
  2. **Given** nhiệt độ các ngày khác nhau, **When** quan sát, **Then** không còn hiện tượng trùng lặp cứng nhắc (29°, 28°, 30°) mà hiển thị chính xác theo diễn biến thời tiết thực tại Hà Nội.

---

### User Story 3 - Nút Làm mới Dữ liệu Thời tiết 1-Chạm (Priority: P1)
Là nhân viên theo dõi nông trại, khi muốn cập nhật số liệu thời tiết mới nhất mà không muốn phải nhấn F5 làm mới lại toàn bộ Dashboard, tôi muốn bấm một nút làm mới ngay trên card.
* **Acceptance Scenarios**:
  1. **Given** người dùng ở trên Dashboard, **When** click nút 🔄 (Làm mới) trên header thẻ thời tiết, **Then** icon xoay nhẹ hiệu ứng tải, gửi yêu cầu cập nhật ngầm đến backend Odoo.
  2. **Given** backend gọi API thành công, **When** nhận phản hồi JSON, **Then** các chỉ số nhiệt độ, độ ẩm, gió, icon và dự báo trên thẻ cập nhật tức thì, hiển thị Toast thông báo *"Đã cập nhật dữ liệu thời tiết mới nhất!"*.
  3. **Given** mất kết nối mạng ngoài, **When** bấm làm mới, **Then** hiển thị thông báo nhẹ nhàng *"Không thể kết nối trạm thời tiết, đang dùng dữ liệu lưu trữ"* và giữ nguyên giao diện hiện có.

---

### User Story 4 - Gợi ý Khuyến nghị Nông nghiệp Theo Thời tiết (Agri-Advice) (Priority: P2)
Là kỹ sư nông nghiệp, tôi muốn nhận được các gợi ý canh tác nhanh ngay dưới thông số thời tiết để điều chỉnh chế độ chăm sóc cây trồng kịp thời.
* **Acceptance Scenarios**:
  1. **Given** độ ẩm không khí vượt quá 85%, **When** xem widget thời tiết, **Then** hiển thị gợi ý nhỏ *"⚠️ Độ ẩm cao: Chú ý thông gió nhà màng, giảm tưới phun"*.
  2. **Given** trời nắng gắt nhiệt độ > 34°C, **When** xem widget, **Then** hiển thị gợi ý *"☀️ Nắng gắt: Nên kích hoạt hệ thống mái che và quạt đối lưu"*.
  3. **Given** thời tiết thuận hòa (24°C - 30°C, ẩm 60% - 75%), **When** xem widget, **Then** hiển thị nhãn xanh *"🌿 Thời tiết lý tưởng cho sinh trưởng cây trồng"*.

---

### User Story 5 - Lưu Trữ Bền Vững Lịch Sử Thời Tiết & Chế Độ Fallback (Priority: P2)
Là quản trị viên hệ thống, tôi muốn dữ liệu thời tiết mỗi lần cập nhật đều được lưu vào cơ sở dữ liệu `smart.farm.weather` để theo dõi diễn biến khí hậu qua các ngày và làm nguồn dự phòng khi mất mạng.
* **Acceptance Scenarios**:
  1. **Given** mỗi lần đồng bộ thời tiết, **When** API trả về kết quả, **Then** tự động tạo bản ghi mới trong model `smart.farm.weather` (nhiệt độ, gió, độ ẩm, thời gian, tọa độ).
  2. **Given** hệ thống không thể kết nối ra internet, **When** tải Dashboard, **Then** tự động truy vấn bản ghi gần nhất trong database Odoo, hiển thị badge *"Từ DB"* màu xanh dương để thông báo trạng thái ngoại tuyến rõ ràng.

---

## 3. Edge Cases & Xử lý Ngoại lệ (Edge Cases)

1. **API Open-Meteo Quá Tải / Timeout (Timeout > 5s)**:
   - Backend thiết lập `timeout=5`, nếu quá hạn sẽ bắt ngoại lệ và tự động lấy bản ghi mới nhất từ bảng `smart.farm.weather` trong database.
2. **Sai Lệch Tọa Độ Địa Lý (Invalid Coordinates)**:
   - Mặc định tọa độ chuẩn nông trại tại TP. Hà Nội (`lat=21.0285`, `lon=105.8542`), có cơ chế validation tránh lỗi `400 Bad Request`.
3. **Thao Tác Click Spam Nút Làm Mới (Button Spamming)**:
   - Vô hiệu hóa nút (disabled) và thêm hiệu ứng xoay tròn icon trong suốt thời gian request đang xử lý (khoảng 1-2 giây) để tránh gửi nhiều request đồng thời lên server.
4. **Không Có Dữ Liệu Cả Online Lẫn Database (Empty DB Fallback)**:
   - Nếu hệ thống mới cài đặt sạch chưa có bản ghi DB và mất mạng, áp dụng bộ thông số chuẩn (28°C, độ ẩm 75%, gió 8 km/h) kèm nhãn *"Mẫu"* để đảm bảo 100% không bao giờ bị lỗi 500 hay vỡ layout thẻ.
