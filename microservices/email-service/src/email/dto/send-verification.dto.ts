export class SendVerificationDto {
  user!: {
    email: string;
    firstName?: string;
    fullName?: string;
  };
  verificationUrl!: string;
}
