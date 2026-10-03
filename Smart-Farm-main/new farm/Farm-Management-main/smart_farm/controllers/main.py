from odoo import http, fields
from odoo.http import request
from datetime import datetime
import json
import requests as req_lib


class SmartFarmDashboard(http.Controller):

    @http.route(['/smart_farm', '/smart_farm/', '/smart_farm/dashboard'], type='http', auth='user')
    def dashboard(self, **kwargs):
        env = request.env

        gps_records = env['smart.farm.gps'].search(
            [], limit=5, order='timestamp desc'
        )

        weather = None
        soil = None
        chart_data_json = "{}"
        try:
            r = req_lib.get(
                "https://api.open-meteo.com/v1/forecast"
                "?latitude=10.82&longitude=106.63"
                "&current_weather=true&past_days=1&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,shortwave_radiation",
                timeout=5,
            )
            if r.status_code == 200:
                data = r.json()
                cw = data['current_weather']
                hourly = data.get('hourly', {})
                
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

                weather = {
                    'temperature': cw['temperature'],
                    'windspeed': cw['windspeed'],
                    'humidity': humidity,
                    'source': 'live',
                }
                soil = {
                    'temp': soil_temp,
                    'moisture_a': moisture_a_pct,
                    'moisture_b': moisture_b_pct,
                    'moisture_c': moisture_c_pct,
                    'lux': lux,
                    'source': 'live'
                }
        except Exception:
            pass

        if not weather:
            latest = env['smart.farm.weather'].search(
                [], limit=1, order='timestamp desc'
            )
            if latest:
                weather = {
                    'temperature': latest.temperature,
                    'windspeed': latest.windspeed,
                    'humidity': latest.humidity,
                    'source': 'db',
                }
            else:
                weather = {
                    'temperature': 31,
                    'windspeed': 12,
                    'humidity': 78,
                    'source': 'mock',
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

            return request.make_response(
                json.dumps({
                    'success': True,
                    'task_id': task.id,
                    'is_done': new_state,
                    'task_total': total,
                    'task_done': done,
                    'task_remaining': remaining,
                    'message': 'Đã đánh dấu hoàn thành!' if new_state else 'Đã chuyển về chưa hoàn thành!'
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

            return request.make_response(
                json.dumps({
                    'success': True,
                    'message': 'Đã tạo công việc mới thành công!',
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
                'fan': 'Quạt thông gió đối lưu',
                'drip': 'Hệ thống tưới nhỏ giọt thông minh',
                'pump': 'Trạm máy bơm cấp nước hồ chứa',
                'shade': 'Hệ thống mái che tự động'
            }
            dev_name = device_names.get(device, f'Thiết bị {device}')
            action_text = "Bật" if state else "Tắt"

            return request.make_response(
                json.dumps({
                    'success': True,
                    'zone': zone,
                    'device': device,
                    'state': state,
                    'message': f'Đã {action_text.lower()} {dev_name} tại Khu {zone} thành công!'
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