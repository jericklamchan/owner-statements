'use client';

import React from 'react';
import Link from 'next/link';

interface ActionItem {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

interface PageActionsProps {
  actions: ActionItem[];
  extraContent?: React.ReactNode;
}

export default function PageActions({ actions, extraContent }: PageActionsProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {extraContent}
      {actions.map((action, idx) => {
        const baseStyles = "text-xs font-medium px-4 py-2 rounded-lg transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50";
        
        let variantStyles = "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50";
        if (action.variant === 'primary') {
          // Updated to consistent blue primary styling
          variantStyles = "font-semibold bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-xs";
        } else if (action.variant === 'secondary') {
          variantStyles = "font-semibold border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/60";
        }

        if (action.href && !action.disabled) {
          return (
            <Link key={idx} href={action.href} className={`${baseStyles} ${variantStyles}`}>
              {action.label}
            </Link>
          );
        }

        return (
          <button
            key={idx}
            type={action.type || 'button'}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`${baseStyles} ${variantStyles}`}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}