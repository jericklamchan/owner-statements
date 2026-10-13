import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching bookings from Hostaway API
  const mockHostawayReservations = [
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
  ];

  return NextResponse.json({ success: true, data: mockHostawayReservations });
}