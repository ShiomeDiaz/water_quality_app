"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, Users, LogOut, User, Settings } from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-blue-900">Sistema de Calidad de Agua</h1>
            </div>

            <nav className="hidden md:flex space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Administración
                  </Button>
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "Usuario"}
                </Badge>
                <span className="text-xs text-gray-500">({user.email})</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="sm:hidden">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="sm:hidden">
                    <span className="text-xs">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b px-4 py-2">
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          {user.role === "admin" && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
