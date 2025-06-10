"use client"

import { useEffect, useRef } from "react"

export function WaterQualityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el canvas
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = 300 * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = 300

    // Datos simulados para las últimas 24 horas
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const phData = hours.map(() => 6.5 + Math.random() * 2)
    const oxygenData = hours.map(() => 6 + Math.random() * 4)
    const tempData = hours.map(() => 20 + Math.random() * 8)

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Configuración del gráfico
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Dibujar ejes
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Eje X
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Función para dibujar línea
    const drawLine = (data: number[], color: string, maxValue: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = height - padding - (value / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Dibujar líneas de datos
    drawLine(phData, "#3b82f6", 14) // pH en azul
    drawLine(oxygenData, "#10b981", 15) // Oxígeno en verde
    drawLine(tempData, "#f59e0b", 35) // Temperatura en amarillo

    // Etiquetas del eje X
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    for (let i = 0; i < 24; i += 4) {
      const x = padding + (i / 23) * chartWidth
      ctx.fillText(`${i}:00`, x, height - padding + 20)
    }

    // Leyenda
    const legendY = 20
    const legendItems = [
      { color: "#3b82f6", label: "pH" },
      { color: "#10b981", label: "Oxígeno (mg/L)" },
      { color: "#f59e0b", label: "Temperatura (°C)" },
    ]

    legendItems.forEach((item, index) => {
      const x = width - 150 + index * 50

      // Línea de color
      ctx.strokeStyle = item.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x - 20, legendY)
      ctx.lineTo(x - 5, legendY)
      ctx.stroke()

      // Texto
      ctx.fillStyle = "#374151"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(item.label, x, legendY + 4)
    })
  }, [])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-[300px] border rounded" style={{ maxWidth: "100%" }} />
    </div>
  )
}
