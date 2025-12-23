/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
<<<<<<< HEAD
=======
import axios from 'axios';
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
import { User, UserDocument } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
<<<<<<< HEAD
    private jwtService: JwtService,
=======
    private jwtService: JwtService
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
  ) {}

  async register(userData: any): Promise<any> {
    try {
      // Check if user already exists
<<<<<<< HEAD
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new HttpException('User already exists with this email', HttpStatus.BAD_REQUEST);
=======
      const existingUser = await this.userModel.findOne({
        email: userData.email,
      });
      if (existingUser) {
        throw new HttpException(
          'User already exists with this email',
          HttpStatus.BAD_REQUEST
        );
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
      });

<<<<<<< HEAD
      // Generate token
      const token = this.jwtService.sign({ id: user._id, email: user.email, role: user.role });
=======
      // Do not require email confirmation on register — mark verified by default
      user.isEmailVerified = true;
      await user.save();
      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;

      const responseData: any = { user: userObj };

      return {
        status: 'success',
        message: 'Registration successful.',
        data: responseData,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED
        );
      }

      // No email verification requirement for login (users can register and login immediately)

      const token = this.jwtService.sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb

      const userObj = user.toObject();
      delete userObj.password;

      return { status: 'success', data: { user: userObj, token } };
    } catch (error) {
<<<<<<< HEAD
      throw new HttpException(error.message || 'Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      // Find user
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
      }

      // Generate token
      const token = this.jwtService.sign({ id: user._id, email: user.email, role: user.role });

      // Remove password from response
=======
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async verifyEmail(token: string, email: string): Promise<any> {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await this.userModel.findOne({
        email,
        emailVerificationToken: hashedToken,
      });
      if (!user) {
        throw new HttpException(
          'Invalid or expired verification token',
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        !user.emailVerificationTokenExpiry ||
        user.emailVerificationTokenExpiry.getTime() < Date.now()
      ) {
        throw new HttpException(
          'Verification token has expired',
          HttpStatus.BAD_REQUEST
        );
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpiry = undefined;
      await user.save();

      const tokenJwt = this.jwtService.sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });

>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
      const userObj = user.toObject();
      delete userObj.password;

      return {
        status: 'success',
<<<<<<< HEAD
        data: { user: userObj, token },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Login failed', HttpStatus.UNAUTHORIZED);
=======
        message: 'Email verified',
        data: { user: userObj, token: tokenJwt },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Email verification failed',
        HttpStatus.BAD_REQUEST
      );
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
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

<<<<<<< HEAD
      console.log('updateUser called with userId:', userId, 'userData:', userData);

      const user = await this.userModel.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true,
      }).select('-password');

=======
      const user = await this.userModel
        .findByIdAndUpdate(userId, userData, {
          new: true,
          runValidators: true,
        })
        .select('-password');
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
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
<<<<<<< HEAD
      throw new HttpException('No user found with this email', HttpStatus.NOT_FOUND);
=======
      throw new HttpException(
        'No user found with this email',
        HttpStatus.NOT_FOUND
      );
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
<<<<<<< HEAD
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
=======
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Build reset URL for client (client uses /reset-password/:token)
    const resetUrl = `${
      process.env.CLIENT_URL || 'http://localhost:5173'
    }/reset-password/${resetToken}`;

    // Send reset email via email microservice
    try {
      const emailServiceUrl =
        process.env.EMAIL_SERVICE_URL || 'http://localhost:3002';
      await axios.post(
        `${emailServiceUrl}/send-reset`,
        {
          user: {
            email: user.email,
            firstName: user.firstName,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          },
          resetUrl,
        },
        { timeout: 5000 }
      );
    } catch (e) {
      console.error('Failed to call email service for reset:', e?.message || e);
    }

    const exposeLink =
      (process.env.EXPOSE_RESET_LINK || 'false').toLowerCase() === 'true';

    return {
      status: 'success',
      message:
        'Password reset token generated. Check your email for the reset link.',
      ...(exposeLink ? { resetUrl } : {}),
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
<<<<<<< HEAD
      throw new HttpException('Token is invalid or has expired', HttpStatus.BAD_REQUEST);
=======
      throw new HttpException(
        'Token is invalid or has expired',
        HttpStatus.BAD_REQUEST
      );
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return { status: 'success', message: 'Password reset successful' };
  }

<<<<<<< HEAD
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
=======
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

<<<<<<< HEAD
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Current password is incorrect', HttpStatus.UNAUTHORIZED);
=======
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.UNAUTHORIZED
      );
>>>>>>> 85450adc2cba424453ea307ba36854b0ad74ccbb
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

  async getUsersByRole(role: string): Promise<any> {
    const users = await this.userModel.find({ role }).select('-password');
    return {
      status: 'success',
      results: users.length,
      data: { users },
    };
  }
}
