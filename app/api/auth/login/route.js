import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  return errors;
};

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const { email, password } = body;

  try {
    const user = await User.login(email, password);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: maxAge,
    });

    const response = NextResponse.json({ user: user._id, role: user.role, token }, { status: 200 });

    response.cookies.set('jwt', token, {
      httpOnly: true,
      maxAge: maxAge,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err) {
    const errors = handleErrors(err);
    return NextResponse.json({ errors }, { status: 400 });
  }
}
