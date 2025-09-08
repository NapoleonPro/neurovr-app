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
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        // First try to get session - this doesn't trigger auth errors
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Dashboard Layout - Session check:', { 
          hasSession: !!sessionData.session, 
          userEmail: sessionData.session?.user?.email || 'No session',
          error: sessionError?.message,
          pathname: pathname
        });

        if (!mounted) return;

        if (sessionError) {
          console.error('Session check error:', sessionError);
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
          router.replace('/login');
          return;
        }

        if (sessionData.session?.user) {
          // We have a valid session
          setUser(sessionData.session.user);
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // No session found - try getUser (this might refresh token)
        try {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (!mounted) return;

          if (userError) {
            // Handle specific auth errors gracefully
            if (userError.message.includes('Auth session missing') ||
                userError.message.includes('session_not_found') ||
                userError.message.includes('Invalid Refresh Token') || 
                userError.message.includes('refresh_token_not_found')) {
              
              console.log('No valid session found, redirecting to login');
              setUser(null);
              setLoading(false);
              setAuthChecked(true);
              router.replace('/login');
            } else {
              // Network or other errors - don't redirect immediately
              console.error('User check error (non-auth):', userError);
              setLoading(false);
              setAuthChecked(true);
            }
            return;
          }

          if (!userData.user) {
            console.log('No user found, redirecting to login');
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
            router.replace('/login');
            return;
          }

          setUser(userData.user);
          setAuthChecked(true);
        } catch (userFetchError) {
          console.error('Error fetching user:', userFetchError);
          if (mounted) {
            // On any error fetching user, redirect to login
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
            router.replace('/login');
          }
        }

      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
          router.replace('/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
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

        if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting to login');
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
          // Use window.location for hard redirect after logout
          window.location.href = '/login';
          return;
        } 
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in');
          setUser(session.user);
          setLoading(false);
          setAuthChecked(true);
        } 
        
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed');
          setUser(session.user);
          setLoading(false);
          setAuthChecked(true);
        }

        // Handle case where session becomes null unexpectedly
        if (!session) {
          console.log('Session lost unexpectedly');
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
          router.replace('/login');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase.auth, pathname]);

  // Show loading while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Memuat...</p>
        </div>
      </div>
    );
  }

  // No user state - show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Mengarahkan...</p>
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