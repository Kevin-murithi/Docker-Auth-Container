import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/emailService';

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', firstName: '', lastName: '', role: '' };

  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if (err.message && err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const { email, password, firstName, lastName, role } = body;

  const verificationToken = generateVerificationCode();
  const verificationTokenExpire = new Date(Date.now() + 60 * 60 * 1000);

  try {
    const user = await User.create({
      email,
      password,
      role: role || 'Client',
      firstName,
      lastName,
      verificationToken,
      verificationTokenExpire,
      isVerified: false,
    });

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Registration successful. Please check your email for verification code.',
        data: {
          email: user.email,
          verificationToken:
            process.env.NODE_ENV === 'development' ? verificationToken : undefined,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const errors = handleErrors(err);
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }
}
