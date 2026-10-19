import Link from 'next/link';
import { FallbackCard } from '@/components/ui/FallbackCard';

export default function NotFound() {
  return (
    <FallbackCard
      icon={
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title="Page Not Found"
      description="The page or resource you are looking for doesn't exist or has been moved."
    >
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Return to Dashboard
      </Link>
    </FallbackCard>
  );
}