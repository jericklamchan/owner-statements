'use client';

import { useState } from 'react';
import ListPageLayout from '@/components/ui/ListPageLayout';

const INITIAL_PROPERTIES = [
  { id: 'p-1', name: 'Sample Mountain Cabin', owner: 'John Doe', address: '123 Pine Rd', initials: 'SM', color: 'bg-teal-100 text-teal-700' },
];

export default function PropertiesPage() {
  const [search, setSearch] = useState('');

  const filteredProperties = INITIAL_PROPERTIES.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ListPageLayout
      title="Properties"
      subtitle={`${INITIAL_PROPERTIES.length} property`}
      searchPlaceholder="Search properties or owners…"
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      actionLabel="+ Add property"
      onActionClick={() => alert('Add property modal/action')}
      cardTitle="All Properties"
    >
      <table className="w-full text-xs table-fixed">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
            <th className="w-2/5 px-5 py-3 text-left">Property</th>
            <th className="w-1/4 px-5 py-3 text-left">Owner</th>
            <th className="w-1/4 px-5 py-3 text-left">Address</th>
            <th className="w-[10%] px-5 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredProperties.map((prop) => (
            <tr key={prop.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-5 py-3 truncate">
                <div className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${prop.color}`}>
                    {prop.initials}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{prop.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-600 truncate">{prop.owner}</td>
              <td className="px-5 py-3 text-gray-500 truncate">{prop.address}</td>
              <td className="px-5 py-3 text-right">
                <div className="flex gap-1.5 justify-end">
                  <button className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-medium">Edit</button>
                  <button className="text-[11px] px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium">Remove</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ListPageLayout>
  );
}