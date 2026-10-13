'use client';

import { useState, useEffect } from 'react';
import ListPageLayout from '@/components/ui/ListPageLayout';

interface Property {
  id: string;
  propertyName: string;
  ownerName: string;
  avatarInitials: string;
  status: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch properties from local API on mount
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle property deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this property?')) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  // Handle adding a new property (quick inline prompt for testing)
  const handleAddProperty = async () => {
    const propertyName = prompt('Enter property name:');
    if (!propertyName) return;
    const ownerName = prompt('Enter owner name:') || 'Unknown Owner';

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyName, ownerName }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => [...prev, data.property]);
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const filteredProperties = properties.filter(
    p => p.propertyName.toLowerCase().includes(search.toLowerCase()) || p.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ListPageLayout
      title="Properties"
      subtitle={`${properties.length} total property`}
      searchPlaceholder="Search properties or owners…"
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      actionLabel="+ Add property"
      onActionClick={handleAddProperty}
      cardTitle="All Properties"
    >
      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400 animate-pulse">Loading properties from JSON cache...</div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-500">No properties found.</div>
      ) : (
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="w-2/5 px-5 py-3 text-left">Property</th>
              <th className="w-1/3 px-5 py-3 text-left">Owner</th>
              <th className="w-1/4 px-5 py-3 text-left">Status</th>
              <th className="w-[12%] px-5 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProperties.map((prop) => (
              <tr key={prop.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-5 py-3 truncate">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-teal-100 text-teal-700">
                      {prop.avatarInitials || 'P'}
                    </div>
                    <span className="font-medium text-gray-900 truncate">{prop.propertyName}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600 truncate">{prop.ownerName}</td>
                <td className="px-5 py-3 truncate">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                    {prop.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex gap-1.5 justify-end">
                    <button 
                      onClick={() => alert(`Edit feature for ${prop.propertyName}`)}
                      className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(prop.id)}
                      className="text-[11px] px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ListPageLayout>
  );
}