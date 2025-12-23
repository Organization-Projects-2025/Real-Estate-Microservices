import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendVerificationDto } from './dto/send-verification.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-verification')
  async sendVerification(@Body() body: SendVerificationDto) {
    await this.emailService.sendVerificationEmail(
      body.user,
      body.verificationUrl
    );
    return { status: 'success', message: 'Verification email sent' };
  }
}
