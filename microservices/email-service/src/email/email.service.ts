import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // TODO: use SendGrid/Mailgun
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.MAILTRAP_PORT || 2525),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendVerificationEmail(user: any, verificationUrl: string) {
    if (!user || !user.email || !verificationUrl) {
      throw new BadRequestException('Missing required fields');
    }

    const transport = this.createTransport();

    const html = `
      <p>Hi ${user.firstName || user.fullName || ''},</p>
      <p>Thank you for registering.</p>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>If you did not create this account, you can ignore this email.</p>
    `;

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: user.email,
      subject: 'Verify your email address',
      html,
      text: html.replace(/<[^>]+>/g, ''),
    });
  }
}
