from odoo import models, fields, api


class SmartFarmTask(models.Model):
    _name = 'smart.farm.task'
    _description = 'Công việc Nông trại'
    _order = 'sequence asc, is_done asc, date asc, id desc'

    sequence = fields.Integer(
        string='Thứ tự',
        default=10,
    )
    name = fields.Char(
        string='Tiêu đề công việc',
        required=True,
    )
    task_type = fields.Selection([
        ('irrigation', 'Tưới tiêu'),
        ('sensor', 'Cảm biến'),
        ('gps', 'GPS'),
        ('season', 'Mùa vụ'),
        ('inventory', 'Kho'),
        ('report', 'Báo cáo'),
    ], string='Phân loại', default='irrigation', required=True)

    date = fields.Date(
        string='Ngày thực hiện',
        default=fields.Date.today,
        required=True,
    )
    is_done = fields.Boolean(
        string='Đã hoàn thành',
        default=False,
    )
    user_id = fields.Many2one(
        'res.users',
        string='Người phụ trách',
        default=lambda self: self.env.user,
    )
    notes = fields.Text(
        string='Ghi chú',
    )
