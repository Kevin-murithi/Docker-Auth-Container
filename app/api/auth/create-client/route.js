import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/emailService';

const generateRandomPassword = (length = 10) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
};

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    const tempPassword = generateRandomPassword();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: tempPassword,
      role: 'Client',
    });

    let emailSent = false;
    try {
      await sendWelcomeEmail(user, tempPassword);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          tempPassword:
            !emailSent || process.env.NODE_ENV === 'development'
              ? tempPassword
              : undefined,
        },
        message: emailSent
          ? 'Client account created successfully. A welcome email has been sent with login instructions.'
          : 'Client account created successfully, but failed to send welcome email. Please note the temporary password displayed.',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
