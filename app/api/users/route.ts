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

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      users: USERS_DB,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Verificar si el email ya existe
    const existingUser = USERS_DB.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "El email ya está registrado" }, { status: 400 })
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date().toISOString().split("T")[0],
    }

    USERS_DB.push(newUser)

    return NextResponse.json({
      success: true,
      user: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al crear usuario" }, { status: 500 })
  }
}
