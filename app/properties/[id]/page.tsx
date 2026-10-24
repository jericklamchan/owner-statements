'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/ui/PageHeader';
import PageActions from '@/components/ui/PageActions';
import { PolicySection, PolicySelect, PolicyCheckbox } from '@/components/properties/PolicyComponents';

type PageProps = {
  params: Promise<{ id: string }>;
};

const ABSORPTION_OPTIONS = [
  { value: 'owner_pays', label: 'Owner Pays' },
  { value: 'manager_pays', label: 'Manager Pays' },
  { value: 'split', label: 'Split 50/50' },
];

export default function PropertyPolicyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [commissionRate, setCommissionRate] = useState('20');
  const [includeCleaningInCommission, setIncludeCleaningInCommission] = useState(false);
  const [cleaningHandling, setCleaningHandling] = useState('pass_through');
  
  const [otaFees, setOtaFees] = useState('owner_pays');
  const [ccFees, setCcFees] = useState('owner_pays');
  const [taxes, setTaxes] = useState('owner_pays');

  const [expenseReimbursement, setExpenseReimbursement] = useState('full');
  const [includeBills, setIncludeBills] = useState(false);
  const [excludedCategory, setExcludedCategory] = useState('');
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);

  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [additionalFees, setAdditionalFees] = useState<{ name: string; amount: string }[]>([]);

  const [dateBasis, setDateBasis] = useState('checkin');
  const [includeOccupancy, setIncludeOccupancy] = useState(true);
  const [statementNote, setStatementNote] = useState('');

  // Pre-fill existing policy settings on mount
  useEffect(() => {
    async function loadPolicy() {
      try {
        const res = await fetch(`/api/properties/${resolvedParams.id}/policy`);
        if (!res.ok) throw new Error('Failed to load property settings.');

        const data = await res.json();
        if (data.success && data.policy) {
          const p = data.policy;
          if (p.commissionRate !== undefined) setCommissionRate(String(p.commissionRate));
          if (p.includeCleaningInCommission !== undefined) setIncludeCleaningInCommission(p.includeCleaningInCommission);
          if (p.cleaningHandling) setCleaningHandling(p.cleaningHandling);
          if (p.otaFees) setOtaFees(p.otaFees);
          if (p.ccFees) setCcFees(p.ccFees);
          if (p.taxes) setTaxes(p.taxes);
          if (p.expenseReimbursement) setExpenseReimbursement(p.expenseReimbursement);
          if (p.includeBills !== undefined) setIncludeBills(p.includeBills);
          if (p.excludedCategories) setExcludedCategories(p.excludedCategories);
          if (p.additionalFees) setAdditionalFees(p.additionalFees);
          if (p.dateBasis) setDateBasis(p.dateBasis);
          if (p.includeOccupancy !== undefined) setIncludeOccupancy(p.includeOccupancy);
          if (p.statementNote) setStatementNote(p.statementNote);
        }
      } catch (err: any) {
        console.error('[Fetch Policy Error]:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPolicy();
  }, [resolvedParams.id]);

  const handleAddCategory = () => {
    if (excludedCategory.trim()) {
      setExcludedCategories([...excludedCategories, excludedCategory.trim()]);
      setExcludedCategory('');
    }
  };

  const handleAddFee = () => {
    if (feeName.trim() && feeAmount.trim()) {
      setAdditionalFees([...additionalFees, { name: feeName.trim(), amount: feeAmount.trim() }]);
      setFeeName('');
      setFeeAmount('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const policyPayload = {
      commissionRate: Number(commissionRate) || 0,
      includeCleaningInCommission,
      cleaningHandling,
      otaFees,
      ccFees,
      taxes,
      expenseReimbursement,
      includeBills,
      excludedCategories,
      additionalFees,
      dateBasis,
      includeOccupancy,
      statementNote,
    };

    try {
      const res = await fetch(`/api/properties/${resolvedParams.id}/policy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policyPayload }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save property policy.');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('[Save Policy Error]:', err);
      setError(err.message || 'An error occurred while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const formActions = [
    { label: 'Cancel', href: '/' },
    { 
      label: isSaving ? 'Saving...' : 'Save changes', 
      type: 'submit' as const, 
      variant: 'primary' as const,
      disabled: isSaving || isLoading,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Shared Unified Page Header */}
          <PageHeader
            title="Property Policy & Calculations"
            subtitle={`Configure calculation rules and parameters for property ID: ${resolvedParams.id}`}
            actions={<PageActions actions={formActions} />}
          />

          {/* 1. Commission */}
          <PolicySection
            title="Commission"
            description="How your management fee is calculated for each reservation."
            accentColor="bg-blue-600"
            iconBg="bg-blue-50 text-blue-600 border-blue-100/60"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            }
          >
            <div className="max-w-xs">
              <label htmlFor="commission-rate" className="block font-semibold text-gray-700 mb-1">Commission Rate</label>
              <div className="relative">
                <input
                  id="commission-rate"
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none transition-all font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">The percentage you charge the owner for managing this property.</p>
            </div>

            <PolicyCheckbox
              label="Include cleaning fee in commission base"
              description="Cleaning fee is added to the commission base before calculating the management fee."
              checked={includeCleaningInCommission}
              onChange={setIncludeCleaningInCommission}
            />
          </PolicySection>

          {/* 2. Cleaning */}
          <PolicySection
            title="Cleaning Fee Handling"
            description="How cleaning fees collected from guests are handled on statements."
            accentColor="bg-violet-600"
            iconBg="bg-violet-50 text-violet-600 border-violet-100/60"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            }
          >
            <div className="max-w-md">
              <PolicySelect
                label="Handling Method"
                value={cleaningHandling}
                onChange={setCleaningHandling}
                options={[
                  { value: 'pass_through', label: 'Pass Through to Owner' },
                  { value: 'retained', label: 'Retained by Manager' },
                  { value: 'split_50_50', label: 'Split 50/50' },
                ]}
                helperText="Pass Through = cleaning fee goes to owner income. Retained = manager keeps it."
              />
            </div>
          </PolicySection>

          {/* 3. Fees & Taxes */}
          <PolicySection
            title="Fees & Taxes"
            description="Decide who absorbs each type of fee for final owner payouts."
            accentColor="bg-amber-500"
            iconBg="bg-amber-50 text-amber-600 border-amber-100/60"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971z" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <PolicySelect label="OTA / Platform Fees" value={otaFees} onChange={setOtaFees} options={ABSORPTION_OPTIONS} helperText="Airbnb, VRBO, Booking.com fees." />
              <PolicySelect label="Credit Card Fees" value={ccFees} onChange={setCcFees} options={ABSORPTION_OPTIONS} helperText="Payment processing (~2.5–3%)." />
              <PolicySelect label="Taxes" value={taxes} onChange={setTaxes} options={ABSORPTION_OPTIONS} helperText="Lodging and occupancy taxes." />
            </div>
          </PolicySection>

          {/* 4. Expenses */}
          <PolicySection
            title="Expenses & QuickBooks Integration"
            description="How imported expenses and bills appear on owner statements."
            accentColor="bg-rose-500"
            iconBg="bg-rose-50 text-rose-600 border-rose-100/60"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
              </svg>
            }
          >
            <div className="max-w-md">
              <PolicySelect
                label="Expense Reimbursement"
                value={expenseReimbursement}
                onChange={setExpenseReimbursement}
                options={[
                  { value: 'full', label: 'Full Reimbursement' },
                  { value: 'capped', label: 'Capped (with threshold)' },
                  { value: 'none', label: 'No Reimbursement (manager absorbs)' },
                ]}
              />
            </div>

            <PolicyCheckbox
              label="Include QBO Bills"
              description="In addition to Expense transactions, also include Bill transactions from QuickBooks."
              checked={includeBills}
              onChange={setIncludeBills}
            />

            {/* Excluded QBO Categories */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block font-semibold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">Excluded QBO Categories</label>
              <div className="flex gap-2 max-w-md mb-2">
                <input
                  type="text"
                  value={excludedCategory}
                  onChange={(e) => setExcludedCategory(e.target.value)}
                  placeholder="QBO category name"
                  className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
                <button type="button" onClick={handleAddCategory} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer">
                  Add
                </button>
              </div>
              {excludedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {excludedCategories.map((cat, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200/60 text-gray-800 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                      {cat}
                      <button type="button" onClick={() => setExcludedCategories(excludedCategories.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-600">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Fixed Fees */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block font-semibold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">Additional Fixed Fees</label>
              <div className="flex gap-2 max-w-lg mb-2">
                <input
                  type="text"
                  value={feeName}
                  onChange={(e) => setFeeName(e.target.value)}
                  placeholder="Fee name (e.g. Internet)"
                  className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-28 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none font-mono"
                />
                <button type="button" onClick={handleAddFee} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer">
                  Add
                </button>
              </div>
              {additionalFees.length > 0 && (
                <div className="space-y-1.5 mt-2 max-w-lg">
                  {additionalFees.map((fee, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50/60 border border-gray-200 px-3 py-1.5 rounded-lg text-xs">
                      <span className="font-medium text-gray-800">{fee.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-bold font-mono">${fee.amount}</span>
                        <button type="button" onClick={() => setAdditionalFees(additionalFees.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-600">&times;</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PolicySection>

          {/* 5. Statement Output */}
          <PolicySection
            title="Statement Output & Timing"
            description="Controls reservation date mapping and optional stats."
            accentColor="bg-gray-400"
            iconBg="bg-gray-100 text-gray-600 border-gray-200/60"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
          >
            <div className="max-w-md">
              <PolicySelect
                label="Date Basis"
                value={dateBasis}
                onChange={setDateBasis}
                options={[
                  { value: 'checkin', label: 'Check-in Date' },
                  { value: 'checkout', label: 'Check-out Date' },
                ]}
                helperText="Which reservation date determines the statement month."
              />
            </div>

            <PolicyCheckbox
              label="Include Occupancy Statistics"
              description="Total nights, occupied nights, occupancy rate, and avg nightly rate on statements."
              checked={includeOccupancy}
              onChange={setIncludeOccupancy}
            />

            <div>
              <label htmlFor="statement-note" className="block font-semibold text-gray-700 mb-1">Default Statement Note</label>
              <textarea
                id="statement-note"
                rows={3}
                value={statementNote}
                onChange={(e) => setStatementNote(e.target.value)}
                placeholder="e.g., 'Pool maintenance costs will be split starting in June...'"
                className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-800 resize-none shadow-2xs focus:border-blue-500 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">A custom message printed at the bottom of every monthly statement for this property.</p>
            </div>
          </PolicySection>

          {/* Bottom Form Actions */}
          <div className="flex justify-end pt-2">
            <PageActions actions={formActions} />
          </div>
        </form>
      </main>
    </div>
  );
}