'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FallbackCard } from '@/components/ui/FallbackCard';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global App Boundary Error]:', error);
  }, [error]);

  return (
    <FallbackCard
      icon={
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }
      title="Something went wrong"
      description={error.message || 'An unexpected error occurred while rendering this page.'}
    >
      <button
        onClick={reset}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Try Again
      </button>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Return to Dashboard
      </Link>
    </FallbackCard>
  );
}