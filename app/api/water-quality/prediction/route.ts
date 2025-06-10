import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Obtener datos actuales para usar como base para la predicción
    const today = new Date().toISOString().split("T")[0]
    const apiUrl = `http://127.0.0.1:3033/registros?fecha_inicio=${today}&page=1&limit=1`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-cache",
    })

    let currentData = null
    if (response.ok) {
      const externalData = await response.json()
      if (externalData["registros"] && externalData["registros"] .length > 0) {
        currentData = externalData["registros"][0]
      }
    }

    // Si no hay datos actuales, usar valores de respaldo
    if (!currentData) {
      currentData = {
        pH: 0.3790424722765272,
        E_coli: 170.94825859736358,
        Coliformes_totales: 452.7410811986533,
        Turbidez: 2.3158245807864213,
        Nitratos: 0.7190337917458149,
        Fosfatos: 0.1531624166704012,
        DBO5: 3.82357352275224,
        Solidos_suspendidos: 13.237443814510591,
        Location_ID: 2336240,
      }
    }

    // Preparar datos para la API de predicción
    const predictionPayload = {
      location_ID: currentData["Location_ID"] || 1,
      fecha: today,
      features_0_to_10: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1],
      pH: currentData["pH"],
      E_coli: currentData["E_coli"],
      Coliformes_totales: currentData["Coliformes_totales"],
      Turbidez: currentData["Turbidez"],
      Nitratos: currentData["Nitratos"],
      Fosfatos: currentData["Fosfatos"],
      DBO5: currentData["DBO5"],
      Solidos_suspendidos: currentData["Solidos_suspendidos"],
    }

    // Llamar a la API de predicción
    const predictionResponse = await fetch("http://localhost:8080/api/predictions/ica", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(predictionPayload),
    })
    console.log(predictionResponse)

    if (!predictionResponse.ok) {
      throw new Error(`Prediction API error: ${predictionResponse.status}`)
    }

    const predictionData = await predictionResponse.json()

    return NextResponse.json({
      success: true,
      data: {
        location_id: predictionData.location_id,
        fecha_prediccion: predictionData.fecha_prediccion,
        ica_predicho: predictionData.ica_predicho,
        input_data: predictionPayload,
        timestamp: new Date().toISOString(),
        source: "prediction_api",
      },
    })
  } catch (error) {
    console.error("Error al obtener predicción:", error)

    // Datos de respaldo en caso de error
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return NextResponse.json({
      success: true,
      data: {
        location_id: 1,
        fecha_prediccion: tomorrow.toISOString().split("T")[0],
        ica_predicho: 45.2,
        timestamp: new Date().toISOString(),
        source: "fallback",
        error: `Failed to fetch prediction: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    })
  }
}
