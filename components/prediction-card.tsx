"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, RefreshCw, Calendar, MapPin, Brain, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PredictionData {
  location_id: number
  fecha_prediccion: string
  ica_predicho: number
  input_data?: any
  timestamp: string
  source: string
  error?: string
}

export function PredictionCard() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { toast } = useToast()

  const fetchPrediction = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/water-quality/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setPredictionData(data.data)
        setLastUpdated(new Date())

        if (data.data.source === "fallback") {
          toast({
            title: "Predicción de respaldo",
            description: "No se pudo conectar con la API de predicción. Mostrando datos simulados.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching prediction:", error)
      toast({
        title: "Error",
        description: "No se pudo obtener la predicción",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrediction()
  }, [])

  const getPredictionStatusColor = (ica: number) => {
    if (ica >= 85) return "text-green-600"
    if (ica >= 70) return "text-blue-600"
    if (ica >= 50) return "text-yellow-600"
    if (ica >= 25) return "text-orange-600"
    return "text-red-600"
  }

  const getPredictionCategory = (ica: number) => {
    if (ica >= 85) return "Excelente"
    if (ica >= 70) return "Buena"
    if (ica >= 50) return "Regular"
    if (ica >= 25) return "Deficiente"
    return "Muy Deficiente"
  }

  const getSourceBadge = () => {
    switch (predictionData?.source) {
      case "prediction_api":
        return (
          <Badge variant="default" className="bg-purple-500">
            <Brain className="h-3 w-3 mr-1" />
            IA Predicción
          </Badge>
        )
      case "fallback":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Simulado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!predictionData) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Predicción ICA
          </CardTitle>
          <CardDescription>Cargando predicción...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Predicción ICA
          </CardTitle>
          <div className="flex items-center gap-2">
            {getSourceBadge()}
            <Button variant="outline" size="sm" onClick={fetchPrediction} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <CardDescription>Predicción del Índice de Calidad de Agua para mañana</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fecha de predicción */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Fecha predicha:</span>
          <span>{formatDate(predictionData.fecha_prediccion)}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Ubicación ID:</span>
          <span>{predictionData.location_id}</span>
        </div>

        {/* Valor predicho */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-purple-900">{predictionData.ica_predicho.toFixed(1)}</div>
            <div className={`text-lg font-semibold ${getPredictionStatusColor(predictionData.ica_predicho)}`}>
              {getPredictionCategory(predictionData.ica_predicho)}
            </div>
          </div>
          <div className="w-32">
            <Progress value={predictionData.ica_predicho} className="h-3" />
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Confianza del modelo:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help">
                    {predictionData.source === "prediction_api" ? "Alta" : "Simulado"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {predictionData.source === "prediction_api"
                      ? "Predicción generada por modelo de IA entrenado"
                      : "Datos simulados - API no disponible"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {lastUpdated && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Última actualización:</span>
              <span>{lastUpdated.toLocaleTimeString("es-ES")}</span>
            </div>
          )}

          {predictionData.error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              {predictionData.error}
            </div>
          )}
        </div>

        {/* Datos de entrada (solo para debug) */}
        {predictionData.input_data && predictionData.source === "prediction_api" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-gray-400 cursor-help">Basado en datos actuales de calidad de agua</div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1 text-xs">
                  <p>pH: {predictionData.input_data.pH?.toFixed(3)}</p>
                  <p>E. Coli: {predictionData.input_data.E_coli?.toFixed(1)}</p>
                  <p>Turbidez: {predictionData.input_data.Turbidez?.toFixed(2)}</p>
                  <p>Fecha base: {predictionData.input_data.fecha}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )
}
