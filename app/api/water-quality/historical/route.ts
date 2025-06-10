import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Consumir la API externa - solo 1 registro de hoy
    const today = new Date().toISOString().split("T")[0]
    const apiUrl = `http://127.0.0.1:3033/registros?fecha_inicio=${today}&page=1&limit=24`

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
    //console.log(externalData['registros'])
    // Transformar el único registro obtenido de la estructura correcta
    let baseRecord = null
    if (externalData.registros && externalData.registros.length > 0) {
      baseRecord = externalData.registros[0]
    }

    // Generar 24 registros basados en el registro real con variaciones mínimas
    const transformedData = Array.from({ length: 24 }, (_, index) => {
      if (baseRecord) {
        // Aplicar pequeñas variaciones aleatorias al registro base
        const variation = () => 0.95 + Math.random() * 0.1 // Variación del ±5%

        return {
          hour: index,
          ph: +(baseRecord.pH * variation()).toFixed(2) || 7.0,
          calidad_categoria: baseRecord.Categoria_ICA || "Buena",
          e_coli: Math.floor((baseRecord.E_coli || 0) * variation()),
          coliformes_totales: Math.floor((baseRecord.Coliformes_totales || 0) * variation()),
          turbidez: +((baseRecord.Turbidez || 1.0) * variation()).toFixed(2),
          nitratos: +((baseRecord.Nitratos || 10.0) * variation()).toFixed(2),
          fosfatos: +((baseRecord.Fosfatos || 0.5) * variation()).toFixed(3),
          dbo5: +((baseRecord.DBO5 || 5.0) * variation()).toFixed(1),
          solidos_suspendidos: Math.floor((baseRecord.Solidos_suspendidos || 25) * variation()),
          ica_calculado: Math.floor((baseRecord.ICA_calculado || 75) * variation()),
          fecha: baseRecord.Date,
          location_id: baseRecord.Location_ID,
          timestamp: new Date(Date.now() - (23 - index) * 60 * 60 * 1000).toISOString(), // Simular timestamps cada hora
          original_data: index === 0, // Marcar el primer registro como el original
        }
      } else {
        // Si no hay datos de la API, generar datos de respaldo
        return {
          hour: index,
          ph: +(6.5 + Math.random() * 2).toFixed(2),
          calidad_categoria: Math.random() > 0.5 ? "Buena" : "Regular",
          e_coli: Math.floor(Math.random() * 100),
          coliformes_totales: Math.floor(Math.random() * 500 + 100),
          turbidez: +(Math.random() * 10).toFixed(2),
          nitratos: +(Math.random() * 50).toFixed(2),
          fosfatos: +(Math.random() * 5).toFixed(3),
          dbo5: +(Math.random() * 30 + 5).toFixed(1),
          solidos_suspendidos: Math.floor(Math.random() * 100 + 10),
          ica_calculado: Math.floor(Math.random() * 40 + 60),
          timestamp: new Date(Date.now() - (23 - index) * 60 * 60 * 1000).toISOString(),
          original_data: false,
        }
      }
    })

    // Determinar el origen de los datos
    const dataSource = baseRecord ? "external_api_extrapolated" : "fallback"
    // Crear la respuesta con los headers adecuados
    const nextResponse = NextResponse.json({
      success: true,
      data: externalData['registros'],
      source: dataSource,
      original_record: baseRecord,
      api_metadata: {
        total_registros: externalData.total_registros || 0,
        pagina: externalData.pagina || 1,
        por_pagina: externalData.por_pagina || 1,
      },
      api_info: {
        server: response.headers.get("server"),
        date: response.headers.get("date"),
        url_used: apiUrl,
      },
    })

    return nextResponse
  } catch (error) {
    console.error("Error fetching from external API:", error)

    // En caso de error, generar datos de respaldo
    const fallbackData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      ph: +(6.5 + Math.random() * 2).toFixed(2),
      calidad_categoria: Math.random() > 0.5 ? "Buena" : "Regular",
      e_coli: Math.floor(Math.random() * 100),
      coliformes_totales: Math.floor(Math.random() * 500 + 100),
      turbidez: +(Math.random() * 10).toFixed(2),
      nitratos: +(Math.random() * 50).toFixed(2),
      fosfatos: +(Math.random() * 5).toFixed(3),
      dbo5: +(Math.random() * 30 + 5).toFixed(1),
      solidos_suspendidos: Math.floor(Math.random() * 100 + 10),
      ica_calculado: Math.floor(Math.random() * 40 + 60),
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      original_data: false,
    }))

    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: "fallback_error",
      error: `Failed to fetch from external API: ${error instanceof Error ? error.message : "Unknown error"}`,
      api_info: {
        url_used: `http://127.0.0.1:3033/registros?fecha_inicio=${new Date().toISOString().split("T")[0]}&page=1&limit=1`,
      },
    })
  }
}