'use client';

import { useState, useEffect } from 'react';
import ListPageLayout from '@/components/ui/ListPageLayout';
import UserModal from '@/components/users/UserModal';
import { UserRecord } from '@/types'; // Import shared type definition

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserRecord | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedUser: UserRecord) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === savedUser.id);
      if (exists) {
        return prev.map(u => u.id === savedUser.id ? { ...u, ...savedUser } : u);
      }
      return [...prev, savedUser];
    });
  };

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ListPageLayout
        title="Users"
        subtitle={`${users.length} total user`}
        searchPlaceholder="Search users or emails…"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        actionLabel="+ Add user"
        onActionClick={handleOpenAdd}
        cardTitle="Platform Users"
      >
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-400 animate-pulse">Loading users from JSON cache...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                <th className="w-2/5 px-5 py-3 text-left">User</th>
                <th className="w-1/3 px-5 py-3 text-left">Email</th>
                <th className="w-1/4 px-5 py-3 text-left">Role</th>
                <th className="w-[12%] px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const initials = user.name
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 truncate">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-blue-100 text-blue-700">
                          {initials || 'U'}
                        </div>
                        <span className="font-medium text-gray-900 truncate">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 truncate">{user.email}</td>
                    <td className="px-5 py-3 truncate">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-[11px] px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ListPageLayout>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        userToEdit={userToEdit}
      />
    </>
  );
}