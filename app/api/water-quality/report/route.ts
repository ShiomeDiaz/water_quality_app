import { type NextRequest, NextResponse } from "next/server"

const LOCATIONS = [
  { id: "estacion-1", name: "Estación de Monitoreo #1 - Río Principal" },
  { id: "estacion-2", name: "Estación de Monitoreo #2 - Lago Norte" },
  { id: "estacion-3", name: "Estación de Monitoreo #3 - Reservorio Sur" },
  { id: "estacion-4", name: "Estación de Monitoreo #4 - Planta de Tratamiento" },
  { id: "estacion-5", name: "Estación de Monitoreo #5 - Zona Industrial" },
]

// Generar datos específicos por ubicación
function generateLocationData(locationId: string) {
  const baseData = {
    ph: 7.2,
    oxygen: 8.5,
    temperature: 22.5,
    conductivity: 450,
    turbidity: 2.1,
    chlorine: 1.2,
  }

  // Modificar datos según la ubicación
  switch (locationId) {
    case "estacion-1": // Río Principal
      return {
        ...baseData,
        ph: +(7.0 + Math.random() * 0.4).toFixed(2),
        oxygen: +(8.0 + Math.random() * 1.5).toFixed(2),
        temperature: +(21 + Math.random() * 3).toFixed(1),
      }
    case "estacion-2": // Lago Norte
      return {
        ...baseData,
        ph: +(7.3 + Math.random() * 0.3).toFixed(2),
        oxygen: +(7.5 + Math.random() * 2).toFixed(2),
        temperature: +(20 + Math.random() * 4).toFixed(1),
      }
    case "estacion-3": // Reservorio Sur
      return {
        ...baseData,
        ph: +(7.1 + Math.random() * 0.5).toFixed(2),
        oxygen: +(8.2 + Math.random() * 1.2).toFixed(2),
        temperature: +(22 + Math.random() * 2).toFixed(1),
      }
    case "estacion-4": // Planta de Tratamiento
      return {
        ...baseData,
        ph: +(7.4 + Math.random() * 0.2).toFixed(2),
        oxygen: +(8.8 + Math.random() * 0.8).toFixed(2),
        chlorine: +(1.5 + Math.random() * 0.3).toFixed(2),
      }
    case "estacion-5": // Zona Industrial
      return {
        ...baseData,
        ph: +(6.8 + Math.random() * 0.6).toFixed(2),
        conductivity: Math.floor(500 + Math.random() * 200),
        turbidity: +(2.5 + Math.random() * 1.5).toFixed(2),
      }
    default:
      return baseData
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, location } = await request.json()

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!date || !location) {
      return NextResponse.json({ success: false, error: "Fecha y ubicación son requeridas" }, { status: 400 })
    }

    const locationData = LOCATIONS.find((loc) => loc.id === location)
    if (!locationData) {
      return NextResponse.json({ success: false, error: "Ubicación no válida" }, { status: 400 })
    }

    const reportData = generateLocationData(location)

    // Calcular evaluación general
    const evaluateQuality = (data: typeof reportData) => {
      let score = 0
      let total = 0

      // Evaluar cada parámetro
      if (data.ph >= 6.5 && data.ph <= 8.5) score += data.ph >= 7.0 && data.ph <= 7.5 ? 100 : 80
      else score += 60
      total += 100

      if (data.oxygen >= 5) score += data.oxygen >= 8 ? 100 : 80
      else score += 60
      total += 100

      if (data.temperature >= 15 && data.temperature <= 30)
        score += data.temperature >= 20 && data.temperature <= 25 ? 100 : 80
      else score += 60
      total += 100

      if (data.conductivity <= 800) score += data.conductivity <= 400 ? 100 : 80
      else score += 60
      total += 100

      if (data.turbidity <= 5) score += data.turbidity <= 1 ? 100 : 80
      else score += 60
      total += 100

      if (data.chlorine >= 0.2 && data.chlorine <= 2.0) score += data.chlorine >= 0.8 && data.chlorine <= 1.2 ? 100 : 80
      else score += 60
      total += 100

      const percentage = (score / total) * 100

      if (percentage >= 90)
        return { status: "EXCELENTE", color: "green", description: "Calidad óptima para consumo humano" }
      if (percentage >= 80)
        return { status: "BUENA", color: "blue", description: "Calidad aceptable para consumo humano" }
      if (percentage >= 70) return { status: "REGULAR", color: "yellow", description: "Requiere monitoreo adicional" }
      return { status: "DEFICIENTE", color: "red", description: "Requiere tratamiento inmediato" }
    }

    const quality = evaluateQuality(reportData)

    return NextResponse.json({
      success: true,
      report: {
        date,
        location: locationData,
        data: reportData,
        quality,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al generar reporte" }, { status: 500 })
  }
}
