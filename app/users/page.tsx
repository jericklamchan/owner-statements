// app/users/page.tsx
'use client';

import { useState } from 'react';
import ListPageLayout from '@/components/ui/ListPageLayout';

const INITIAL_USERS = [
  { id: 'u-1', name: 'Admin User', email: 'admin@ownerstatements.com', role: 'Admin', initials: 'AU', color: 'bg-blue-100 text-blue-700' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filteredUsers = INITIAL_USERS.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ListPageLayout
      title="Users"
      subtitle={`${INITIAL_USERS.length} user`}
      searchPlaceholder="Search users or emails…"
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      actionLabel="+ Invite user"
      onActionClick={() => alert('Invite user modal/action')}
      cardTitle="Platform Users"
    >
      <table className="w-full text-xs table-fixed">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
            <th className="w-2/5 px-5 py-3 text-left">User</th>
            <th className="w-1/4 px-5 py-3 text-left">Email</th>
            <th className="w-1/4 px-5 py-3 text-left">Role</th>
            <th className="w-[10%] px-5 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-5 py-3 truncate">
                <div className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${user.color}`}>
                    {user.initials}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{user.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-600 truncate">{user.email}</td>
              <td className="px-5 py-3 text-gray-500 truncate">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 uppercase">
                  {user.role}
                </span>
              </td>
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