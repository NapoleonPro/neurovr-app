// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Import klien server yang baru kita buat

export async function middleware(request: NextRequest) {
  const supabase = createClient();

  // Ambil data sesi pengguna dari cookies
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Rute yang dianggap sebagai rute otentikasi (tidak perlu login)
  const authRoutes = ['/login', '/register'];
  // Rute yang dilindungi (wajib login)
  const protectedRoutes = ['/dashboard'];

  // --- Logika Penjaga Gerbang ---

  // 1. Jika pengguna BELUM login dan mencoba mengakses rute yang dilindungi
  if (!session && protectedRoutes.includes(pathname)) {
    // Alihkan (redirect) ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika pengguna SUDAH login dan mencoba mengakses halaman login/register
  if (session && authRoutes.includes(pathname)) {
    // Alihkan (redirect) ke dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Jika tidak ada kondisi di atas yang terpenuhi, izinkan akses
  return NextResponse.next();
}

// Tentukan rute mana saja yang akan dijalankan oleh middleware ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua path request kecuali untuk:
     * - _next/static (file statis)
     * - _next/image (optimisasi gambar)
     * - favicon.ico (file favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};