import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
  const token = getJwtFromRequest(request);

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json(
      {
        isAuthenticated: true,
        user: decodedToken.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('JWT verification error', err.message);
    return NextResponse.json(
      {
        isAuthenticated: false,
        error: 'Invalid token',
      },
      { status: 401 }
    );
  }
}
