'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const isDashboard = pathname === '/' || pathname.startsWith('/statements');
  const isProperties = pathname === '/properties';
  const isUsers = pathname === '/users';

  return (
    <header className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Left Side: Brand & Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-2xs">
              OS
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">Owner Statements</span>
          </Link>

          <nav className="flex space-x-6 text-xs font-semibold">
            <Link
              href="/"
              className={`pb-1 transition-colors cursor-pointer border-b-2 ${
                isDashboard
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/properties"
              className={`pb-1 transition-colors cursor-pointer border-b-2 ${
                isProperties
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/users"
              className={`pb-1 transition-colors cursor-pointer border-b-2 ${
                isUsers
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Users
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}