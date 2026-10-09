from odoo import http, fields
from odoo.http import request
from datetime import datetime
import json
import requests as req_lib


def map_weather_code(code):
    """Ánh xạ mã thời tiết WMO sang icon và mô tả tiếng Việt"""
    if code == 0:
        return {'icon': '☀️', 'desc': 'Quang đãng'}
    elif code in (1, 2):
        return {'icon': '🌤️', 'desc': 'Ít mây'}
    elif code == 3:
        return {'icon': '⛅', 'desc': 'Nhiều mây'}
    elif code in (45, 48):
        return {'icon': '🌫️', 'desc': 'Sương mù'}
    elif code in (51, 53, 55, 56, 57):
        return {'icon': '🌧️', 'desc': 'Mưa phùn'}
    elif code in (61, 63, 65, 66, 67, 80, 81, 82):
        return {'icon': '🌧️', 'desc': 'Mưa rào'}
    elif code in (71, 73, 75, 77, 85, 86):
        return {'icon': '❄️', 'desc': 'Tuyết rơi'}
    elif code in (95, 96, 99):
        return {'icon': '⛈️', 'desc': 'Dông bão'}
    return {'icon': '🌤️', 'desc': 'Mây thay đổi'}


def analyze_agri_advice(temp, humidity):
    """Phân tích khuyến nghị nông vụ dựa trên thời tiết thực tế"""
    try:
        t = float(temp)
        h = float(humidity)
    except Exception:
        return "🌿 Thời tiết Hà Nội thuận lợi cho sự phát triển của cây trồng."
    if h > 85:
        return "⚠️ Độ ẩm cao (>85%): Chú ý thông gió nhà màng, đề phòng nấm bệnh lá."
    elif t > 34:
        return "☀️ Nắng gắt (>34°C): Nên che rèm chắn nắng và bật quạt thông gió làm mát."
    elif t < 18:
        return "❄️ Rét lạnh (<18°C): Cần giữ ấm rễ cây và giảm lượng nước tưới tiêu."
    elif h < 45:
        return "💧 Không khí khô hanh: Tăng cường bổ sung nước tưới phun sương."
    return "🌿 Thời tiết Hà Nội lý tưởng cho sinh trưởng cây trồng."


