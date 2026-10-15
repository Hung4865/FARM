from odoo import models, fields, api


class ResUsers(models.Model):
    _inherit = 'res.users'

    smart_farm_role = fields.Selection([
        ('admin', 'Quản trị viên'),
        ('manager', 'Quản lý'),
        ('staff', 'Nhân viên'),
    ], string='Vai trò Smart Farm', default='staff')

    def get_smart_farm_effective_role(self):
        """Xác định vai trò thực tế: User thuộc base.group_system luôn là admin"""
        self.ensure_one()
        if self.has_group('base.group_system') or self.id == 2:
            return 'admin'
        return self.smart_farm_role or 'staff'
