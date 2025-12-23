/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { SendResetDto } from './dto/send-reset.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @MessagePattern({ cmd: 'send-verification' })
  async sendVerification(@Payload() payload: SendVerificationDto) {
    await this.emailService.sendVerificationEmail(
      payload.user,
      payload.verificationUrl
    );
    return { status: 'success', message: 'Verification email sent' };
  }

  @MessagePattern({ cmd: 'send-reset' })
  async sendReset(@Payload() payload: SendResetDto) {
    await this.emailService.sendResetPasswordEmail(payload.user, payload.resetUrl);
    return { status: 'success', message: 'Reset email sent' };
  }
}
