import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/emailService';

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  await connectDB();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetCode = generateResetCode();
      user.resetPasswordToken = resetCode;
      user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      try {
        await sendPasswordResetEmail(user, resetCode);
      } catch (err) {
        console.error('Failed to send password reset email:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If that email exists, a reset code has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
