// components/NavBar.tsx
'use client';

export default function NavBar() {
  return (
    <header className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Left Side: Brand & Navigation Links */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-2xs">
              OS
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">Owner Statements</span>
          </div>

          <nav className="flex space-x-6 text-xs font-semibold">
            <a
              href="#"
              className="border-b-2 border-blue-600 pb-1 text-blue-600"
            >
              Dashboard
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
              Properties
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
              Users
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}