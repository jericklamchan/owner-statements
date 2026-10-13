import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching property bills/expenses from QuickBooks API
  const mockQbExpenses = [
    { id: 'EXP-001', category: 'Maintenance', description: 'Plumbing repair for kitchen sink', amount: 120.00, date: '2026-10-03' },
    { id: 'EXP-002', category: 'Supplies', description: 'Restocking guest toiletries', amount: 45.50, date: '2026-10-08' },
  ];

  return NextResponse.json({ success: true, data: mockQbExpenses });
}