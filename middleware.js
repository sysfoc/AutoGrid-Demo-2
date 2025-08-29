// middleware.js
import { NextResponse } from 'next/server'
import { verifyToken } from "./app/lib/auth"

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Protected admin routes
  const adminRoutes = [
    '/admin/manage-users',
    '/admin/createUser',
    '/api/users',
    'api/users/me',
    // Add other admin routes here
  ]

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const user = await verifyToken(token)
      if (user.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}