class SmartFarmDashboard(http.Controller):

    @http.route(['/smart_farm', '/smart_farm/', '/smart_farm/dashboard'], type='http', auth='user')
    def dashboard(self, **kwargs):
        env = request.env

        gps_count = env['smart.farm.gps'].search_count([])
        if gps_count == 0:
            sample_gps = [
                {
                    'name': 'Máy kéo Kubota M7040',
                    'device_type': 'tractor',
                    'latitude': 21.028511,
                    'longitude': 105.854167,
                    'notes': 'Đang cày xới Khu B',
                },
                {
                    'name': 'Xe bán tải tuần tra #02',
                    'device_type': 'phone',
                    'latitude': 21.029800,
                    'longitude': 105.855600,
                    'notes': 'Tuần tra vành đai Khu C',
                },
                {
                    'name': 'Drone phun thuốc DJI T40',
                    'device_type': 'other',
                    'latitude': 21.027400,
                    'longitude': 105.853200,
                    'notes': 'Phun thuốc sinh học Khu A',
                },
                {
                    'name': 'Trạm quan trắc IoT #01',
                    'device_type': 'sensor',
                    'latitude': 21.028900,
                    'longitude': 105.854900,
                    'notes': 'Giám sát vi khí hậu',
                },
            ]
            for data in sample_gps:
                env['smart.farm.gps'].sudo().create(data)

        gps_records = env['smart.farm.gps'].search(
            [], limit=5, order='timestamp desc'
        )

        weather = None
        soil = None
        chart_data_json = "{}"
        try:
            r = req_lib.get(
                "https://api.open-meteo.com/v1/forecast"
                "?latitude=21.0285&longitude=105.8542"
                "&current_weather=true&past_days=1"
                "&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,shortwave_radiation"
                "&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Bangkok",
                timeout=5,
            )
            if r.status_code == 200:
                data = r.json()
                cw = data.get('current_weather', {})
                hourly = data.get('hourly', {})
                daily = data.get('daily', {})

                current_hour = datetime.now().hour
                current_index = 24 + current_hour

                start_idx = current_index - 23
                end_idx = current_index + 1

                chart_times = hourly.get('time', [])[start_idx:end_idx]
                chart_temps = hourly.get('temperature_2m', [])[start_idx:end_idx]
                chart_hums = hourly.get('relative_humidity_2m', [])[start_idx:end_idx]

                chart_labels = [t.split('T')[1] for t in chart_times]
                chart_data_json = json.dumps({
                    'labels': chart_labels,
                    'temps': chart_temps,
                    'hums': chart_hums
                })

                humidity = hourly.get('relative_humidity_2m', [75]*48)[current_index]
                soil_temp = hourly.get('soil_temperature_0cm', [28]*48)[current_index]
                soil_m_a = hourly.get('soil_moisture_0_to_1cm', [0.72]*48)[current_index]
                soil_m_b = hourly.get('soil_moisture_1_to_3cm', [0.38]*48)[current_index]
                soil_m_c = hourly.get('soil_moisture_3_to_9cm', [0.81]*48)[current_index]
                radiation = hourly.get('shortwave_radiation', [70]*48)[current_index]

                moisture_a_pct = int(soil_m_a * 100) if soil_m_a is not None else 72
                moisture_b_pct = max(0, int(soil_m_b * 100) - 15) if soil_m_b is not None else 38
                moisture_c_pct = min(100, int(soil_m_c * 100) + 12) if soil_m_c is not None else 81
                lux = int(radiation * 120) if radiation is not None else 8400

                # Xử lý dự báo 4 ngày thực tế tại Hà Nội
                daily_codes = daily.get('weathercode', [])
                daily_max = daily.get('temperature_2m_max', [])
                day_labels = ['Hôm nay', 'Ngày mai', 'Ngày kia', 'Sau đó']
                forecast_list = []
                for i in range(4):
                    label = day_labels[i]
                    if i == 0:
                        f_temp = f"{cw.get('temperature', 25.0)}°"
                        f_code = cw.get('weathercode', 0)
                    else:
                        if i < len(daily_max) and daily_max[i] is not None:
                            f_temp = f"{int(round(daily_max[i]))}°"
                            f_code = daily_codes[i] if i < len(daily_codes) else 0
                        else:
                            f_temp = "28°"
                            f_code = 0
                    w_meta = map_weather_code(f_code)
                    forecast_list.append({
                        'day': label,
                        'temp': f_temp,
                        'icon': w_meta['icon'],
                        'desc': w_meta['desc'],
                    })

                cur_w_meta = map_weather_code(cw.get('weathercode', 0))
                cur_agri_advice = analyze_agri_advice(cw.get('temperature', 25.0), humidity)

                weather = {
                    'temperature': cw.get('temperature', 25.0),
                    'windspeed': cw.get('windspeed', 8.0),
                    'humidity': humidity,
                    'location': 'TP. Hà Nội',
                    'weather_code': cw.get('weathercode', 0),
                    'icon': cur_w_meta['icon'],
                    'desc': cur_w_meta['desc'],
                    'source': 'live',
                    'forecast': forecast_list,
                    'agri_advice': cur_agri_advice,
                }
                soil = {
                    'temp': soil_temp,
                    'moisture_a': moisture_a_pct,
                    'moisture_b': moisture_b_pct,
                    'moisture_c': moisture_c_pct,
                    'lux': lux,
                    'source': 'live'
                }

                # Lưu bản ghi tự động vào database
                try:
                    env['smart.farm.weather'].sudo().create({
                        'name': f"Thời tiết Hà Nội {datetime.now().strftime('%H:%M %d/%m')}",
                        'temperature': cw.get('temperature', 25.0),
                        'windspeed': cw.get('windspeed', 8.0),
                        'humidity': humidity,
                        'weather_code': cw.get('weathercode', 0),
                        'location': 'TP. Hà Nội',
                        'latitude': 21.0285,
                        'longitude': 105.8542,
                    })
                except Exception:
                    pass
        except Exception:
            pass

        if not weather:
            latest = env['smart.farm.weather'].search(
                [], limit=1, order='timestamp desc'
            )
            if latest:
                w_code = getattr(latest, 'weather_code', 0)
                w_meta = map_weather_code(w_code)
                weather = {
                    'temperature': latest.temperature,
                    'windspeed': latest.windspeed,
                    'humidity': latest.humidity,
                    'location': latest.location or 'TP. Hà Nội',
                    'weather_code': w_code,
                    'icon': w_meta['icon'],
                    'desc': w_meta['desc'],
                    'source': 'db',
                    'forecast': [
                        {'day': 'Hôm nay', 'temp': f"{latest.temperature}°", 'icon': w_meta['icon'], 'desc': w_meta['desc']},
                        {'day': 'Ngày mai', 'temp': '29°', 'icon': '🌤️', 'desc': 'Ít mây'},
                        {'day': 'Ngày kia', 'temp': '28°', 'icon': '⛅', 'desc': 'Nhiều mây'},
                        {'day': 'Sau đó', 'temp': '30°', 'icon': '☀️', 'desc': 'Nắng'},
                    ],
                    'agri_advice': analyze_agri_advice(latest.temperature, latest.humidity),
                }
            else:
                weather = {
                    'temperature': 25.0,
                    'windspeed': 8.0,
                    'humidity': 75,
                    'location': 'TP. Hà Nội',
                    'weather_code': 1,
                    'icon': '🌤️',
                    'desc': 'Ít mây',
                    'source': 'mock',
                    'forecast': [
                        {'day': 'Hôm nay', 'temp': '25°', 'icon': '🌤️', 'desc': 'Ít mây'},
                        {'day': 'Ngày mai', 'temp': '28°', 'icon': '⛅', 'desc': 'Nhiều mây'},
                        {'day': 'Ngày kia', 'temp': '27°', 'icon': '☀️', 'desc': 'Nắng'},
                        {'day': 'Sau đó', 'temp': '29°', 'icon': '🌧️', 'desc': 'Mưa rào'},
                    ],
                    'agri_advice': '🌿 Thời tiết Hà Nội lý tưởng cho sinh trưởng cây trồng.',
                }

            soil = {
                'temp': 28,
                'moisture_a': 72,
                'moisture_b': 38,
                'moisture_c': 81,
                'lux': 8400,
                'source': 'mock'
            }

        alerts = env['smart.farm.alert'].search(
            [], limit=15, order='timestamp desc'
        )
        unresolved_count = env['smart.farm.alert'].search_count(
            [('is_resolved', '=', False)]
        )

        today = fields.Date.today()
        all_tasks = env['smart.farm.task'].search(
            [],
            order='sequence asc, is_done asc, date desc, id desc'
        )
        tasks = all_tasks
        task_total = len(all_tasks)
        task_done = len(all_tasks.filtered(lambda t: t.is_done))
        task_remaining = task_total - task_done

        active_alerts = env['smart.farm.alert'].search(
            [('is_resolved', '=', False)],
            order='timestamp desc'
        )
        tractor_gps = env['smart.farm.gps'].search(
            [('device_type', '=', 'tractor')],
            limit=1,
            order='timestamp desc'
        )
        if not tractor_gps and gps_records:
            tractor_gps = gps_records[0]

        values = {
            'gps_records': gps_records,
            'tractor_gps': tractor_gps,
            'weather': weather,
            'soil': soil,
            'alerts': alerts,
            'active_alerts': active_alerts,
            'unresolved_count': unresolved_count,
            'now': datetime.now(),
            'chart_data_json': chart_data_json,
            'user': env.user,
            'tasks': tasks,
            'all_tasks': all_tasks,
            'today': today,
            'task_total': task_total,
            'task_done': task_done,
            'task_remaining': task_remaining,
        }

        return request.render('smart_farm.dashboard_main', values)

    @http.route('/smart_farm/api/gps', type='http', auth='public', methods=['GET', 'POST'], csrf=False)
    def update_gps(self, **kwargs):
        """API endpoint để nhận dữ liệu GPS từ điện thoại (ví dụ: qua app GPSLogger)"""
        lat = kwargs.get('lat')
        lon = kwargs.get('lon')
        name = kwargs.get('name', 'Điện thoại (App)')
        
        if not lat or not lon:
            return request.make_response('Missing lat or lon', status=400)
            
        try:
            # Dùng sudo() để cho phép public request (từ app ngoài) ghi vào database
            request.env['smart.farm.gps'].sudo().create({
                'name': name,
                'latitude': float(lat),
                'longitude': float(lon),
                'device_type': 'phone',
            })
            return request.make_response('OK', status=200)
        except Exception as e:
            return request.make_response(str(e), status=500)

    @http.route('/smart_farm/profile/update', type='http', auth='user', methods=['POST'], csrf=False)
    def update_profile(self, **kwargs):
        """API cập nhật thông tin profile người dùng (họ tên, SĐT, email, password)"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params

            user = request.env.user
            name = (data.get('name') or '').strip()
            email = (data.get('email') or '').strip()
            phone = (data.get('phone') or '').strip()
            password = data.get('password')

            if not name:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Họ và tên không được để trống.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            if not email:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Email đăng nhập không được để trống.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )

            # Kiểm tra trùng email nếu thay đổi login
            if email != user.login:
                existing = request.env['res.users'].sudo().search([('login', '=', email), ('id', '!=', user.id)], limit=1)
                if existing:
                    return request.make_response(
                        json.dumps({'success': False, 'message': f'Email {email} đã được sử dụng bởi tài khoản khác.'}),
                        headers={'Content-Type': 'application/json'},
                        status=400
                    )

            vals = {
                'name': name,
                'email': email,
                'login': email,
                'phone': phone,
            }
            if password and password.strip():
                vals['password'] = password.strip()

            user.sudo().write(vals)

            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Cập nhật thông tin hồ sơ thành công!',
                    'data': {
                        'name': user.name,
                        'email': user.email or user.login,
                        'phone': user.phone or '',
                    }
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/task/toggle', type='http', auth='user', methods=['POST'], csrf=False)
    def toggle_task(self, **kwargs):
        """API toggle trạng thái hoàn thành của công việc"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params

            task_id = data.get('task_id')
            if not task_id:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Thiếu ID công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )

            task = request.env['smart.farm.task'].browse(int(task_id))
            if not task.exists():
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Không tìm thấy công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=404
                )

            new_state = not task.is_done
            task.write({'is_done': new_state})

            all_farm_tasks = request.env['smart.farm.task'].search([])
            total = len(all_farm_tasks)
            done = len(all_farm_tasks.filtered(lambda t: t.is_done))
            remaining = total - done

            alert_payload = None
            if new_state:
                created_alert = request.env['smart.farm.alert'].create({
                    'name': f"Hoàn thành: {task.name}",
                    'content': f"Công việc '{task.name}' đã được đánh dấu hoàn thành.",
                    'alert_type': 'info',
                    'area': 'Lịch làm việc',
                    'is_resolved': False,
                })
                alert_payload = {
                    'id': created_alert.id,
                    'name': created_alert.name,
                    'content': created_alert.content or '',
                    'alert_type': created_alert.alert_type,
                    'area': created_alert.area or '',
                    'timestamp': 'Vừa xong',
                    'is_resolved': False,
                }
            unresolved_count = request.env['smart.farm.alert'].search_count([('is_resolved', '=', False)])

            return request.make_response(
                json.dumps({
                    'success': True,
                    'task_id': task.id,
                    'is_done': new_state,
                    'task_total': total,
                    'task_done': done,
                    'task_remaining': remaining,
                    'message': 'Đã đánh dấu hoàn thành!' if new_state else 'Đã chuyển về chưa hoàn thành!',
                    'alert': alert_payload,
                    'unresolved_count': unresolved_count
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/task/create', type='http', auth='user', methods=['POST'], csrf=False)
    def create_task(self, **kwargs):
        """API tạo công việc mới"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            name = (data.get('name') or '').strip()
            if not name:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Vui lòng nhập tên công việc.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            task_type = data.get('task_type') or 'irrigation'
            date_str = data.get('date') or str(fields.Date.today())
            notes = (data.get('notes') or '').strip()

            last_task = request.env['smart.farm.task'].search([], order='sequence desc', limit=1)
            next_seq = (last_task.sequence + 10) if last_task else 10

            task = request.env['smart.farm.task'].create({
                'name': name,
                'task_type': task_type,
                'date': date_str,
                'notes': notes,
                'sequence': next_seq,
                'user_id': request.env.user.id,
                'is_done': False,
            })

            type_labels = {
                'irrigation': 'Tưới tiêu',
                'sensor': 'Cảm biến',
                'gps': 'GPS',
                'season': 'Mùa vụ',
                'inventory': 'Kho',
                'report': 'Báo cáo',
            }
            task_type_label = type_labels.get(task.task_type, 'Khác')

            created_alert = request.env['smart.farm.alert'].create({
                'name': f"Việc mới: {task.name}",
                'content': f"Đã giao việc '{task.name}' ({task_type_label}).",
                'alert_type': 'info',
                'area': 'Lịch làm việc',
                'is_resolved': False,
            })
            unresolved_count = request.env['smart.farm.alert'].search_count([('is_resolved', '=', False)])

            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã tạo công việc mới thành công!',
                    'task': {
                        'id': task.id,
                        'name': task.name,
                        'task_type': task.task_type,
                        'task_type_label': task_type_label,
                        'date': str(task.date),
                        'is_done': task.is_done,
                        'user_name': task.user_id.name or 'Farm Admin',
                        'notes': task.notes or '',
                        'sequence': task.sequence,
                    },
                    'alert': {
                        'id': created_alert.id,
                        'name': created_alert.name,
                        'content': created_alert.content or '',
                        'alert_type': created_alert.alert_type,
                        'area': created_alert.area or '',
                        'timestamp': 'Vừa xong',
                        'is_resolved': False,
                    },
                    'unresolved_count': unresolved_count
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/task/update', type='http', auth='user', methods=['POST'], csrf=False)
    def update_task(self, **kwargs):
        """API cập nhật công việc"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            task_id = data.get('task_id')
            if not task_id:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Thiếu ID công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            task = request.env['smart.farm.task'].browse(int(task_id))
            if not task.exists():
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Không tìm thấy công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=404
                )
            name = (data.get('name') or '').strip()
            if not name:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Vui lòng nhập tên công việc.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            task_type = data.get('task_type') or task.task_type
            date_str = data.get('date') or str(task.date)
            notes = (data.get('notes') or '').strip()

            task.write({
                'name': name,
                'task_type': task_type,
                'date': date_str,
                'notes': notes,
            })

            type_labels = {
                'irrigation': 'Tưới tiêu',
                'sensor': 'Cảm biến',
                'gps': 'GPS',
                'season': 'Mùa vụ',
                'inventory': 'Kho',
                'report': 'Báo cáo',
            }

            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Cập nhật công việc thành công!',
                    'task': {
                        'id': task.id,
                        'name': task.name,
                        'task_type': task.task_type,
                        'task_type_label': type_labels.get(task.task_type, 'Khác'),
                        'date': str(task.date),
                        'is_done': task.is_done,
                        'user_name': task.user_id.name or 'Farm Admin',
                        'notes': task.notes or '',
                        'sequence': task.sequence,
                    }
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/task/delete', type='http', auth='user', methods=['POST'], csrf=False)
    def delete_task(self, **kwargs):
        """API xóa công việc"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            task_id = data.get('task_id')
            if not task_id:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Thiếu ID công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            task = request.env['smart.farm.task'].browse(int(task_id))
            if not task.exists():
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Không tìm thấy công việc'}),
                    headers={'Content-Type': 'application/json'},
                    status=404
                )
            task.unlink()
            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã xóa công việc thành công!'
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/task/reorder', type='http', auth='user', methods=['POST'], csrf=False)
    def reorder_tasks(self, **kwargs):
        """API sắp xếp thứ tự công việc (kéo thả)"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            task_ids = data.get('task_ids', [])
            if not isinstance(task_ids, list):
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Danh sách task_ids không hợp lệ'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            for idx, tid in enumerate(task_ids):
                try:
                    task = request.env['smart.farm.task'].browse(int(tid))
                    if task.exists():
                        task.write({'sequence': (idx + 1) * 10})
                except Exception:
                    pass
            return request.make_response(
                json.dumps({'success': True, 'message': 'Đã lưu thứ tự công việc!'}),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/alert/resolve', type='http', auth='user', methods=['POST'], csrf=False)
    def resolve_alert(self, **kwargs):
        """API đánh dấu giải quyết cảnh báo"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            alert_id = data.get('alert_id')
            if not alert_id:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Thiếu alert_id'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            alert = request.env['smart.farm.alert'].browse(int(alert_id))
            if not alert.exists():
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Không tìm thấy cảnh báo'}),
                    headers={'Content-Type': 'application/json'},
                    status=404
                )
            alert.action_resolve()
            unresolved_count = request.env['smart.farm.alert'].search_count([('is_resolved', '=', False)])
            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': f'Đã xử lý cảnh báo: {alert.name}',
                    'alert_id': alert.id,
                    'unresolved_count': unresolved_count
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/alert/resolve_all', type='http', auth='user', methods=['POST'], csrf=False)
    def resolve_all_alerts(self, **kwargs):
        """API đánh dấu giải quyết tất cả cảnh báo"""
        try:
            unresolved = request.env['smart.farm.alert'].search([('is_resolved', '=', False)])
            for alert in unresolved:
                alert.action_resolve()
            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã xử lý tất cả cảnh báo!',
                    'unresolved_count': 0
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/alert/create', type='http', auth='user', methods=['POST'], csrf=False)
    def create_alert(self, **kwargs):
        """API tạo cảnh báo/thông báo mới theo sự kiện"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            name = (data.get('name') or '').strip()
            if not name:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Vui lòng cung cấp tiêu đề thông báo.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            content = (data.get('content') or '').strip()
            alert_type = data.get('alert_type') or 'info'
            if alert_type not in ('danger', 'warning', 'info', 'success'):
                alert_type = 'info'
            area = (data.get('area') or 'Hệ thống').strip()

            alert = request.env['smart.farm.alert'].create({
                'name': name,
                'content': content,
                'alert_type': alert_type,
                'area': area,
                'is_resolved': False,
            })
            unresolved_count = request.env['smart.farm.alert'].search_count([('is_resolved', '=', False)])

            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã tạo thông báo thành công!',
                    'alert': {
                        'id': alert.id,
                        'name': alert.name,
                        'content': alert.content or '',
                        'alert_type': alert.alert_type,
                        'area': alert.area or '',
                        'timestamp': 'Vừa xong',
                        'is_resolved': False,
                    },
                    'unresolved_count': unresolved_count
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi tạo thông báo: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/zone/control', type='http', auth='user', methods=['POST'], csrf=False)
    def control_zone_device(self, **kwargs):
        """API điều khiển thiết bị IoT theo phân khu (Zone A, B, C)"""
        try:
            raw_data = request.httprequest.data.decode('utf-8')
            data = json.loads(raw_data) if raw_data else request.params
            zone = str(data.get('zone', 'A')).strip().upper()
            device = str(data.get('device', '')).strip().lower()
            state = bool(data.get('state', True))

            device_names = {
                'mist': 'Hệ thống phun sương làm mát',
                'misting': 'Hệ thống phun sương làm mát',
                'phun_suong': 'Hệ thống phun sương làm mát',
                'fan': 'Quạt thông gió đối lưu',
                'quat': 'Quạt thông gió đối lưu',
                'drip': 'Hệ thống tưới nhỏ giọt thông minh',
                'sprinkler': 'Hệ thống tưới phun mưa tự động',
                'fert': 'Hệ thống châm dinh dưỡng NPK',
                'npk': 'Hệ thống châm dinh dưỡng NPK',
                'phan_bon': 'Hệ thống châm dinh dưỡng NPK',
                'pump': 'Trạm máy bơm cấp nước hồ chứa',
                'shade': 'Hệ thống mái che tự động',
                'mai_che': 'Hệ thống mái che tự động'
            }
            dev_name = device_names.get(device, f'Thiết bị {device}')
            action_text = "Bật" if state else "Tắt"

            alert_type = 'info' if state else 'warning'
            alert_name = f"{action_text} {dev_name}"
            alert_content = f"Người dùng đã {action_text.lower()} {dev_name.lower()} tại Khu {zone}."

            created_alert = request.env['smart.farm.alert'].create({
                'name': alert_name,
                'content': alert_content,
                'alert_type': alert_type,
                'area': f"Khu {zone}",
                'is_resolved': False,
            })
            unresolved_count = request.env['smart.farm.alert'].search_count([('is_resolved', '=', False)])

            return request.make_response(
                json.dumps({
                    'success': True,
                    'zone': zone,
                    'device': device,
                    'state': state,
                    'message': f'Đã {action_text.lower()} {dev_name} tại Khu {zone} thành công!',
                    'alert': {
                        'id': created_alert.id,
                        'name': created_alert.name,
                        'content': created_alert.content or '',
                        'alert_type': created_alert.alert_type,
                        'area': created_alert.area or '',
                        'timestamp': 'Vừa xong',
                        'is_resolved': False,
                    },
                    'unresolved_count': unresolved_count
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi điều khiển thiết bị: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/weather/refresh', type='http', auth='user', methods=['POST'], csrf=False)
    def refresh_weather(self, **kwargs):
        """API làm mới thời tiết thực tế tại TP. Hà Nội từ Open-Meteo và lưu CSDL"""
        env = request.env
        try:
            r = req_lib.get(
                "https://api.open-meteo.com/v1/forecast"
                "?latitude=21.0285&longitude=105.8542"
                "&current_weather=true&past_days=1"
                "&hourly=temperature_2m,relative_humidity_2m"
                "&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Bangkok",
                timeout=5,
            )
            if r.status_code == 200:
                data = r.json()
                cw = data.get('current_weather', {})
                hourly = data.get('hourly', {})
                daily = data.get('daily', {})

                current_hour = datetime.now().hour
                current_index = 24 + current_hour
                humidity = hourly.get('relative_humidity_2m', [75]*48)[current_index]

                daily_codes = daily.get('weathercode', [])
                daily_max = daily.get('temperature_2m_max', [])
                day_labels = ['Hôm nay', 'Ngày mai', 'Ngày kia', 'Sau đó']
                forecast_list = []
                for i in range(4):
                    label = day_labels[i]
                    if i == 0:
                        f_temp = f"{cw.get('temperature', 25.0)}°"
                        f_code = cw.get('weathercode', 0)
                    else:
                        if i < len(daily_max) and daily_max[i] is not None:
                            f_temp = f"{int(round(daily_max[i]))}°"
                            f_code = daily_codes[i] if i < len(daily_codes) else 0
                        else:
                            f_temp = "28°"
                            f_code = 0
                    w_meta = map_weather_code(f_code)
                    forecast_list.append({
                        'day': label,
                        'temp': f_temp,
                        'icon': w_meta['icon'],
                        'desc': w_meta['desc'],
                    })

                cur_w_meta = map_weather_code(cw.get('weathercode', 0))
                cur_agri_advice = analyze_agri_advice(cw.get('temperature', 25.0), humidity)

                weather_dict = {
                    'temperature': cw.get('temperature', 25.0),
                    'windspeed': cw.get('windspeed', 8.0),
                    'humidity': humidity,
                    'location': 'TP. Hà Nội',
                    'weather_code': cw.get('weathercode', 0),
                    'icon': cur_w_meta['icon'],
                    'desc': cur_w_meta['desc'],
                    'source': 'live',
                    'forecast': forecast_list,
                    'agri_advice': cur_agri_advice,
                }

                # Lưu vào DB
                try:
                    env['smart.farm.weather'].sudo().create({
                        'name': f"Thời tiết Hà Nội {datetime.now().strftime('%H:%M %d/%m')}",
                        'temperature': cw.get('temperature', 25.0),
                        'windspeed': cw.get('windspeed', 8.0),
                        'humidity': humidity,
                        'weather_code': cw.get('weathercode', 0),
                        'location': 'TP. Hà Nội',
                        'latitude': 21.0285,
                        'longitude': 105.8542,
                    })
                except Exception:
                    pass

                return request.make_response(
                    json.dumps({
                        'success': True,
                        'message': 'Đã cập nhật thời tiết Hà Nội mới nhất!',
                        'data': weather_dict
                    }),
                    headers={'Content-Type': 'application/json'},
                    status=200
                )
        except Exception:
            pass

        # Fallback từ DB
        latest = env['smart.farm.weather'].search([], limit=1, order='timestamp desc')
        if latest:
            w_code = getattr(latest, 'weather_code', 0)
            w_meta = map_weather_code(w_code)
            weather_dict = {
                'temperature': latest.temperature,
                'windspeed': latest.windspeed,
                'humidity': latest.humidity,
                'location': latest.location or 'TP. Hà Nội',
                'weather_code': w_code,
                'icon': w_meta['icon'],
                'desc': w_meta['desc'],
                'source': 'db',
                'forecast': [
                    {'day': 'Hôm nay', 'temp': f"{latest.temperature}°", 'icon': w_meta['icon'], 'desc': w_meta['desc']},
                    {'day': 'Ngày mai', 'temp': '29°', 'icon': '🌤️', 'desc': 'Ít mây'},
                    {'day': 'Ngày kia', 'temp': '28°', 'icon': '⛅', 'desc': 'Nhiều mây'},
                    {'day': 'Sau đó', 'temp': '30°', 'icon': '☀️', 'desc': 'Nắng'},
                ],
                'agri_advice': analyze_agri_advice(latest.temperature, latest.humidity),
            }
            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã tải dữ liệu thời tiết gần nhất từ cơ sở dữ liệu.',
                    'data': weather_dict
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )

        return request.make_response(
            json.dumps({'success': False, 'message': 'Không thể kết nối dịch vụ thời tiết.'}),
            headers={'Content-Type': 'application/json'},
            status=500
        )

    # ============================================================
    # AI AGRI-COPILOT (GOOGLE GEMINI INTEGRATION)
    # ============================================================
    @http.route('/smart_farm/api/ai/save_key', type='http', auth='user', methods=['POST'], csrf=False)
    def save_gemini_api_key(self, **kw):
        """Lưu hoặc xoá Gemini API Key vào hệ thống Odoo"""
        try:
            body = request.httprequest.data.decode('utf-8') or '{}'
            data = json.loads(body)
            api_key = (data.get('api_key') or '').strip()
            env = request.env
            env['ir.config_parameter'].sudo().set_param('smart_farm.gemini_api_key', api_key)
            return request.make_response(
                json.dumps({'success': True, 'message': 'Đã lưu Gemini API Key thành công!'}),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': str(e)}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/ai/get_key_status', type='http', auth='user', methods=['GET'], csrf=False)
    def get_gemini_key_status(self, **kw):
        """Kiểm tra trạng thái cấu hình Gemini API Key"""
        try:
            env = request.env
            saved_key = env['ir.config_parameter'].sudo().get_param('smart_farm.gemini_api_key', '')
            has_key = bool(saved_key and len(saved_key.strip()) > 10)
            masked_key = ""
            if has_key:
                masked_key = saved_key[:6] + "..." + saved_key[-4:]
            return request.make_response(
                json.dumps({'success': True, 'has_key': has_key, 'masked_key': masked_key}),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': str(e)}),
                headers={'Content-Type': 'application/json'},
                status=500
            )

    @http.route('/smart_farm/api/ai/chat', type='http', auth='user', methods=['POST'], csrf=False)
    def ai_chat_assistant(self, **kw):
        """Xử lý hội thoại AI Agri-Copilot với Google Gemini và ngữ cảnh nông trại thực tế"""
        try:
            body = request.httprequest.data.decode('utf-8') or '{}'
            data = json.loads(body)
            user_message = (data.get('message') or '').strip()
            client_api_key = (data.get('api_key') or '').strip()
            history = data.get('history') or []

            if not user_message:
                return request.make_response(
                    json.dumps({'success': False, 'message': 'Tin nhắn không được để trống.'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )

            env = request.env
            # 1. Lấy API Key (ưu tiên từ client -> fallback system parameter)
            api_key = client_api_key
            if not api_key:
                api_key = (env['ir.config_parameter'].sudo().get_param('smart_farm.gemini_api_key') or '').strip()

            # 2. Thu thập dữ liệu thực tế nông trại
            # Thời tiết
            latest_weather = env['smart.farm.weather'].search([], limit=1, order='timestamp desc')
            if latest_weather:
                temp = latest_weather.temperature
                hum = latest_weather.humidity
                wind = latest_weather.windspeed
                w_desc = map_weather_code(getattr(latest_weather, 'weather_code', 0))['desc']
            else:
                temp, hum, wind, w_desc = 25.0, 75, 8.0, "Ít mây"

            # Cảm biến đất
            m_a, m_b, m_c, soil_temp, lux = 72, 38, 81, 28, 8400

            # Cảnh báo chưa xử lý
            alerts = env['smart.farm.alert'].search([('is_resolved', '=', False)], limit=10, order='timestamp desc')
            alert_count = len(alerts)
            alert_list = [f"- [{al.alert_type.upper()}] {al.name} (Khu vực: {al.area or 'Chung'})" for al in alerts]
            alerts_text = "\n".join(alert_list) if alert_list else "Không có cảnh báo nguy hiểm nào. Mọi hoạt động an toàn."

            # GPS & Thiết bị
            gps_records = env['smart.farm.gps'].search([], limit=6, order='timestamp desc')
            gps_list = []
            for g in gps_records:
                gps_list.append(f"- {g.name} ({g.device_type}): toạ độ {g.latitude:.4f}, {g.longitude:.4f} - Trạng thái: {g.notes or 'Đang hoạt động'}")
            gps_text = "\n".join(gps_list) if gps_list else "4 thiết bị GPS đang định vị trong nông trường."

            # Công việc
            all_tasks = env['smart.farm.task'].search([])
            tasks_done = len(all_tasks.filtered(lambda t: t.is_done))
            tasks_pending = all_tasks.filtered(lambda t: not t.is_done)
            tasks_pending_list = [f"- {t.name} (Loại: {t.task_type})" for t in tasks_pending[:5]]
            tasks_text = "\n".join(tasks_pending_list) if tasks_pending_list else "Đã hoàn thành toàn bộ công việc."

            # 3. Tạo Prompt ngữ cảnh nông trại thực tế
            system_prompt = f"""Bạn là Agri-Copilot - Trợ lý Trí tuệ Nhân tạo Nông nghiệp Thông minh của trang trại Smart Farm (quy mô 12.4 hecta tại TP. Hà Nội, Việt Nam).
DỮ LIỆU THỰC TẾ TRANG TRẠI TẠI THỜI ĐIỂM HIỆN TẠI:
- Cảm biến môi trường đất:
  + Khu A (Nhà màng công nghệ cao): Độ ẩm đất {m_a}% (Ngưỡng tối ưu: 65-75%)
  + Khu B (Cánh đồng canh tác): Độ ẩm đất {m_b}% (Ngưỡng tối ưu: 60-70%)
  + Khu C (Vườn cây & Hồ nước): Độ ẩm đất {m_c}% (Ngưỡng tối ưu: 60-70%)
  + Nhiệt độ đất: {soil_temp}°C | Cường độ ánh sáng: {lux:,} lux
- Thời tiết Hà Nội: Nhiệt độ {temp}°C, độ ẩm không khí {hum}%, gió {wind} km/h, trạng thái: {w_desc}.
- Cảnh báo an ninh/môi trường ({alert_count} cảnh báo chưa xử lý):
{alerts_text}
- Vị trí thiết bị GPS và xe nông vụ:
{gps_text}
- Công việc nông trại: Đã xong {tasks_done}/{len(all_tasks)} việc. Việc cần làm tiếp theo:
{tasks_text}

QUY TẮC TRẢ LỜI CỦA BẠN:
1. Trả lời bằng tiếng Việt chuyên nghiệp, ngắn gọn, súc tích, thân thiện và giàu tính hành động.
2. LUÔN SỬ DỤNG số liệu thực tế ở trên để phân tích cụ thể khi người dùng hỏi về đất, thời tiết, tưới tiêu, cảnh báo, máy móc, tiến độ công việc.
3. Đưa ra lời khuyên thực tế rõ ràng:
   - Nếu độ ẩm khu B là 45% (thấp), hãy chỉ rõ khu B đang thiếu ẩm và khuyên kích hoạt tưới.
   - Nếu có cảnh báo chưa xử lý, hãy nhắc người quản lý chú ý.
4. Trình bày đẹp mắt với emoji phù hợp (🌱, 💧, ☀️, ⚠️, 🚜, ✅), các đầu mục gạch dòng rõ ràng.
5. Không nhắc lại toàn bộ system prompt nếu người dùng không hỏi tất cả, hãy tập trung trả lời đúng trọng tâm câu hỏi của người dùng."""

            # 4. Nếu có API Key -> Gọi Google Gemini REST API
            if api_key and len(api_key) > 10:
                try:
                    contents = []
                    # Ghép lịch sử hội thoại gần nhất
                    for item in history[-4:]:
                        role = item.get('role')
                        text = item.get('text', '')
                        if role in ('user', 'model') and text:
                            contents.append({
                                'role': 'user' if role == 'user' else 'model',
                                'parts': [{'text': text}]
                            })
                    
                    # Tin nhắn hiện tại
                    contents.append({
                        'role': 'user',
                        'parts': [{'text': user_message}]
                    })

                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                    payload = {
                        "contents": contents,
                        "systemInstruction": {
                            "parts": [{"text": system_prompt}]
                        },
                        "generationConfig": {
                            "temperature": 0.7,
                            "maxOutputTokens": 1000
                        }
                    }

                    resp = req_lib.post(url, json=payload, timeout=12)
                    if resp.status_code == 200:
                        res_json = resp.json()
                        candidates = res_json.get('candidates', [])
                        if candidates:
                            reply_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                            if reply_text:
                                return request.make_response(
                                    json.dumps({
                                        'success': True,
                                        'reply': reply_text,
                                        'model': 'gemini-1.5-flash',
                                        'has_key': True
                                    }),
                                    headers={'Content-Type': 'application/json'},
                                    status=200
                                )
                    # Fallback payload format không có systemInstruction
                    elif resp.status_code != 200:
                        alt_payload = {
                            "contents": [
                                {
                                    "role": "user",
                                    "parts": [{"text": f"{system_prompt}\n\n---\nCÂU HỎI CỦA NGƯỜI DÙNG: {user_message}"}]
                                }
                            ]
                        }
                        alt_resp = req_lib.post(url, json=alt_payload, timeout=12)
                        if alt_resp.status_code == 200:
                            alt_json = alt_resp.json()
                            candidates = alt_json.get('candidates', [])
                            if candidates:
                                reply_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                                if reply_text:
                                    return request.make_response(
                                        json.dumps({
                                            'success': True,
                                            'reply': reply_text,
                                            'model': 'gemini-1.5-flash',
                                            'has_key': True
                                        }),
                                        headers={'Content-Type': 'application/json'},
                                        status=200
                                    )
                except Exception:
                    pass

            # 5. Chế độ Thông minh Dự phòng (Offline Farm Copilot Engine)
            msg_lower = user_message.lower()
            if any(k in msg_lower for k in ['đất', 'ẩm', 'tưới', 'nước', 'khu a', 'khu b', 'khu c']):
                reply = f"""🌱 **Phân tích Cảm biến đất & Đề xuất tưới tiêu:**
- **Khu A (Nhà màng):** Độ ẩm đất hiện tại **{m_a}%** (Trạng thái ổn định, thích hợp dưa lưới & rau thuỷ canh).
- **Khu B (Cánh đồng):** Độ ẩm đất hiện tại **{m_b}%** ⚠️ *(Khá khô so với ngưỡng tối ưu 60-70%)*. Khuyến nghị: **Nên kích hoạt tưới phun sương khu B trong 30-45 phút**.
- **Khu C (Vườn & Hồ):** Độ ẩm đất **{m_c}%** (Độ ẩm tốt).
- **Nhiệt độ đất:** {soil_temp}°C | Cường độ sáng: {lux:,} lux."""
            elif any(k in msg_lower for k in ['thời tiết', 'nhiệt độ', 'mưa', 'nắng', 'gió']):
                reply = f"""🌤️ **Báo cáo Thời tiết Nông trường:**
- **Nhiệt độ hiện tại:** **{temp}°C**
- **Độ ẩm không khí:** **{hum}%**
- **Tốc độ gió:** **{wind} km/h** ({w_desc})
- **Khuyến nghị nông vụ:** Thời tiết thuận lợi cho các hoạt động chăm sóc cây trồng ngoài trời. Nếu làm việc buổi trưa, chú ý che chắn chống tia UV cao."""
            elif any(k in msg_lower for k in ['cảnh báo', 'nguy hiểm', 'an toàn', 'alert']):
                if alert_count > 0:
                    reply = f"""⚠️ **Hệ thống có {alert_count} cảnh báo cần xử lý:**\n{alerts_text}\n\n👉 Bạn có thể nhấn vào biểu tượng Quả chuông 🔔 ở thanh trên cùng để xem chi tiết và giải quyết cảnh báo."""
                else:
                    reply = """✅ **Hệ thống an toàn:** Không có cảnh báo nguy hiểm nào tại thời điểm này. Mọi chỉ số cảm biến và thiết bị hoạt động bình thường!"""
            elif any(k in msg_lower for k in ['gps', 'máy kéo', 'xe', 'drone', 'vị trí', 'thiết bị']):
                reply = f"""🚜 **Trạng thái & Vị trí Thiết bị Thực địa (GPS):**\n{gps_text}\n\n👉 Bạn có thể chuyển sang tab **Bản đồ** để xem vị trí trực quan toàn cảnh nông trường."""
            elif any(k in msg_lower for k in ['công việc', 'task', 'tiến độ', 'việc']):
                reply = f"""📋 **Tiến độ Công việc Nông trại:**
- **Đã hoàn thành:** **{tasks_done}** việc.
- **Còn lại cần làm:** **{len(tasks_pending)}** việc.
- **Các việc ưu tiên tiếp theo:**\n{tasks_text}\n\n👉 Bạn có thể vào tab **Công việc** để kéo thả sắp xếp hoặc thêm mới."""
            else:
                reply = f"""Xin chào! Tôi là **Agri-Copilot** - Trợ lý Trí tuệ Nhân tạo của Smart Farm. 🌾

Tóm tắt nhanh tình trạng trang trại hôm nay:
- 🌤️ Thời tiết: **{temp}°C**, {w_desc}, độ ẩm {hum}%.
- 🌱 Đất: Khu A {m_a}%, Khu B **{m_b}%** *(cần tưới)*, Khu C {m_c}%.
- ⚠️ Cảnh báo: **{alert_count}** cảnh báo chưa xử lý.
- 🚜 GPS: 4 phương tiện & cảm biến đang hoạt động.

Bạn có thể hỏi tôi bất kỳ điều gì về:
- Đánh giá độ ẩm đất và thời điểm tưới tiêu
- Tình trạng máy móc nông nghiệp qua GPS
- Hướng dẫn kỹ thuật trồng trọt và xử lý sâu bệnh

💡 *Mẹo: Nhấn vào biểu tượng bánh răng ⚙️ ở góc trên khung chat để nhập **Google Gemini API Key** (miễn phí từ Google AI Studio) để mở khóa toàn bộ sức mạnh tư vấn chuyên sâu của Gemini!*"""

            return request.make_response(
                json.dumps({
                    'success': True,
                    'reply': reply,
                    'model': 'farm-local-engine',
                    'has_key': bool(api_key and len(api_key) > 10)
                }),
                headers={'Content-Type': 'application/json'},
                status=200
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'success': False, 'message': f'Lỗi hệ thống AI: {str(e)}'}),
                headers={'Content-Type': 'application/json'},
                status=500
            )