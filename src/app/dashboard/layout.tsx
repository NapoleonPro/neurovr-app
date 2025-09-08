'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Dashboard Layout - Initial session check:', { 
          hasSession: !!session, 
          user: session?.user?.email || 'No user',
          error: error?.message,
          pathname: pathname
        });

        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          router.replace('/login');
          return;
        }

        if (!session?.user) {
          console.log('No session found, redirecting to login');
          setLoading(false);
          router.replace('/login');
          return;
        }

        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error('Error checking user:', error);
        if (mounted) {
          setLoading(false);
          router.replace('/login');
        }
      }
    };

    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setLoading(false);
          router.replace('/login');
        } else if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase.auth, pathname]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Memuat...</p>
        </div>
      </div>
    );
  }

  // No user state - will be handled by redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white">
      <Navbar user={user} />
      <main>
        {children}
      </main>
    </div>
  );
}