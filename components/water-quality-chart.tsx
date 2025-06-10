"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Info, MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WaterQualityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [selectedParameters, setSelectedParameters] = useState<string[]>(["pH", "E_coli", "Turbidez"])
  const [isLoading, setIsLoading] = useState(false)
  const [dataSource, setDataSource] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [apiInfo, setApiInfo] = useState<{ server?: string; date?: string; url_used?: string } | null>(null)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [apiMetadata, setApiMetadata] = useState<any>(null)

  const fetchHistoricalData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/water-quality/historical")
      const data = await response.json()

      if (data.success) {
        setHistoricalData(data.data)
        setDataSource(data.source || "unknown")
        setTotalRecords(data.total_records || 0)
        setLastUpdated(new Date())
        setApiInfo(data.api_info || null)
        setApiMetadata(data.api_metadata || null)
      }
    } catch (error) {
      console.error("Error fetching historical data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoricalData()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || historicalData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el canvas
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = 300 * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = 300

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Configuración del gráfico
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Dibujar ejes
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Eje X (número de registro)
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Definir colores para cada parámetro
    const paramColors: Record<string, string> = {
      pH: "#3b82f6", // azul
      E_coli: "#ef4444", // rojo
      Coliformes_totales: "#f97316", // naranja
      Turbidez: "#10b981", // verde
      Nitratos: "#8b5cf6", // púrpura
      Fosfatos: "#ec4899", // rosa
      DBO5: "#f59e0b", // ámbar
      Solidos_suspendidos: "#6366f1", // índigo
      ICA_calculado: "#0ea5e9", // celeste
    }

    // Definir valores máximos para escalar cada parámetro
    const maxValues: Record<string, number> = {
      pH: 1, // Parece estar normalizado entre 0-1
      E_coli: 500,
      Coliformes_totales: 1000,
      Turbidez: 10,
      Nitratos: 5,
      Fosfatos: 1,
      DBO5: 15,
      Solidos_suspendidos: 50,
      ICA_calculado: 100,
    }

    // Función para dibujar línea
    const drawLine = (paramName: string) => {
      const data = historicalData.map((d) => d[paramName])
      const color = paramColors[paramName] || "#000000"
      const maxValue = maxValues[paramName] || 100

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = height - padding - (Math.min(value, maxValue) / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Marcar todos los puntos como originales si vienen de la API
      if (dataSource === "external_api_real") {
        data.forEach((value, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth
          const y = height - padding - (Math.min(value, maxValue) / maxValue) * chartHeight

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    }

    // Dibujar líneas para los parámetros seleccionados
    selectedParameters.forEach(drawLine)

    // Etiquetas del eje X (número de registro)
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    const dataLength = historicalData.length
    const step = Math.max(1, Math.floor(dataLength / 6)) // Mostrar máximo 6 etiquetas

    for (let i = 0; i < dataLength; i += step) {
      const x = padding + (i / (dataLength - 1)) * chartWidth
      const dataPoint = historicalData[i]
      const label = `#${dataPoint.registro || i + 1}`

      ctx.fillText(label, x, height - padding + 20)
    }

    // Leyenda
    const legendY = 20
    const legendItems = selectedParameters.map((param) => ({
      color: paramColors[param] || "#000000",
      label: getParameterLabel(param),
    }))

    legendItems.forEach((item, index) => {
      const itemWidth = 80
      const startX = width - legendItems.length * itemWidth - 20
      const x = startX + index * itemWidth

      // Línea de color
      ctx.strokeStyle = item.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, legendY)
      ctx.lineTo(x + 15, legendY)
      ctx.stroke()

      // Texto
      ctx.fillStyle = "#374151"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(item.label, x + 20, legendY + 4)
    })
  }, [historicalData, selectedParameters, dataSource])

  const getParameterLabel = (param: string): string => {
    const labels: Record<string, string> = {
      pH: "pH",
      E_coli: "E. Coli",
      Coliformes_totales: "Coliformes",
      Turbidez: "Turbidez",
      Nitratos: "Nitratos",
      Fosfatos: "Fosfatos",
      DBO5: "DBO5",
      Solidos_suspendidos: "Sólidos",
      ICA_calculado: "ICA",
    }
    return labels[param] || param
  }

  const toggleParameter = (param: string) => {
    if (selectedParameters.includes(param)) {
      if (selectedParameters.length > 1) {
        setSelectedParameters(selectedParameters.filter((p) => p !== param))
      }
    } else {
      if (selectedParameters.length < 7) {
        setSelectedParameters([...selectedParameters, param])
      }
    }
  }

  const getDataSourceBadge = () => {
    switch (dataSource) {
      case "external_api_real":
        return (
          <Badge variant="default" className="bg-green-500">
            API Externa - Datos Reales
          </Badge>
        )
      case "fallback":
        return <Badge variant="secondary">Datos de Respaldo</Badge>
      case "fallback_error":
        return <Badge variant="destructive">Error API - Respaldo</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-wrap">
          {getDataSourceBadge()}
          {dataSource === "external_api_real" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-green-600 cursor-help">
                    <Info className="h-3 w-3" />
                    {totalRecords} registros reales
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Datos obtenidos directamente de la API externa</p>
                  <p>Cada punto representa un registro real</p>
                  <p>Total de registros: {totalRecords}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {historicalData.length > 0 && historicalData[0].Location_ID && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
                    <MapPin className="h-3 w-3" />
                    ID: {historicalData[0].Location_ID}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ID de Ubicación: {historicalData[0].Location_ID}</p>
                  <p>Fecha: {historicalData[0].Date}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistoricalData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Actualizado: {lastUpdated.toLocaleTimeString("es-ES")}</span>
          {apiMetadata && (
            <span>
              Total registros disponibles: {apiMetadata.total_registros} | Página: {apiMetadata.pagina}
            </span>
          )}
          {apiInfo && apiInfo.server && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Server className="h-3 w-3" />
                    {apiInfo.server}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Servidor: {apiInfo.server}</p>
                  {apiInfo.date && <p>Fecha: {apiInfo.date}</p>}
                  {apiInfo.url_used && <p>URL: {apiInfo.url_used}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <p className="w-full text-sm text-gray-500 mb-2">Selecciona hasta 7 parámetros para visualizar (mínimo 1):</p>
        {Object.entries({
          pH: "pH",
          E_coli: "E. Coli",
          Coliformes_totales: "Coliformes",
          Turbidez: "Turbidez",
          Nitratos: "Nitratos",
          Fosfatos: "Fosfatos",
          DBO5: "DBO5",
          Solidos_suspendidos: "Sólidos",
        }).map(([param, label]) => (
          <Badge
            key={param}
            variant={selectedParameters.includes(param) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleParameter(param)}
          >
            {label}
          </Badge>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full h-[300px] border rounded" style={{ maxWidth: "100%" }} />

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {dataSource === "external_api_real"
            ? `Mostrando ${totalRecords} registros reales de la API externa`
            : `Mostrando ${historicalData.length} registros de respaldo`}
        </div>
        {historicalData.length > 0 && historicalData[0].Date && (
          <div>Fecha de datos: {new Date(historicalData[0].Date).toLocaleDateString("es-ES")}</div>
        )}
      </div>
    </div>
  )
}
