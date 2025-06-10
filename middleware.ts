import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/admin"]

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // En una implementación real, aquí verificarías el JWT token
    // Por ahora, permitimos el acceso ya que la verificación se hace en el cliente
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
