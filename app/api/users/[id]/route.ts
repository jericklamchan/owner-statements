import { NextResponse } from 'next/server';
import { updateInCollection, deleteFromCollection } from '../../../../utils/store';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateInCollection('users', id, body);
  
  if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, user: updated });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const success = deleteFromCollection('users', id);
  
  if (!success) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Deleted successfully' });
}