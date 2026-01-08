/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { NotificationService } from './notifications/notification.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {}

  // Helper to return error in RPC-compatible format
  private handleError(error: any, defaultMessage: string) {
    let message = error.response || error.message || defaultMessage;
    let statusCode = error.status || 500;

    // Handle MongoDB duplicate key errors
    if (error.code === 11000 || message.includes('E11000 duplicate key')) {
      statusCode = 400;

      // Extract the field name from the error message
      const fieldMatch = message.match(/index: (\w+)_/);
      const field = fieldMatch ? fieldMatch[1] : 'field';

      // Extract the duplicate value if possible
      const valueMatch = message.match(/dup key: \{ (\w+): "([^"]+)" \}/);
      const duplicateValue = valueMatch ? valueMatch[2] : '';

      if (field === 'email') {
        message = duplicateValue
          ? `An account with the email "${duplicateValue}" already exists`
          : 'This email address is already registered';
      } else {
        message = `This ${field} is already in use`;
      }
    }

    return {
      status: 'error',
      message,
      statusCode,
      isError: true,
    };
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() userData: any) {
    try {
      return await this.authService.register(userData);
    } catch (error) {
      console.error('[Auth Microservice Register Error]', error);
      return this.handleError(error, 'Registration failed');
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() credentials: { email: string; password: string }) {
    try {
      return await this.authService.login(
        credentials.email,
        credentials.password
      );
    } catch (error) {
      console.error('[Auth Microservice Login Error]', error);
      return this.handleError(error, 'Login failed');
    }
  }

  @MessagePattern({ cmd: 'validateToken' })
  async validateToken(@Payload() token: string) {
    try {
      return await this.authService.validateToken(token);
    } catch (error) {
      console.error('[Auth Microservice ValidateToken Error]', error);
      return this.handleError(error, 'Token validation failed');
    }
  }

  @MessagePattern({ cmd: 'getMe' })
  async getMe(@Payload() userId: string) {
    try {
      return await this.authService.getUserById(userId);
    } catch (error) {
      console.error('[Auth Microservice GetMe Error]', error);
      return this.handleError(error, 'Failed to get user');
    }
  }

  @MessagePattern({ cmd: 'updateMe' })
  async updateMe(@Payload() data: { userId: string; userData: any }) {
    try {
      return await this.authService.updateUser(data.userId, data.userData);
    } catch (error) {
      console.error('[Auth Microservice UpdateMe Error]', error);
      return this.handleError(error, 'Failed to update user');
    }
  }

  @MessagePattern({ cmd: 'forgotPassword' })
  async forgotPassword(@Payload() data: { email: string }) {
    try {
      return await this.authService.forgotPassword(data.email);
    } catch (error) {
      console.error('[Auth Microservice ForgotPassword Error]', error);
      return this.handleError(error, 'Failed to process password reset');
    }
  }

  @MessagePattern({ cmd: 'resetPassword' })
  async resetPassword(@Payload() data: { token: string; password: string }) {
    try {
      return await this.authService.resetPassword(data.token, data.password);
    } catch (error) {
      console.error('[Auth Microservice ResetPassword Error]', error);
      return this.handleError(error, 'Failed to reset password');
    }
  }

  @MessagePattern({ cmd: 'updatePassword' })
  async updatePassword(
    @Payload()
    data: {
      userId: string;
      currentPassword: string;
      newPassword: string;
    }
  ) {
    try {
      return await this.authService.updatePassword(
        data.userId,
        data.currentPassword,
        data.newPassword
      );
    } catch (error) {
      console.error('[Auth Microservice UpdatePassword Error]', error);
      return this.handleError(error, 'Failed to update password');
    }
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers() {
    try {
      return await this.authService.getAllUsers();
    } catch (error) {
      console.error('[Auth Microservice GetAllUsers Error]', error);
      return this.handleError(error, 'Failed to get users');
    }
  }

  @MessagePattern({ cmd: 'getUserById' })
  async getUserById(@Payload() userId: string) {
    try {
      return await this.authService.getUserById(userId);
    } catch (error) {
      console.error('[Auth Microservice GetUserById Error]', error);
      return this.handleError(error, 'User not found');
    }
  }

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser(@Payload() data: { userId: string; userData: any }) {
    try {
      return await this.authService.updateUser(data.userId, data.userData);
    } catch (error) {
      console.error('[Auth Microservice UpdateUser Error]', error);
      return this.handleError(error, 'Failed to update user');
    }
  }

  @MessagePattern({ cmd: 'deleteUser' })
  async deleteUser(@Payload() userId: string) {
    try {
      return await this.authService.deleteUser(userId);
    } catch (error) {
      console.error('[Auth Microservice DeleteUser Error]', error);
      return this.handleError(error, 'Failed to delete user');
    }
  }

  @MessagePattern({ cmd: 'deactivateUser' })
  async deactivateUser(@Payload() userId: string) {
    try {
      return await this.authService.deactivateUser(userId);
    } catch (error) {
      console.error('[Auth Microservice DeactivateUser Error]', error);
      return this.handleError(error, 'Failed to deactivate user');
    }
  }

  @MessagePattern({ cmd: 'reactivateUser' })
  async reactivateUser(@Payload() userId: string) {
    try {
      return await this.authService.reactivateUser(userId);
    } catch (error) {
      console.error('[Auth Microservice ReactivateUser Error]', error);
      return this.handleError(error, 'Failed to reactivate user');
    }
  }

  @MessagePattern({ cmd: 'getUsersByRole' })
  async getUsersByRole(@Payload() role: string) {
    try {
      return await this.authService.getUsersByRole(role);
    } catch (error) {
      console.error('[Auth Microservice GetUsersByRole Error]', error);
      throw error;
    }
  }

  // Notification message handlers
  @MessagePattern({ cmd: 'getNotifications' })
  async getNotifications(@Payload() data: { userId: string }) {
    try {
      return await this.notificationService.getUserNotifications(data.userId);
    } catch (error) {
      console.error('[Auth Microservice GetNotifications Error]', error);
      return this.handleError(error, 'Failed to get notifications');
    }
  }

  @MessagePattern({ cmd: 'createNotification' })
  async createNotification(@Payload() data: { userId: string; title: string; message: string; type?: string }) {
    try {
      return await this.notificationService.createNotification(data.userId, {
        title: data.title,
        message: data.message,
        type: data.type,
      });
    } catch (error) {
      console.error('[Auth Microservice CreateNotification Error]', error);
      return this.handleError(error, 'Failed to create notification');
    }
  }

  @MessagePattern({ cmd: 'markNotificationAsRead' })
  async markNotificationAsRead(@Payload() data: { userId: string; notificationId: string }) {
    try {
      return await this.notificationService.markAsRead(data.userId, data.notificationId);
    } catch (error) {
      console.error('[Auth Microservice MarkNotificationAsRead Error]', error);
      return this.handleError(error, 'Failed to mark notification as read');
    }
  }

  @MessagePattern({ cmd: 'deleteNotification' })
  async deleteNotification(@Payload() data: { userId: string; notificationId: string }) {
    try {
      return await this.notificationService.deleteNotification(data.userId, data.notificationId);
    } catch (error) {
      console.error('[Auth Microservice DeleteNotification Error]', error);
      return this.handleError(error, 'Failed to delete notification');
    }
  }
}
