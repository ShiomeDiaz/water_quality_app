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
    ph: { excellent: [0, 0.3], good: [0.3, 0.7], fair: [0.7, 0.9] },
    e_coli: { excellent: [0, 50], good: [50, 150], fair: [150, 250] },
    coliformes_totales: { excellent: [0, 200], good: [200, 600], fair: [600, 900] },
    turbidez: { excellent: [0, 1], good: [1, 3], fair: [3, 4] },
    nitratos: { excellent: [0, 0.3], good: [0.3, 0.7], fair: [0.7, 0.9] },
    fosfatos: { excellent: [0, 0.1], good: [0.1, 0.25], fair: [0.25, 0.32] },
    dbo5: { excellent: [0, 20], good: [20, 50], fair: [50, 70] },
    solidos_suspendidos: { excellent: [0, 30], good: [30, 70], fair: [70, 90] },
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

    const today = new Date().toISOString().split("T")[0]
    const apiUrl = `http://127.0.0.1:3033/registros?fecha_inicio=${today}&page=1&limit=1`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-cache", // Asegurarse de obtener datos frescos
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const externalData = await response.json()

    const metrics = [
      {
        id: "ph",
        name: "pH",
        value: externalData['registros'][0]['pH'],
        unit: "",
        status: getStatus("ph", externalData['registros'][0]['pH']),
        range: { min: 0, max: 0.5 },
      },
      {
        id: "e_coli",
        name: "E. Coli",
        value: externalData['registros'][0]['E_coli'],
        unit: "UFC/100ml",
        status: getStatus("e_coli", externalData['registros'][0]['E_coli']),
        range: { min: 0, max: 500 },
      },
      {
        id: "coliformes_totales",
        name: "Coliformes Totales",
        value: externalData['registros'][0]['Coliformes_totales'],
        unit: "UFC/100ml",
        status: getStatus("coliformes_totales", externalData['registros'][0]['Coliformes_totales']),
        range: { min: 0, max: 1000 },
      },
      {
        id: "turbidez",
        name: "Turbidez",
        value: externalData['registros'][0]['Turbidez'],
        unit: "NTU",
        status: getStatus("turbidez",externalData['registros'][0]['Turbidez']),
        range: { min: 0, max: 10 },
      },
      {
        id: "nitratos",
        name: "Nitratos",
        value: externalData['registros'][0]['Nitratos'],
        unit: "mg/L",
        status: getStatus("nitratos", externalData['registros'][0]['Nitratos']),
        range: { min: 0, max: 5 },
      },
      {
        id: "fosfatos",
        name: "Fosfatos",
        value: externalData['registros'][0]['Fosfatos'],
        unit: "mg/L",
        status: getStatus("fosfatos", externalData['registros'][0]['Fosfatos']),
        range: { min: 0, max: 1 },
      },
      {
        id: "dbo5",
        name: "DBO5",
        value: externalData['registros'][0]['DBO5'],
        unit: "mg/L",
        status: getStatus("dbo5", externalData['registros'][0]['DBO5']),
        range: { min: 0, max: 15 },
      },
      {
        id: "solidos_suspendidos",
        name: "Sólidos Suspendidos",
        value: externalData['registros'][0]['Solidos_suspendidos'],
        unit: "mg/L",
        status: getStatus("solidos_suspendidos",externalData['registros'][0]['Solidos_suspendidos']),
        range: { min: 0, max: 50 },
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
