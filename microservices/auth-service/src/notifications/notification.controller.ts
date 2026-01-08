import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user._id);
  }

  @Post()
  async createNotification(@Req() req, @Body() body: { title: string; message: string; type?: string }) {
    return this.notificationService.createNotification(req.user._id, body);
  }

  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user._id, id);
  }

  @Delete(':id')
  async deleteNotification(@Req() req, @Param('id') id: string) {
    return this.notificationService.deleteNotification(req.user._id, id);
  }
}
