export default function Loading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Main Content Card Skeleton */}
      <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="h-5 w-36 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-24 bg-gray-100 rounded-md"></div>
        </div>

        <div className="space-y-4">
          <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
          <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
          <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}