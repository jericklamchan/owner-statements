import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching payout adjustments or Vrbo fees from Stripe API
  const mockStripeAdjustments = [
    { id: 'ADJ-101', type: 'payout_fee', description: 'Instant payout transfer fee', amount: 15.00, date: '2026-10-06' },
  ];

  return NextResponse.json({ success: true, data: mockStripeAdjustments });
}