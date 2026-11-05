import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(request) {
  await connectDB();

  try {
    const { email, resetCode, newPassword } = await request.json();

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, reset code, and new password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: resetCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
