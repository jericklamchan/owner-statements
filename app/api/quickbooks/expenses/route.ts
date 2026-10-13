import { NextResponse } from 'next/server';

const mockExpensesMap: Record<string, any[]> = {
  '1': [
    { id: 'EXP-MC-01', category: 'Maintenance', description: 'HVAC Filter Replacement', amount: 95.00, date: '2026-10-04' },
  ],
  '2': [
    { id: 'EXP-001', category: 'Maintenance', description: 'Plumbing repair for kitchen sink', amount: 120.00, date: '2026-10-03' },
    { id: 'EXP-002', category: 'Supplies', description: 'Restocking guest toiletries', amount: 45.50, date: '2026-10-08' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');

  if (!propertyId || !mockExpensesMap[propertyId]) {
    return NextResponse.json({ success: true, data: [] });
  }

  return NextResponse.json({ success: true, data: mockExpensesMap[propertyId] });
}