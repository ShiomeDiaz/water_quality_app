// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useAuth } from "@/components/auth-provider"
// import { useToast } from "@/hooks/use-toast"

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const { loginWithGoogle } = useAuth()
//   const { toast } = useToast()
//   const router = useRouter()

//   // const handleGoogleLogin = async () => {
//   //   setIsLoading(true)
//   //   try {
//   //     await loginWithGoogle()
//   //     toast({
//   //       title: "Éxito",
//   //       description: "Sesión iniciada con Google",
//   //     })
//   //     router.push("/dashboard")
//   //   } catch (error) {
//   //     toast({
//   //       title: "Error",
//   //       description: "Error al iniciar sesión con Google",
//   //       variant: "destructive",
//   //     })
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }
//   const handleGoogleLogin = () => {
//   loginWithGoogle()
//   // No pongas setIsLoading(true), toast, ni router.push aquí,
//   // porque la página se redirige inmediatamente.
// }


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold text-blue-900">Sistema de Calidad de Agua</CardTitle>
//           <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <img
//               src="/placeholder.svg?height=100&width=100"
//               alt="Logo"
//               className="h-24 w-24 rounded-full bg-blue-100 p-2"
//             />
//             <p className="text-center text-sm text-gray-600">
//               Accede con tu cuenta de Google para monitorear y analizar la calidad del agua
//             </p>
//           </div>

//           <Button
//             variant="outline"
//             className="w-full flex items-center justify-center gap-2"
//             onClick={handleGoogleLogin}
  
//           >
//             <svg className="h-5 w-5" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Iniciar con Google
//           </Button>

//           <div className="text-center text-xs text-gray-500 mt-4">
//             Al iniciar sesión, aceptas nuestros términos y condiciones de uso
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const { loginWithGoogle } = useAuth()

  const handleGoogleLogin = () => {
    loginWithGoogle()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Sistema de Calidad de Agua</CardTitle>
          <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="Logo"
              className="h-24 w-24 rounded-full bg-blue-100 p-2"
            />
            <p className="text-center text-sm text-gray-600">
              Accede con tu cuenta de Google para monitorear y analizar la calidad del agua
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Iniciar con Google
          </Button>

          <div className="text-center text-xs text-gray-500 mt-4">
            Al iniciar sesión, aceptas nuestros términos y condiciones de uso
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
