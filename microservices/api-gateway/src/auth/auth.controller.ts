/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AgentService } from '../agent/agent.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly agentService: AgentService
  ) {}

  private extractUserIdFromToken(req: Request): string | null {
    try {
      const token =
        req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
      if (!token) return null;

      // Basic JWT decode (in production, use proper verification)
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      return payload.id || payload.sub;
    } catch (error) {
      return null;
    }
  }

  private extractErrorMessage(error: any): {
    message: string;
    statusCode: number;
  } {
    // Handle RPC errors where response is a string directly
    // Error format from microservice: { response: 'Invalid email or password', status: 401 }
    let message = 'An error occurred';

    if (typeof error?.response === 'string') {
      // RPC error with string response
      message = error.response;
    } else if (typeof error?.message === 'string') {
      // Standard Error object
      message = error.message;
    } else if (error?.response?.message) {
      // HttpException with object response
      message = error.response.message;
    } else if (error?.data?.message) {
      // Axios-style error
      message = error.data.message;
    }

    const statusCode =
      error?.status ||
      error?.statusCode ||
      error?.response?.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      message: String(message),
      statusCode:
        typeof statusCode === 'number'
          ? statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  @Post('register')
  async register(@Body() userData: any, @Res() res: Response) {
    try {
      const result = await this.authService.register(userData);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      // Set JWT cookie
      if (result.data?.token) {
        res.cookie('jwt', result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });
      }

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth Register Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
    @Res() res: Response
  ) {
    try {
      const result = await this.authService.login(
        credentials.email,
        credentials.password
      );

      // Check if microservice returned an error response (not an exception)
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: result.message,
        });
      }

      // Set JWT cookie
      if (result.data?.token) {
        res.cookie('jwt', result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(
        '[Auth Login Error - RAW ERROR]:',
        JSON.stringify(error, null, 2)
      );
      console.log('[Auth Login Error - error.response]:', error?.response);
      console.log(
        '[Auth Login Error - typeof error.response]:',
        typeof error?.response
      );
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth Login Error]', {
        status: 'error',
        message,
        statusCode,
      });
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.cookie('jwt', 'loggedout', {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Logged out successfully!',
    });
  }

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      const result = await this.authService.getMe(userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth GetMe Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Put('me')
  async updateMe(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      const result = await this.authService.updateMe(userId, body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth UpdateMe Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(body.email);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth ForgotPassword Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string },
    @Res() res: Response
  ) {
    try {
      const result = await this.authService.resetPassword(token, body.password);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth ResetPassword Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Put('update-password')
  async updatePassword(
    @Req() req: Request,
    @Body() body: { currentPassword: string; newPassword: string },
    @Res() res: Response
  ) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      const result = await this.authService.updatePassword(
        userId,
        body.currentPassword,
        body.newPassword
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth UpdatePassword Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  // Admin routes
  @Get('users')
  async getAllUsers(@Res() res: Response) {
    try {
      const result = await this.authService.getAllUsers();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth GetAllUsers Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get('users/role/:role')
  async getUsersByRole(@Param('role') role: string, @Res() res: Response) {
    try {
      const result = await this.authService.getUsersByRole(role);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth GetUsersByRole Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.getUserById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth GetUserById Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.deleteUser(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth DeleteUser Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.authService.updateUser(id, userData);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth UpdateUser Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Patch('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.deactivateUser(id);

      // If user was deactivated and has role 'agent', also deactivate their agent profile
      if (result.status === 'success' && result.data?.user) {
        const user = result.data.user;
        if (user.role === 'agent' && user.email) {
          try {
            await this.agentService.deactivateByEmail(user.email);
          } catch (agentError) {
            console.error(
              'Failed to deactivate agent profile:',
              agentError.message
            );
            // Don't fail the request, user was already deactivated
          }
        }
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth DeactivateUser Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Patch('users/:id/reactivate')
  async reactivateUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.reactivateUser(id);

      // If user was reactivated and has role 'agent', also reactivate their agent profile
      if (result.status === 'success' && result.data?.user) {
        const user = result.data.user;
        if (user.role === 'agent' && user.email) {
          try {
            await this.agentService.reactivateByEmail(user.email);
          } catch (agentError) {
            console.error(
              'Failed to reactivate agent profile:',
              agentError.message
            );
            // Don't fail the request, user was already reactivated
          }
        }
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      console.error('[Auth ReactivateUser Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  // Notification routes
  @Get('notifications')
  async getNotifications(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.getNotifications(req);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Post('notifications')
  async createNotification(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const result = await this.authService.createNotification(req, body);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Patch('notifications/:id/read')
  async markNotificationAsRead(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    try {
      const result = await this.authService.markNotificationAsRead(req, id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Delete('notifications/:id')
  async deleteNotification(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    try {
      const result = await this.authService.deleteNotification(req, id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      const { message, statusCode } = this.extractErrorMessage(error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }
}
