/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.authClient.send({ cmd }, data));
    } catch (error) {
      // Debug: Log the raw RPC error structure
      console.log(
        '[Auth Service - RPC Error]:',
        JSON.stringify(error, null, 2)
      );
      console.log('[Auth Service - error.response]:', error?.response);
      console.log('[Auth Service - error.status]:', error?.status);
      console.log('[Auth Service - error.message]:', error?.message);
      // Re-throw so controller can catch and extract error message
      throw error;
    }
  }

  async register(userData: any): Promise<any> {
    return this.sendCommand('register', userData);
  }

  async login(email: string, password: string): Promise<any> {
    return this.sendCommand('login', { email, password });
  }

  async validateToken(token: string): Promise<any> {
    return this.sendCommand('validateToken', token);
  }

  async getMe(userId: string): Promise<any> {
    return this.sendCommand('getMe', userId);
  }

  async updateMe(userId: string, userData: any): Promise<any> {
    return this.sendCommand('updateMe', { userId, userData });
  }

  async forgotPassword(email: string): Promise<any> {
    return this.sendCommand('forgotPassword', { email });
  }

  async resetPassword(token: string, password: string): Promise<any> {
    return this.sendCommand('resetPassword', { token, password });
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    return this.sendCommand('updatePassword', {
      userId,
      currentPassword,
      newPassword,
    });
  }

  async getAllUsers(): Promise<any> {
    return this.sendCommand('getAllUsers', {});
  }

  async getUserById(userId: string): Promise<any> {
    return this.sendCommand('getUserById', userId);
  }

  async deleteUser(userId: string): Promise<any> {
    return this.sendCommand('deleteUser', userId);
  }

  async getUsersByRole(role: string): Promise<any> {
    return this.sendCommand('getUsersByRole', role);
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    return this.sendCommand('updateUser', { userId, userData });
  }

  async deactivateUser(userId: string): Promise<any> {
    return this.sendCommand('deactivateUser', userId);
  }

  async reactivateUser(userId: string): Promise<any> {
    return this.sendCommand('reactivateUser', userId);
  }
}
