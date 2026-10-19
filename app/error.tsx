"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging or monitoring
    console.error("Unhandled runtime error captured:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-red-200 shadow-xs rounded-xl p-6 text-center space-y-4">
        {/* Warning Icon (Native SVG) */}
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
          <p className="text-xs text-gray-500">
            An unexpected error occurred while loading this view. You can try refreshing the component.
          </p>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-gray-400 bg-gray-50 py-1 px-2 rounded border border-gray-100">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}