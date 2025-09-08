// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk static files dan API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Skip untuk file dengan extension
  ) {
    return NextResponse.next();
  }

  try {
    const supabase = await createClient();
    
    // Ambil data sesi pengguna dari cookies
    const { data: { session }, error } = await supabase.auth.getSession();

    // Logging untuk debugging
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', pathname);
    console.log('Has session:', !!session);
    console.log('Session user:', session?.user?.email || 'No user');
    console.log('Session error:', error);

    // Rute yang dianggap sebagai rute otentikasi (tidak perlu login)
    const authRoutes = ['/login', '/register'];
    
    // Rute yang dilindungi (wajib login) - GUNAKAN startsWith untuk menangkap semua subpath
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = authRoutes.includes(pathname);

    console.log('Is protected route:', isProtectedRoute);
    console.log('Is auth route:', isAuthRoute);

    // 1. Jika pengguna BELUM login dan mencoba mengakses rute yang dilindungi
    if (!session && isProtectedRoute) {
      console.log('Redirecting to login: no session for protected route');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Jika pengguna SUDAH login dan mencoba mengakses halaman login/register
    if (session && isAuthRoute) {
      console.log('Redirecting to dashboard: user already authenticated');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    console.log('Allowing access to:', pathname);
    console.log('=== END MIDDLEWARE DEBUG ===');
    
    // Jika tidak ada kondisi di atas yang terpenuhi, izinkan akses
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // Jika ada error, izinkan request melanjutkan
    return NextResponse.next();
  }
}

// Konfigurasi matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};