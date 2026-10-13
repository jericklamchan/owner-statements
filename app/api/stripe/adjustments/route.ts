import { NextResponse } from 'next/server';

const mockAdjustmentsMap: Record<string, any[]> = {
  '1': [
    { id: 'ADJ-MC-1', type: 'payout_fee', description: 'Standard payout transfer fee', amount: 10.00, date: '2026-10-05' },
  ],
  '2': [
    { id: 'ADJ-101', type: 'payout_fee', description: 'Instant payout transfer fee', amount: 15.00, date: '2026-10-06' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');

  if (!propertyId || !mockAdjustmentsMap[propertyId]) {
    return NextResponse.json({ success: true, data: [] });
  }

  return NextResponse.json({ success: true, data: mockAdjustmentsMap[propertyId] });
}