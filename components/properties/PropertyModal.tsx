'use client';

import { useState, useEffect } from 'react';
import BaseModal from '@/components/ui/BaseModal';
import { PropertyRecord } from '@/types';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (property: PropertyRecord) => void;
  propertyToEdit?: PropertyRecord | null;
}

export default function PropertyModal({ isOpen, onClose, onSuccess, propertyToEdit }: PropertyModalProps) {
  const [propertyName, setPropertyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propertyToEdit) {
      setPropertyName(propertyToEdit.propertyName);
      setOwnerName(propertyToEdit.ownerName);
      setAddress(propertyToEdit.address || '');
      setCity(propertyToEdit.city || '');
      setCountry(propertyToEdit.country || '');
    } else {
      setPropertyName('');
      setOwnerName('');
      setAddress('');
      setCity('');
      setCountry('');
    }
  }, [propertyToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !ownerName) return;

    setIsSubmitting(true);
    try {
      const url = propertyToEdit ? `/api/properties/${propertyToEdit.id}` : '/api/properties';
      const method = propertyToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyName, ownerName, address, city, country }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Automatically generate 2-character initials (e.g. "Sunset Beach" -> "SB")
        const initials = propertyName
          .trim()
          .split(/\s+/)
          .map(w => w[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        const savedProperty: PropertyRecord = data.property || {
          id: propertyToEdit?.id || Date.now().toString(),
          propertyName,
          ownerName,
          address,
          city,
          country,
          avatarInitials: initials,
          status: propertyToEdit?.status || 'created',
        };

        onSuccess(savedProperty);
        onClose();
      } else {
        alert(data.error || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={propertyToEdit ? 'Edit Property' : 'Add Property'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Property Name</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Sunset Beach Villa"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Owner Name</label>
          <input 
            type="text" 
            required
            placeholder="e.g. John Doe"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Address</label>
          <input 
            type="text" 
            placeholder="e.g. 123 Pinecrest Road"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">City</label>
            <input 
              type="text" 
              placeholder="e.g. Baguio City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Country</label>
            <input 
              type="text" 
              placeholder="e.g. Philippines"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
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
            {isSubmitting ? 'Saving...' : propertyToEdit ? 'Save Changes' : 'Add Property'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}