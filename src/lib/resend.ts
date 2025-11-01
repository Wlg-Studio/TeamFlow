import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`

  return await resend.emails.send({
    from: 'noreply@yourdomain.com', // Change this to your verified domain
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })
}

export const sendOrganizationInvite = async (
  email: string,
  organizationName: string,
  inviteUrl: string
) => {
  return await resend.emails.send({
    from: 'noreply@yourdomain.com', // Change this to your verified domain
    to: email,
    subject: `You've been invited to join ${organizationName}`,
    html: `
      <h1>You've been invited!</h1>
      <p>You've been invited to join <strong>${organizationName}</strong>.</p>
      <a href="${inviteUrl}">Accept invitation</a>
      <p>If you didn't expect this invitation, you can ignore this email.</p>
    `,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`

  return await resend.emails.send({
    from: 'noreply@yourdomain.com', // Change this to your verified domain
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })
}
