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

  // Get session with retry mechanism for production
  let session = null;
  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        if (retryCount === maxRetries) {
          // If we can't get session after retries, treat as no session
          session = null;
          break;
        }
      } else {
        session = data.session;
        break;
      }
    } catch (err) {
      console.error('Session fetch error:', err);
      if (retryCount === maxRetries) {
        session = null;
        break;
      }
    }
    
    retryCount++;
    // Small delay before retry
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('Middleware - Path:', pathname, 'Has Session:', !!session?.user, 'User Email:', session?.user?.email)

  // Public routes
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If no session and trying to access protected route
  if (!session?.user && isProtectedRoute) {
    console.log('No session, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If has session and accessing login/register pages
  if (session?.user && (pathname === '/login' || pathname === '/register')) {
    console.log('User logged in, redirecting from auth page to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If has session and accessing root
  if (session?.user && pathname === '/') {
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