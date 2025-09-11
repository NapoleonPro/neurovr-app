'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { FaUserCircle, FaChevronDown, FaTimes, FaBars } from 'react-icons/fa';
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection logic
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Show navbar when at the top
        if (currentScrollY === 0) {
          setIsVisible(true);
        }
        // Hide navbar when scrolling down, show when scrolling up
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide navbar
          setIsVisible(false);
          // Close any open dropdowns when hiding
          setIsDropdownOpen(false);
          setIsMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          setIsVisible(true);
        }
        
        // Remember current position
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Force show navbar when dropdowns are open
  useEffect(() => {
    if (isDropdownOpen || isMobileMenuOpen) {
      setIsVisible(true);
    }
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      console.log('Starting logout process...');
      
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      console.log('Logout completed, redirecting...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const navItems = [
    { name: 'Materi', href: '/dashboard/materi' },
    { name: 'Brain Journey', href: '/dashboard/brain-journey' },
    { name: 'Neuro Track', href: '/dashboard/neuro-track' },
    { name: 'Quiz', href: '/dashboard/quiz' },
    { name: 'Chatbot', href: '/dashboard/chatbot' },
    { name: 'Discuss', href: '/dashboard/discuss' },
    { name: 'Download', href: '/dashboard/download' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
             onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Navbar with Scroll Animation */}
      <nav className={`fixed top-4 left-4 right-4 lg:top-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-auto lg:max-w-4xl z-50 
                      transition-all duration-500 ease-in-out ${
                        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                      }`}>
        <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl lg:rounded-full shadow-2xl border border-slate-700/50 px-4 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="text-white font-bold text-lg lg:text-xl tracking-wider">
                NEURO<span className="text-cyan-400">VR</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium
                           relative group hover:scale-105"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 
                                 group-hover:w-full transition-all duration-300 ease-out"></span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button & Profile */}
            <div className="flex items-center space-x-3 lg:hidden">
              {/* Mobile Profile Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 text-white bg-slate-700/50 hover:bg-slate-600/50 
                           rounded-full px-3 py-2 transition-all duration-300 disabled:opacity-50"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full 
                                flex items-center justify-center">
                    {isLoggingOut ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaUserCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-300 
                                           ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Profile Dropdown */}
                {isDropdownOpen && !isLoggingOut && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl 
                                shadow-2xl border border-slate-700/50 py-2 animate-in slide-in-from-top-2 fade-in-0">
                    
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full 
                                      flex items-center justify-center">
                          <FaUserCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{userName}</p>
                          <p className="text-slate-400 text-xs">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link 
                        href="/dashboard/profile" 
                        className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white 
                                 hover:bg-slate-700/50 transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <HiOutlineUser className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-red-300 
                                 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <HiOutlineLogout className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsDropdownOpen(false);
                }}
                className="p-2 text-white hover:text-cyan-400 transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Profile Dropdown (separate from main nav) with Scroll Animation */}
      <div className={`hidden lg:block fixed top-6 right-8 z-50 transition-all duration-500 ease-in-out ${
                        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                      }`} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoggingOut}
          className="flex items-center space-x-3 text-white hover:text-slate-200 transition-all duration-300
                   bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-xl rounded-full px-6 py-3 
                   border border-slate-700/50 hover:border-slate-500/50 group shadow-2xl
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">
            {isLoggingOut ? 'Logging out...' : userName}
          </span>
          
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full 
                          flex items-center justify-center ring-2 ring-slate-600 group-hover:ring-slate-500
                          transition-all duration-300">
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaUserCircle className="w-7 h-7 text-white" />
              )}
            </div>
            {!isLoggingOut && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800
                            animate-pulse"></div>
            )}
          </div>

          <FaChevronDown className={`w-3 h-3 text-slate-400 transition-all duration-300 
                                   ${isDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-300'}`} />
        </button>

        {/* Desktop Dropdown Menu */}
        {isDropdownOpen && !isLoggingOut && (
          <div className="absolute top-full right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl rounded-2xl 
                        shadow-2xl border border-slate-700/50 py-2 transform transition-all duration-300
                        animate-in slide-in-from-top-2 fade-in-0">
            
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
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-5 py-3 text-slate-300 hover:text-red-300 
                         hover:bg-red-500/10 transition-all duration-200 group
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center
                                group-hover:bg-red-500/20 transition-all duration-200">
                    {isLoggingOut ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <HiOutlineLogout className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Panel with Enhanced Animation */}
      <div 
        ref={mobileMenuRef}
        className={`lg:hidden fixed left-4 right-4 bg-slate-800/95 backdrop-blur-xl rounded-2xl 
                   shadow-2xl border border-slate-700/50 z-45 transition-all duration-500 ease-in-out
                   ${isMobileMenuOpen && isVisible 
                     ? 'opacity-100 translate-y-0' 
                     : 'opacity-0 -translate-y-4 pointer-events-none'
                   }`}
        style={{ 
          top: isVisible ? '5.5rem' : '1rem' // Adjust position based on navbar visibility
        }}
      >
        <div className="py-4">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-6 py-4 text-slate-300 hover:text-white 
                       hover:bg-slate-700/50 transition-all duration-200 group border-b border-slate-700/30 last:border-b-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="font-medium">{item.name}</span>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button (Optional Enhancement) */}
      {!isVisible && lastScrollY > 300 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-slate-800/90 hover:bg-slate-700/90 
                   backdrop-blur-xl rounded-full shadow-2xl border border-slate-700/50 
                   flex items-center justify-center text-white hover:text-cyan-400 
                   transition-all duration-300 transform hover:scale-110
                   animate-in fade-in-0 slide-in-from-bottom-4"
          title="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      )}
    </>
  );
}