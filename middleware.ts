// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

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

  console.log('Middleware - Path:', pathname);

  // Untuk sementara, biarkan semua request lewat
  // Biarkan client-side authentication yang handle
  return NextResponse.next();
}

// Konfigurasi matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};