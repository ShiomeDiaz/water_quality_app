import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos de usuarios
const USERS_DB = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "María García",
    email: "director@example.com",
    role: "admin",
    createdAt: "2024-01-16",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "usuario1@gmail.com",
    role: "regular",
    createdAt: "2024-01-17",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    name: "Ana Rodríguez",
    email: "usuario2@gmail.com",
    role: "regular",
    createdAt: "2024-01-18",
  },
]

// PUT - Actualizar usuario
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, email, role } = await request.json()
    const { id } = params

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 600))

    const userIndex = USERS_DB.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar si el email ya existe en otro usuario
    const existingUser = USERS_DB.find((u) => u.email === email && u.id !== id)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "El email ya está registrado" }, { status: 400 })
    }

    // Actualizar usuario
    USERS_DB[userIndex] = {
      ...USERS_DB[userIndex],
      name,
      email,
      role,
    }

    return NextResponse.json({
      success: true,
      user: USERS_DB[userIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 400))

    const userIndex = USERS_DB.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar usuario
    USERS_DB.splice(userIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al eliminar usuario" }, { status: 500 })
  }
}
