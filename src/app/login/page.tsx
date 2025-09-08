'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiChevronDown } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.log('Auth check error (expected on login page):', error.message);
        }
        
        if (user) {
          console.log('User already logged in, redirecting to dashboard');
          // Get return URL from query params
          const returnUrl = searchParams?.get('from') || '/dashboard';
          router.replace(returnUrl);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setInitialCheckDone(true);
      }
    };
    
    checkUser();
  }, [supabase.auth, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Gagal login. Silakan coba lagi.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Silakan cek inbox Anda.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.';
        }
        
        setMessage(errorMessage);
        return;
      }

      if (data.user) {
        console.log('Login successful for:', data.user.email);
        
        // Small delay to ensure auth state is properly set
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get return URL from query params
        const returnUrl = searchParams?.get('from') || '/dashboard';
        
        // Use router.replace for smooth navigation
        router.replace(returnUrl);
      }
      
    } catch (error) {
      console.error('Unexpected login error:', error);
      setMessage('Terjadi kesalahan tak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const carouselImages = [
    '/neuron.jpeg',
    '/neuron2.jpeg',
    '/neuron3.jpeg',
  ];

  // Show loading while checking initial auth state
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Memuat...</p>
        </div>
      </div>
    );
  }

  // Desktop Layout
  if (!isMobile) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-gray-900 py-12 px-8 overflow-hidden">
        {/* Background dengan zoom untuk menutupi watermark */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-125 transition-transform duration-1000 ease-out hover:scale-130"
          style={{ backgroundImage: "url('/bg.jpeg')" }}
        ></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto transform transition-all duration-700 ease-out hover:scale-[1.02]">
          <div className="bg-[#1C243A]/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden grid grid-cols-2 border border-white/10 hover:border-white/20 transition-all duration-500">
            
            {/* Kolom Kiri: Form */}
            <div className="p-8 flex flex-col justify-center min-h-[600px] relative overflow-hidden">
              {/* Decorative gradients */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/15 to-transparent rounded-tl-full"></div>
              
              <div className="max-w-md mx-auto w-full space-y-8 relative z-10">
                {/* Header dengan gradient text */}
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
                    Masuk ke NeuroVR
                  </h2>
                  <p className="text-gray-400 text-lg transition-all duration-300 hover:text-gray-300">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-all duration-300 relative group font-medium">
                      Daftar
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </p>
                </div>

                {/* Form dengan enhanced animations */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative group">
                    <HiOutlineMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500 group-hover:scale-110 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-lg py-4 pl-12 pr-4 text-base relative z-10
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/80 
                               transition-all duration-300 placeholder:text-gray-500
                               hover:bg-gray-700/80 hover:shadow-lg hover:shadow-blue-500/20
                               transform hover:scale-[1.02] focus:scale-[1.02] hover:-translate-y-0.5
                               border border-transparent hover:border-blue-500/30 focus:border-blue-500/50
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="relative group">
                    <HiOutlineLockClosed className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500 group-hover:scale-110 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-lg py-4 pl-12 pr-4 text-base relative z-10
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/80 
                               transition-all duration-300 placeholder:text-gray-500
                               hover:bg-gray-700/80 hover:shadow-lg hover:shadow-blue-500/20
                               transform hover:scale-[1.02] focus:scale-[1.02] hover:-translate-y-0.5
                               border border-transparent hover:border-blue-500/30 focus:border-blue-500/50
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-all duration-300 hover:underline">
                      Lupa Password?
                    </Link>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white font-bold py-4 rounded-md 
                             hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 active:from-blue-800 active:via-blue-900 active:to-purple-900
                             transition-all duration-500 text-base
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                             transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1
                             relative overflow-hidden group
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10 transition-all duration-300 group-hover:scale-105">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Masuk'
                      )}
                    </span>
                    {!loading && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="absolute top-0 left-0 w-0 h-full bg-white/20 group-hover:w-full transition-all duration-700 ease-out skew-x-12 transform -translate-x-full group-hover:translate-x-full"></div>
                      </>
                    )}
                  </button>
                </form>

                {/* Enhanced Messages */}
                <div className="space-y-3">
                  {message && (
                    <div className="bg-red-900/60 backdrop-blur-sm border border-red-600/50 rounded-xl p-4 shadow-lg
                                  transform transition-all duration-500 hover:scale-105 animate-pulse hover:shadow-red-500/20">
                      <p className="text-center text-red-300 text-sm font-medium">{message}</p>
                    </div>
                  )}
                </div>

                {/* Social Login Alternative (Optional) */}
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#1C243A] text-gray-400">Selamat Datang Kembali!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Carousel */}
            <div className="relative h-[600px] overflow-hidden group">
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ 
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-white/40 !w-16 !h-1 !rounded-sm transition-all duration-300 hover:!bg-blue-400',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-500 !shadow-lg !shadow-blue-500/50'
                }}
                className="w-full h-full"
              >
                {carouselImages.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={src}
                        alt={`Carousel Image ${index + 1}`}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Enhanced overlay dengan gradient */}
              <div className="absolute inset-0 bg-gradient-to-bl from-black/30 via-transparent to-black/60 transition-all duration-500 group-hover:from-black/20 group-hover:to-black/50"></div>
              
              {/* Logo dengan hover effect */}
              <div className="absolute top-4 right-4 z-10 transform transition-all duration-500 hover:scale-110 hover:drop-shadow-2xl">
                <Image
                  src="/neuronobg.png"
                  alt="NeuroVR Logo"
                  width={150}
                  height={40}
                  priority
                  className="filter drop-shadow-lg"
                />
              </div>
              
              {/* Enhanced tagline dengan backdrop dan animated typing effect */}
              <div className="absolute bottom-12 left-6 right-6 z-10 transform transition-all duration-700 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform transition-all duration-500 hover:bg-black/50 hover:scale-105 hover:border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-2 tracking-wide">
                        Welcome Back!
                      </h3>
                      <p className="text-blue-200 text-sm font-medium tracking-wider uppercase opacity-90">
                        Lanjutkan Perjalanan VR Anda
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative particles */}
              <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-32 left-20 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"></div>
              <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-bounce"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Mobile/Tablet Layout
  return (
    <main className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background dengan zoom untuk mobile */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-125"
        style={{ backgroundImage: "url('/bg.jpeg')" }}
      ></div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>

      {/* Section 1: Carousel - Full Screen */}
      <section className="relative z-10 h-screen flex flex-col">
        <div className="flex-1 relative group">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-16 !h-1 !rounded-sm transition-all duration-300',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-500 !shadow-lg !shadow-blue-500/50'
            }}
            className="w-full h-full"
          >
            {carouselImages.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`Carousel Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60"></div>
          
          {/* Logo */}
          <div className="absolute top-6 left-6 z-10 transform transition-all duration-500 hover:scale-110">
            <Image
              src="/neuronobg.png"
              alt="NeuroVR Logo"
              width={140}
              height={37}
              priority
              className="filter drop-shadow-lg"
            />
          </div>
          
          {/* Enhanced content dengan card overlay */}
          <div className="absolute inset-x-6 bottom-24 z-10">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center transform transition-all duration-500 hover:bg-black/50 hover:scale-105">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </h1>
              <p className="text-blue-200 text-lg font-medium mb-6 tracking-wide uppercase opacity-90">
                Lanjutkan Perjalanan VR Anda
              </p>
              
              {/* Animated scroll indicator */}
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-md rounded-full text-white hover:from-blue-500/50 hover:to-purple-500/50 transition-all duration-500 animate-bounce hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 border border-white/20"
              >
                <HiChevronDown className="w-8 h-8" />
              </button>
              
              {/* Status indicator */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/70 text-xs font-medium">Platform Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Form - Full Screen */}
      <section id="form-section" className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm mx-auto bg-[#1C243A]/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 transform transition-all duration-500 hover:scale-105 hover:shadow-blue-500/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Masuk ke NeuroVR
            </h2>
            <p className="text-gray-400 text-sm">
              Belum punya akun?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-all duration-300 hover:underline font-medium">
                Daftar
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <HiOutlineMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500 pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-xl py-3 pl-10 pr-4 text-sm relative z-10
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-all duration-300 placeholder:text-gray-500
                         hover:bg-gray-700/80 transform hover:scale-[1.02] focus:scale-[1.02]
                         border border-transparent hover:border-blue-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="relative group">
              <HiOutlineLockClosed className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 transition-all duration-300 group-hover:text-blue-400 group-focus-within:text-blue-500 pointer-events-none" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-xl py-3 pl-10 pr-4 text-sm relative z-10
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-all duration-300 placeholder:text-gray-500
                         hover:bg-gray-700/80 transform hover:scale-[1.02] focus:scale-[1.02]
                         border border-transparent hover:border-blue-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-all duration-300 hover:underline">
                Lupa Password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold py-3 rounded-xl 
                       hover:from-blue-700 hover:to-purple-800 active:from-blue-800 active:to-purple-900
                       transition-all duration-500 text-sm
                       transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30
                       relative overflow-hidden group
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Masuk'
                )}
              </span>
              {!loading && (
                <div className="absolute top-0 left-0 w-0 h-full bg-white/20 group-hover:w-full transition-all duration-700 ease-out"></div>
              )}
            </button>
          </form>

          {/* Messages */}
          <div className="mt-6 space-y-2">
            {message && (
              <div className="bg-red-900/60 backdrop-blur-sm border border-red-600/50 rounded-xl p-3 transform transition-all duration-300 hover:scale-105">
                <p className="text-center text-red-300 text-xs">{message}</p>
              </div>
            )}
          </div>

          {/* Welcome back message */}
          <div className="text-center mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#1C243A] text-gray-400">Selamat Datang Kembali!</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}