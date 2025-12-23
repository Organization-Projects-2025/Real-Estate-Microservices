export class SendResetDto {
  user!: {
    email: string;
    firstName?: string;
    fullName?: string;
  };
  resetUrl!: string;
}
