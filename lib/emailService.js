import nodemailer from 'nodemailer';

const createTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (options) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"Kevin-Murithi" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully to:', options.to);
  return info;
};

export const sendWelcomeEmail = async (user, password) => {
  const subject = 'Welcome to Your Account';

  const text = `
    Hello ${user.firstName},

    Welcome! Your account has been created.

    Here are your login credentials:
    Email: ${user.email}
    Temporary Password: ${password}

    Please log in and change your password as soon as possible.

    Best regards,
    Kevin Murithi
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome</h2>
      <p>Hello ${user.firstName},</p>
      <p>Your account has been created.</p>

      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your Login Credentials</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
      </div>

      <p><strong>Important:</strong> Please log in and change your password as soon as possible.</p>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
         style="display: inline-block; background-color: #4a90e2; color: white; padding: 10px 20px;
                text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Log In Now
      </a>

      <p style="margin-top: 30px;">Best regards,<br>Kevin Murithi</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

export const sendPasswordResetEmail = async (user, resetCode) => {
  const subject = 'Password Reset Request';

  const text = `
    Hello ${user.firstName},

    You requested to reset your password.

    Your reset code is: ${resetCode}

    This code will expire in 1 hour.

    If you did not request this, please ignore this email.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>Hello ${user.firstName},</p>
      <p>You requested to reset your password.</p>
      <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;text-align:center;">
        <h3>Your Reset Code</h3>
        <p style="font-size:24px;font-weight:bold;letter-spacing:5px;">${resetCode}</p>
        <p style="font-size:12px;color:#666;">This code will expire in 1 hour</p>
      </div>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

export const sendVerificationEmail = async (user, verificationToken) => {
  const subject = 'VinePulse - Verify Your Email Address';

  const text = `
    Hello ${user.firstName},

    Thank you for registering! To complete your registration, please verify your email address.

    Your verification code is: ${verificationToken}

    This code will expire in 1 hour.

    If you did not create an account, please ignore this email.

    Best regards,
    Kevin Murithi
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Hello ${user.firstName},</p>
      <p>Thank you for registering! To complete your registration, please verify your email address.</p>

      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <h3 style="margin-top: 0;">Your Verification Code</h3>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${verificationToken}</p>
        <p style="font-size: 12px; color: #666;">This code will expire in 1 hour</p>
      </div>

      <p>Please enter this code on the verification page to activate your account.</p>
      <p>If you did not create an account, please ignore this email.</p>

      <p style="margin-top: 30px;">Best regards,<br>Kevin Murithi</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};
