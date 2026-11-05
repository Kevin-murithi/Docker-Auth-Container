import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

function getJwtFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith('jwt=')) {
      return decodeURIComponent(cookie.substring(4));
    }
  }
  return null;
}

export async function GET(request) {
  await connectDB();

  const token = getJwtFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt || null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Get current user error:', err.message);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
