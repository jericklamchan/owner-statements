'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/ui/PageHeader';
import PageActions from '@/components/ui/PageActions';
import { PolicySection, PolicySelect, PolicyCheckbox } from '@/components/properties/PolicyComponents';
import { PolicyInputField } from '@/components/properties/PolicyInputField';
import { PolicyListManager } from '@/components/properties/PolicyListManager';
import { PolicyTextareaField } from '@/components/properties/PolicyTextareaField';
import { PolicyFeeManager } from '@/components/properties/PolicyFeeManager';
import { AdditionalFee } from '@/types';

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
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);

  const [dateBasis, setDateBasis] = useState('checkin');
  const [includeOccupancy, setIncludeOccupancy] = useState(true);
  const [statementNote, setStatementNote] = useState('');

  useEffect(() => {
    async function fetchPropertyPolicy() {
      try {
        const res = await fetch(`/api/properties/${resolvedParams.id}/policy`);
        if (!res.ok) throw new Error('Failed to load property data.');
        
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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch policy';
        console.error('[Fetch Policy Error]:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPropertyPolicy();
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

    const policyData = {
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policyData }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save property policy.');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving.';
      console.error('[Save Policy Error]:', errorMessage);
      setError(errorMessage);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16 flex items-center justify-center">
        <p className="text-xs text-gray-500 animate-pulse">Loading property policy...</p>
      </div>
    );
  }

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
            <PolicyInputField
              id="commission-rate"
              label="Commission Rate"
              type="number"
              value={commissionRate}
              onChange={setCommissionRate}
              suffix="%"
              helperText="The percentage you charge the owner for managing this property."
            />

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

            <PolicyListManager
              title="Excluded QBO Categories"
              items={excludedCategories}
              inputValue={excludedCategory}
              onInputChange={setExcludedCategory}
              onAdd={handleAddCategory}
              onRemove={(idx) => setExcludedCategories(excludedCategories.filter((_, i) => i !== idx))}
              placeholder="QBO category name"
            />

            <PolicyFeeManager
              fees={additionalFees}
              feeName={feeName}
              feeAmount={feeAmount}
              onNameChange={setFeeName}
              onAmountChange={setFeeAmount}
              onAdd={handleAddFee}
              onRemove={(idx) => setAdditionalFees(additionalFees.filter((_, i) => i !== idx))}
            />
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

            <PolicyTextareaField
              id="statement-note"
              label="Default Statement Note"
              value={statementNote}
              onChange={setStatementNote}
              placeholder="e.g., 'Pool maintenance costs will be split starting in June...'"
              helperText="A custom message printed at the bottom of every monthly statement for this property."
            />
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