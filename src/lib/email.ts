import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? 'noreply@notions11.com';

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetUrl: string
): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: 'Notions11 Password Recovery',
    html: `
      <p>Hi ${toName},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendLinkDownloadNotification(
  ownerEmail: string,
  ownerName: string,
  city: string,
  country: string
): Promise<void> {
  const location = city ? `from ${city}${country ? `, ${country}` : ''}` : '';
  await resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: 'Your Notions11 link was accessed',
    html: `
      <p>Hi ${ownerName},</p>
      <p>Your password-protected Notions11 link was accessed${location ? ` ${location}` : ''}.</p>
    `,
  });
}
