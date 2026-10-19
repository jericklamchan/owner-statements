import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '@/utils/store';

export async function GET() {
  try {
    const users = getCollection('users');
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('[API Error - GET /api/users]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Payload must be a valid object.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: body.name || 'New User',
      email: body.email || 'user@example.com',
      role: body.role || 'Property Manager',
      propertiesManaged: 0,
      status: 'Active',
    };

    const savedItem = addToCollection('users', newUser);

    if (!savedItem) {
      return NextResponse.json(
        { success: false, error: 'Failed to save user to database store.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: savedItem }, { status: 201 });
  } catch (error) {
    console.error('[API Error - POST /api/users]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}