import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie in request for next middleware/handler
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Set cookie in response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie from request
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          // Remove cookie from response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/test-supabase'
  ) {
    return response
  }

  // Get user instead of session - more reliable
  let user = null;
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error in middleware:', error.message);
      // Don't redirect on auth errors, let client handle it
      user = null;
    } else {
      user = data.user;
    }
  } catch (err) {
    console.error('Middleware auth error:', err);
    user = null;
  }

  console.log('Middleware - Path:', pathname, 'Has User:', !!user, 'User Email:', user?.email)

  // Public routes
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If no user and trying to access protected route
  if (!user && isProtectedRoute) {
    console.log('No user, redirecting to login from:', pathname)
    const loginUrl = new URL('/login', request.url)
    // Add return url for better UX
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If has user and accessing login/register pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    console.log('User logged in, redirecting from auth page to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If has user and accessing root
  if (user && pathname === '/') {
    console.log('User logged in, redirecting from root to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}