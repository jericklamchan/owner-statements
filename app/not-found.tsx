import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-8 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="text-sm text-gray-600">
          The page or resource you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}