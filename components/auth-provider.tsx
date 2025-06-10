// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { useRouter } from "next/navigation"

// interface User {
//   id: string
//   name: string
//   email: string
//   role: "admin" | "regular"
// }

// interface AuthContextType {
//   user: User | null
//   loginWithGoogle: () => Promise<void>
//   logout: () => void
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     // Verificar si hay una sesión guardada
//     const savedUser = localStorage.getItem("user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   const loginWithGoogle = async () => {
//     setIsLoading(true)
//     try {
//       // Generar un email aleatorio para simular diferentes usuarios
//       const randomEmails = [
//         "usuario1@gmail.com",
//         "usuario2@gmail.com",
//         "admin@example.com",
//         "director@example.com",
//         "usuario3@hotmail.com",
//         "test@gmail.com",
//       ]

//       const randomEmail = randomEmails[Math.floor(Math.random() * randomEmails.length)]

//       // Llamar a la API de autenticación
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: randomEmail }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         setUser(data.user)
//         localStorage.setItem("user", JSON.stringify(data.user))
//       } else {
//         throw new Error(data.error || "Error en la autenticación")
//       }
//     } catch (error) {
//       console.error("Error en login:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("user")
//     router.push("/login")
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loginWithGoogle,
//         logout,
//         isLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "regular"
}

interface AuthContextType {
  user: User | null
  loginWithGoogle: () => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:8080/api/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.email) {
          setUser({
            id: data.id || "",
            name: data.name || "",
            email: data.email,
            role: data.role === "admin" ? "admin" : "regular",
          })
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

const logout = () => {
  fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest" // <- Indica que es una petición AJAX
    }
  })
    .finally(() => {
      setUser(null);
      router.push("/login");
    });
}


  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
