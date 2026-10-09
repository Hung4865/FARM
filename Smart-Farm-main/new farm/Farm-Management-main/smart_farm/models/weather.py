from odoo import models, fields, api
import requests


class SmartFarmWeather(models.Model):
    _name = 'smart.farm.weather'
    _description = 'Dữ liệu thời tiết'
    _order = 'timestamp desc'

    name = fields.Char(
        string='Bản ghi',
        required=True,
        default='Cập nhật thời tiết',
    )
    temperature = fields.Float(string='Nhiệt độ (°C)')
    windspeed = fields.Float(string='Tốc độ gió (km/h)')
    humidity = fields.Float(string='Độ ẩm (%)')
    timestamp = fields.Datetime(
        string='Thời gian',
        default=fields.Datetime.now,
        required=True,
    )
    location = fields.Char(
        string='Vị trí',
        default='TP. Hà Nội',
    )
    latitude = fields.Float(string='Vĩ độ', default=21.0285)
    longitude = fields.Float(string='Kinh độ', default=105.8542)
    weather_code = fields.Integer(string='Mã thời tiết WMO', default=0)

    @api.model
    def fetch_and_save(self):
        """Gọi API Open-Meteo cho Hà Nội và lưu vào database."""
        lat = 21.0285
        lon = 105.8542
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}&current_weather=true"
            f"&hourly=relative_humidity_2m"
        )
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                cw = data.get('current_weather', {})
                humidity = data.get('hourly', {}).get('relative_humidity_2m', [75])[0]
                return self.create({
                    'name': f"Thời tiết Hà Nội {fields.Datetime.now()}",
                    'temperature': cw.get('temperature', 25.0),
                    'windspeed': cw.get('windspeed', 8.0),
                    'humidity': humidity,
                    'weather_code': cw.get('weathercode', 0),
                    'location': 'TP. Hà Nội',
                    'latitude': lat,
                    'longitude': lon,
                })
        except Exception:
            pass
        return False