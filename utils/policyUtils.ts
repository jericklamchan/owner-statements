import { PropertyPolicy } from '@/types';

export const DEFAULT_PROPERTY_POLICY: Required<PropertyPolicy> = {
  commissionRate: 20,
  includeCleaningInCommission: false,
  cleaningHandling: 'pass_through',
  otaFees: 'owner_pays',
  ccFees: 'owner_pays',
  taxes: 'owner_pays',
  expenseReimbursement: 'full',
  includeBills: false,
  excludedCategories: [],
  additionalFees: [],
  dateBasis: 'checkin',
  includeOccupancy: true,
  statementNote: '',
};

export function getEffectivePolicy(customPolicy?: PropertyPolicy): Required<PropertyPolicy> {
  return {
    ...DEFAULT_PROPERTY_POLICY,
    ...customPolicy,
    excludedCategories: customPolicy?.excludedCategories ?? DEFAULT_PROPERTY_POLICY.excludedCategories,
    additionalFees: customPolicy?.additionalFees ?? DEFAULT_PROPERTY_POLICY.additionalFees,
  };
}