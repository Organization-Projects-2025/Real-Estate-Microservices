import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async getUserNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    return {
      status: 'success',
      results: notifications.length,
      data: { notifications },
    };
  }

  async createNotification(userId: string, data: { title: string; message: string; type?: string }) {
    const notification = await this.notificationModel.create({
      user: userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
    });

    return {
      status: 'success',
      data: { notification },
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true },
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return {
      status: 'success',
      data: { notification },
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return {
      status: 'success',
      data: null,
    };
  }
}
