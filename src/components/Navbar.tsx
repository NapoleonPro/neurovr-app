// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const navItems = [
    { name: 'Download', href: '/dashboard/download' },
    { name: 'Materi', href: '/dashboard/materi' },
    { name: 'Neuro Track', href: '/dashboard/neuro-track' },
    { name: 'Brain Journey', href: '/dashboard/brain-journey' },
    { name: 'Quiz', href: '/dashboard/quiz' },
    { name: 'Chatbot', href: '/dashboard/chatbot' },
    { name: 'Discuss', href: '/dashboard/discuss' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-auto max-w-4xl z-40">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-full shadow-2xl border border-slate-700/50 px-8 py-4">
          <div className="flex items-center justify-between space-x-8">
            
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="text-white font-bold text-xl tracking-wider">
                NEURO<span className="text-cyan-400">VR</span>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium
                           relative group hover:scale-105"
                >
                  {item.name}
                  {/* Hover underline effect */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 
                                 group-hover:w-full transition-all duration-300 ease-out"></span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button (for smaller screens) */}
            <div className="lg:hidden">
              <button className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Separate Profile Dropdown */}
      <div className="fixed top-6 right-8 z-50" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 text-white hover:text-slate-200 transition-all duration-300
                   bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-xl rounded-full px-6 py-3 
                   border border-slate-700/50 hover:border-slate-500/50 group shadow-2xl"
        >
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">
            {userName}
          </span>
          
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full 
                          flex items-center justify-center ring-2 ring-slate-600 group-hover:ring-slate-500
                          transition-all duration-300">
              <FaUserCircle className="w-7 h-7 text-white" />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800
                          animate-pulse"></div>
          </div>

          {/* Dropdown Arrow */}
          <FaChevronDown className={`w-3 h-3 text-slate-400 transition-all duration-300 
                                   ${isDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-300'}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl rounded-2xl 
                        shadow-2xl border border-slate-700/50 py-2 transform transition-all duration-300
                        animate-in slide-in-from-top-2 fade-in-0">
            
            {/* User Info Header */}
            <div className="px-5 py-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full 
                              flex items-center justify-center shadow-lg">
                  <FaUserCircle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{userName}</p>
                  <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-xs font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link 
                href="/dashboard/profile" 
                className="flex items-center space-x-3 px-5 py-3 text-slate-300 hover:text-white 
                         hover:bg-slate-700/50 transition-all duration-200 group"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center
                              group-hover:bg-cyan-500/20 transition-all duration-200">
                  <HiOutlineUser className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <span className="text-sm font-medium">Profile Settings</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-5 py-3 text-slate-300 hover:text-red-300 
                         hover:bg-red-500/10 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center
                                group-hover:bg-red-500/20 transition-all duration-200">
                    <HiOutlineLogout className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                  </div>
                  <span className="text-sm font-medium">Log out</span>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}