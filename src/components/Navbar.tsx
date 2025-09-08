// src/components/Navbar.tsx
'use client'; // Komponen ini butuh interaktivitas, jadi kita tandai sebagai Client Component

import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // Klien untuk di sisi browser
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { FaUserCircle } from 'react-icons/fa'; // Icon default

// Definisikan tipe props, termasuk user
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
    router.refresh(); // Refresh untuk membersihkan state
  };

  // Klik di luar dropdown akan menutupnya
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

  const userName = user?.user_metadata?.full_name || 'User';

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-auto max-w-[90%] z-50">
      <div className="container mx-auto px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full shadow-lg flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard">
          <Image
            src="/neurovr-logo.png"
            alt="NeuroVR Logo"
            width={120}
            height={32}
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard/download" className="text-gray-300 hover:text-white transition-colors">Download</Link>
          <Link href="/dashboard/materi" className="text-gray-300 hover:text-white transition-colors">Materi</Link>
          <Link href="/dashboard/neuro-track" className="text-gray-300 hover:text-white transition-colors">Neuro Track</Link>
          <Link href="/dashboard/brain-journey" className="text-gray-300 hover:text-white transition-colors">Brain Journey</Link>
          <Link href="/dashboard/quiz" className="text-gray-300 hover:text-white transition-colors">Quiz</Link>
          <Link href="/dashboard/chatbot" className="text-gray-300 hover:text-white transition-colors">Chatbot</Link>
          <Link href="/dashboard/discuss" className="text-gray-300 hover:text-white transition-colors">Discuss</Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white"
          >
            <span>{userName}</span>
            <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center">
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-48 bg-slate-800 rounded-lg shadow-xl py-2">
              <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-300 hover:bg-slate-700">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-slate-700"
              >
                Log out
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}