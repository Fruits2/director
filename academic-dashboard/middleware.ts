import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  const authCookie = req.cookies.getAll().find(c => 
    c.name.includes('auth-token') || 
    c.name.includes('access-token') ||
    c.name.startsWith('sb-')
  )

  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}