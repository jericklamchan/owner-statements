'use client';

import Image from 'next/image';

type StatementInvoiceHeaderProps = {
  statementId: string;
  monthYear: string;
};

export default function StatementInvoiceHeader({ statementId, monthYear }: StatementInvoiceHeaderProps) {
  const invoiceNumber = `INV-${(statementId || '').slice(-6).toUpperCase() || '000001'}`;

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xs">
      {/* Left side: Logo & Invoice details */}
      <div className="space-y-4">
        {/* Company Logo Image */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-36">
            <Image
              src="/logo.jpeg"
              alt="Jerick Chan Inc Logo"
              fill
              sizes="140px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Statement Period Ending
            </p>
            <p className="font-bold text-gray-900 mt-1">{monthYear}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Invoice Number
            </p>
            <p className="font-mono font-bold text-gray-900 mt-1">{invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Right side: Company Address */}
      <div className="text-left sm:text-right text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-900">Jerick Chan Inc.</p>
        <p>123 Property Management Way</p>
        <p>Suite 88, Baguio City, PH 2600</p>
      </div>
    </div>
  );
}