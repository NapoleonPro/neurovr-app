// middleware.ts (di root)
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr' 
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Panggil fungsi updateSession dari Supabase
  const response = await updateSession(request)
  
  // Ambil data user dari sesi yang sudah di-refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rute yang dilindungi
  const protectedRoutes = ['/dashboard']

  // Logika redirect tetap sama
  if (!user && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}