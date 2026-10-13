import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '../store';

export async function GET() {
  return NextResponse.json({ success: true, users: getCollection('users') });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {
    id: `u-${Date.now()}`,
    name: body.name || 'New User',
    email: body.email || 'user@example.com',
    role: body.role || 'Property Manager',
    propertiesManaged: 0,
    status: 'Active',
  };
  addToCollection('users', newUser);
  return NextResponse.json({ success: true, user: newUser }, { status: 201 });
}