// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          return;
        }

        if (sessionData.session?.user) {
          setUser(sessionData.session.user);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error getting user:', error);
        setLoading(false);
      }
    };

    getUser();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto w-full">
          
          {/* Main Welcome Text */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
              <span className="block">Selamat Datang,</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
                {userName}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 font-light max-w-4xl mx-auto leading-relaxed px-2">
              Mari jelajahi dunia neurosains dengan teknologi Virtual Reality yang menakjubkan
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center space-x-3 sm:space-x-4 mt-6 sm:mt-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 
                          hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-cyan-400/30
                          shadow-lg hover:shadow-xl">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-3">VR</div>
              <div className="text-slate-300 text-sm sm:text-base">Immersive Experience</div>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full mt-3"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 
                          hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-blue-400/30
                          shadow-lg hover:shadow-xl">
              <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-3">AI</div>
              <div className="text-slate-300 text-sm sm:text-base">Smart Learning</div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full mt-3"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 
                          hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-purple-400/30
                          shadow-lg hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-3">3D</div>
              <div className="text-slate-300 text-sm sm:text-base">Interactive Journey</div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full mt-3"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <button className="group bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-lg 
                             rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/60 
                             transition-all duration-300 hover:scale-105 hover:shadow-lg text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center 
                              group-hover:bg-cyan-400/30 transition-colors">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">Materi</div>
                  <div className="text-slate-400 text-xs">Pelajari konsep</div>
                </div>
              </div>
            </button>

            <button className="group bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
                             rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 
                             transition-all duration-300 hover:scale-105 hover:shadow-lg text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center 
                              group-hover:bg-blue-400/30 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">Brain Journey</div>
                  <div className="text-slate-400 text-xs">Eksplorasi VR</div>
                </div>
              </div>
            </button>

            <button className="group bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg 
                             rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 
                             transition-all duration-300 hover:scale-105 hover:shadow-lg text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center 
                              group-hover:bg-purple-400/30 transition-colors">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">Quiz</div>
                  <div className="text-slate-400 text-xs">Uji pemahaman</div>
                </div>
              </div>
            </button>

            <button className="group bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-lg 
                             rounded-xl p-4 border border-green-400/30 hover:border-green-400/60 
                             transition-all duration-300 hover:scale-105 hover:shadow-lg text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center 
                              group-hover:bg-green-400/30 transition-colors">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">Chatbot</div>
                  <div className="text-slate-400 text-xs">Tanya AI</div>
                </div>
              </div>
            </button>
          </div>

          {/* Learning Progress */}
          <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 text-center">Progress Pembelajaran</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Materi Diselesaikan</span>
                  <span className="text-cyan-400 font-medium">3/10</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500" 
                       style={{width: '30%'}}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm mt-4">
                  <span className="text-slate-300">Quiz Diselesaikan</span>
                  <span className="text-purple-400 font-medium">1/5</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500" 
                       style={{width: '20%'}}></div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-400/20">
                <p className="text-cyan-300 text-sm text-center">
                  <span className="font-medium">Tips:</span> Lanjutkan perjalanan pembelajaran Anda dengan mengeksplorasi Brain Journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Effect - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Desktop particles */}
        <div className="hidden sm:block">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-600 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-3/4 right-1/6 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse delay-1200"></div>
        </div>
        
        {/* Mobile particles - fewer and smaller */}
        <div className="sm:hidden">
          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-0.5 h-0.5 bg-purple-600 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-2/3 left-1/6 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
    </div>
  );
}