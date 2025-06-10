import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos de usuarios
const USERS_DB = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "María García",
    email: "director@example.com",
    password: "director123",
    role: "admin",
    createdAt: "2024-01-16",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "usuario1@gmail.com",
    password: "user1234",
    role: "regular",
    createdAt: "2024-01-17",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    name: "Ana Rodríguez",
    email: "usuario2@gmail.com",
    password: "user1234",
    role: "regular",
    createdAt: "2024-01-18",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Buscar usuario por email (simulando login con Google)
    const user = USERS_DB.find((u) => u.email === email)

    if (!user) {
      // Si no existe, crear un nuevo usuario regular
      const newUser = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        role: "regular" as const,
        createdAt: new Date().toISOString().split("T")[0],
      }

      return NextResponse.json({
        success: true,
        user: newUser,
      })
    }

    // Actualizar último login
    user.lastLogin = new Date().toISOString().split("T")[0]

    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}
