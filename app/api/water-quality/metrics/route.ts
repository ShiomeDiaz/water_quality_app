import { NextResponse } from "next/server"

// Función para generar datos aleatorios realistas
function generateRealisticData() {
  return {
    ph: +(6.5 + Math.random() * 2).toFixed(2),
    oxygen: +(6 + Math.random() * 4).toFixed(2),
    temperature: +(20 + Math.random() * 8).toFixed(1),
    conductivity: Math.floor(400 + Math.random() * 300),
    turbidity: +(1 + Math.random() * 4).toFixed(2),
    chlorine: +(0.5 + Math.random() * 1.5).toFixed(2),
  }
}

// Función para determinar el estado basado en el valor
function getStatus(parameter: string, value: number): "excellent" | "good" | "fair" | "poor" {
  const ranges: Record<string, { excellent: [number, number]; good: [number, number]; fair: [number, number] }> = {
    ph: { excellent: [7.0, 7.5], good: [6.8, 7.8], fair: [6.5, 8.0] },
    oxygen: { excellent: [8, 10], good: [6, 8], fair: [4, 6] },
    temperature: { excellent: [20, 25], good: [18, 28], fair: [15, 30] },
    conductivity: { excellent: [200, 400], good: [400, 600], fair: [600, 800] },
    turbidity: { excellent: [0, 1], good: [1, 2], fair: [2, 4] },
    chlorine: { excellent: [0.8, 1.2], good: [0.5, 1.5], fair: [0.2, 2.0] },
  }

  const range = ranges[parameter]
  if (!range) return "fair"

  if (value >= range.excellent[0] && value <= range.excellent[1]) return "excellent"
  if (value >= range.good[0] && value <= range.good[1]) return "good"
  if (value >= range.fair[0] && value <= range.fair[1]) return "fair"
  return "poor"
}

export async function GET() {
  try {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    const data = generateRealisticData()

    const metrics = [
      {
        id: "ph",
        name: "pH",
        value: data.ph,
        unit: "",
        status: getStatus("ph", data.ph),
        range: { min: 6.5, max: 8.5 },
      },
      {
        id: "oxygen",
        name: "Oxígeno Disuelto",
        value: data.oxygen,
        unit: "mg/L",
        status: getStatus("oxygen", data.oxygen),
        range: { min: 5, max: 10 },
      },
      {
        id: "temperature",
        name: "Temperatura",
        value: data.temperature,
        unit: "°C",
        status: getStatus("temperature", data.temperature),
        range: { min: 15, max: 30 },
      },
      {
        id: "conductivity",
        name: "Conductividad",
        value: data.conductivity,
        unit: "μS/cm",
        status: getStatus("conductivity", data.conductivity),
        range: { min: 200, max: 800 },
      },
      {
        id: "turbidity",
        name: "Turbidez",
        value: data.turbidity,
        unit: "NTU",
        status: getStatus("turbidity", data.turbidity),
        range: { min: 0, max: 5 },
      },
      {
        id: "chlorine",
        name: "Cloro Residual",
        value: data.chlorine,
        unit: "mg/L",
        status: getStatus("chlorine", data.chlorine),
        range: { min: 0.2, max: 2.0 },
      },
    ]

    // Calcular ICA
    const avgScore =
      metrics.reduce((acc, metric) => {
        const score =
          metric.status === "excellent" ? 90 : metric.status === "good" ? 75 : metric.status === "fair" ? 60 : 40
        return acc + score
      }, 0) / metrics.length

    return NextResponse.json({
      success: true,
      data: {
        ica: Math.round(avgScore),
        metrics,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener métricas" }, { status: 500 })
  }
}
