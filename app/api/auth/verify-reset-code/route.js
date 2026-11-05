import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await connectDB();

  try {
    const { email, resetCode } = await request.json();

    if (!email || !resetCode) {
      return NextResponse.json(
        { success: false, message: 'Email and reset code are required' },
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

    return NextResponse.json({ success: true, message: 'Code verified' }, { status: 200 });
  } catch (error) {
    console.error('Verify reset code error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
