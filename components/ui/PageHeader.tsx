'use client';

import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function PageHeader({
  backHref = '/',
  backLabel = 'Return to Dashboard',
  title,
  subtitle,
  children,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/80">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-1.5 transition-colors"
          >
            &larr; {backLabel}
          </Link>
        )}
        {title && <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>}
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        {children}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}