/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) { }

  async register(userData: any): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new HttpException('User already exists with this email', HttpStatus.BAD_REQUEST);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
        isEmailVerified: true, // No email verification required
      });

      // Generate token
      const token = this.jwtService.sign({ id: user._id, email: user.email, role: user.role });

      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;

      // Send welcome/verification email
      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      const verificationUrl = `${clientUrl}/verify-email?token=dummy`;

      try {
        await firstValueFrom(this.emailClient.send({ cmd: 'send-verification' }, {
          user: { email: user.email, firstName: user.firstName, fullName: `${user.firstName} ${user.lastName}` },
          verificationUrl,
        }));
      } catch (error) {
        console.error('Failed to send verification email on register:', error.message);
        // Continue registration even if email fails
      }

      return {
        status: 'success',
        message: 'Registration successful.',
        data: { user: userObj, token },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
      }

      const token = this.jwtService.sign({ id: user._id, email: user.email, role: user.role });

      const userObj = user.toObject();
      delete userObj.password;

      return {
        status: 'success',
        data: { user: userObj, token },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', data: { user } };
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      delete userData.password;
      const user = await this.userModel.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { status: 'success', data: { user } };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('No user found with this email', HttpStatus.NOT_FOUND);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Send reset email via Microservice
    await firstValueFrom(this.emailClient.send({ cmd: 'send-reset' }, {
      user: { email: user.email, firstName: user.firstName, fullName: `${user.firstName} ${user.lastName}` },
      resetUrl,
    }));

    return {
      status: 'success',
      message: 'Password reset token generated and email sent',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new HttpException('Token is invalid or has expired', HttpStatus.BAD_REQUEST);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return { status: 'success', message: 'Password reset successful' };
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Current password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return { status: 'success', message: 'Password updated successfully' };
  }

  async getAllUsers(): Promise<any> {
    const users = await this.userModel.find().select('-password');
    return {
      status: 'success',
      results: users.length,
      data: { users },
    };
  }

  async deleteUser(userId: string): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', message: 'User deleted successfully' };
  }

  async deactivateUser(userId: string): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    ).select('-password');
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', message: 'User deactivated successfully', data: { user } };
  }

  async reactivateUser(userId: string): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { active: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', message: 'User reactivated successfully', data: { user } };
  }

  async getUsersByRole(role: string): Promise<any> {
    const users = await this.userModel.find({ role }).select('-password');
    return {
      status: 'success',
      results: users.length,
      data: { users },
    };
  }
}
