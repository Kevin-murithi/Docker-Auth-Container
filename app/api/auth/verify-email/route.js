import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { email, verificationToken } = body;

    if (!email || !verificationToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide email and verification code',
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired verification code',
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'welcome' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
