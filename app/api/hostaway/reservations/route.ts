import { NextResponse } from 'next/server';

const mockReservationsMap: Record<string, any[]> = {
  '1': [
    {
      id: 'RES-MC-001',
      channel: 'Airbnb',
      from: '2026-10-02',
      to: '2026-10-07',
      nights: 5,
      status: 'Confirmed',
      totalPrice: 2100.00,
      cleaningFee: 200.00,
    },
  ],
  '2': [
    {
      id: 'RES-84920',
      channel: 'Airbnb',
      from: '2026-10-01',
      to: '2026-10-05',
      nights: 4,
      status: 'Confirmed',
      totalPrice: 1200.00,
      cleaningFee: 150.00,
    },
    {
      id: 'RES-84925',
      channel: 'Vrbo',
      from: '2026-10-10',
      to: '2026-10-15',
      nights: 5,
      status: 'Confirmed',
      totalPrice: 1750.00,
      cleaningFee: 175.00,
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');

  if (!propertyId || !mockReservationsMap[propertyId]) {
    return NextResponse.json({ success: true, data: [] });
  }

  return NextResponse.json({ success: true, data: mockReservationsMap[propertyId] });
}