'use client';

import { useState, useEffect } from 'react';
import BaseModal from '@/components/ui/BaseModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  userToEdit?: User | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, userToEdit }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Property Manager' | 'Owner'>('Property Manager');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role as any);
    } else {
      setName('');
      setEmail('');
      setRole('Property Manager');
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      const url = userToEdit ? `/api/users/${userToEdit.id}` : '/api/users';
      const method = userToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Ensure the returned object satisfies the full User interface
        const savedUser: User = data.user || {
          id: userToEdit?.id || `u-${Date.now()}`,
          name,
          email,
          role,
          status: userToEdit?.status || 'Active',
        };
        onSuccess(savedUser);
        onClose();
      } else {
        alert(data.error || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={userToEdit ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Full Name</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Email Address</label>
          <input 
            type="email" 
            required
            placeholder="e.g. sarah@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Property Manager">Property Manager</option>
            <option value="Owner">Owner</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : userToEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}