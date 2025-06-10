import { NextResponse } from "next/server"

// Generar datos históricos para las últimas 24 horas
function generateHistoricalData() {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return hours.map((hour) => ({
    hour,
    ph: +(6.5 + Math.random() * 2).toFixed(2),
    oxygen: +(6 + Math.random() * 4).toFixed(2),
    temperature: +(20 + Math.random() * 8).toFixed(1),
    conductivity: Math.floor(400 + Math.random() * 300),
    turbidity: +(1 + Math.random() * 4).toFixed(2),
    chlorine: +(0.5 + Math.random() * 1.5).toFixed(2),
  }))
}

export async function GET() {
  try {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 600))

    const historicalData = generateHistoricalData()

    return NextResponse.json({
      success: true,
      data: historicalData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener datos históricos" }, { status: 500 })
  }
}
