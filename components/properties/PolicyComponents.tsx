'use client';

import React from 'react';

export function PolicySection({
  title,
  description,
  accentColor = 'bg-blue-600',
  iconBg = 'bg-blue-50 text-blue-600 border-blue-100/60',
  icon,
  children,
}: {
  title: string;
  description: string;
  accentColor?: string;
  iconBg?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
      <div className={`h-0.5 ${accentColor}`} />
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/40 flex items-center gap-3">
        <div className={`p-1.5 rounded-lg border ${iconBg}`}>{icon}</div>
        <div>
          <h3 className="text-xs font-bold text-gray-900 tracking-tight">{title}</h3>
          <p className="text-[11px] text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-5 space-y-4 text-xs">{children}</div>
    </div>
  );
}

// Custom Select Dropdown
export function PolicySelect({
  id,
  label,
  value,
  onChange,
  options,
  helperText,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  helperText?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {helperText && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}

export function PolicyCheckbox({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 rounded-lg border border-gray-200/80 bg-gray-50/30 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
      />
      <div>
        <span className="font-semibold text-gray-900">{label}</span>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
    </label>
  );
}