export function getHostawayReservations(propertyId: string) {
  const map: Record<string, any[]> = {
    '1': [
      { id: 'RES-94812', channel: 'Airbnb', totalPrice: 1200.00, cleaningFee: 150.00, nights: 4, from: '2026-10-01', to: '2026-10-05', status: 'Confirmed' }
    ],
    '2': [
      { id: 'RES-84925', channel: 'Vrbo', totalPrice: 1800.00, cleaningFee: 200.00, nights: 6, from: '2026-10-10', to: '2026-10-16', status: 'Confirmed' },
      { id: 'RES-84926', channel: 'Airbnb', totalPrice: 950.00, cleaningFee: 120.00, nights: 3, from: '2026-10-20', to: '2026-10-23', status: 'Confirmed' }
    ]
  };
  return map[propertyId] || [];
}

export function getQuickBooksExpenses(propertyId: string) {
  const map: Record<string, any[]> = {
    '1': [{ id: 'EXP-01', date: '2026-10-03', description: 'Plumbing repair', category: 'Maintenance', amount: 150.00 }],
    '2': [{ id: 'EXP-02', date: '2026-10-04', description: 'HVAC filter replacement', category: 'Maintenance', amount: 85.00 }]
  };
  return map[propertyId] || [];
}

export function getStripeAdjustments(propertyId: string) {
  const map: Record<string, any[]> = {
    '1': [],
    '2': [{ id: 'ADJ-101', type: 'payout_fee', description: 'VRBO instant payout transfer fee', amount: 15.00, date: '2026-10-06' }]
  };
  return map[propertyId] || [];
}