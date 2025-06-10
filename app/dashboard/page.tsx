"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WaterQualityChart } from "@/components/water-quality-chart"
import { ReportGenerator } from "@/components/report-generator"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Droplets } from "lucide-react"

interface WaterMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "excellent" | "good" | "fair" | "poor"
  icon: React.ReactNode
  range: { min: number; max: number }
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<WaterMetric[]>([])
  const [ica, setIca] = useState(0)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/water-quality/metrics")
        const data = await response.json()

        if (data.success) {
          setMetrics(data.data.metrics)
          setIca(data.data.ica)
        }
      } catch (error) {
        console.error("Error fetching metrics:", error)
      }
    }

    fetchMetrics()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excelente"
      case "good":
        return "Bueno"
      case "fair":
        return "Regular"
      case "poor":
        return "Malo"
      default:
        return "Desconocido"
    }
  }

  const getIcaStatus = (ica: number) => {
    if (ica >= 80) return { text: "Excelente", color: "text-green-600" }
    if (ica >= 70) return { text: "Bueno", color: "text-blue-600" }
    if (ica >= 50) return { text: "Regular", color: "text-yellow-600" }
    return { text: "Malo", color: "text-red-600" }
  }

  const icaStatus = getIcaStatus(ica)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Calidad de Agua</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de los parámetros de calidad</p>
        </div>

        {/* ICA Principal */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              Índice de Calidad de Agua (ICA)
            </CardTitle>
            <CardDescription>Evaluación general basada en múltiples parámetros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-blue-900">{ica}</div>
                <div className={`text-lg font-semibold ${icaStatus.color}`}>{icaStatus.text}</div>
              </div>
              <div className="w-32">
                <Progress value={ica} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Individuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value} {metric.unit}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={getStatusColor(metric.status)}>{getStatusText(metric.status)}</Badge>
                  <span className="text-xs text-gray-500">
                    Rango: {metric.range.min}-{metric.range.max} {metric.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de Tendencias */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Histórica</CardTitle>
            <CardDescription>Evolución de los parámetros en las últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <WaterQualityChart />
          </CardContent>
        </Card>

        {/* Generador de Informes */}
        <Card>
          <CardHeader>
            <CardTitle>Generador de Informes</CardTitle>
            <CardDescription>Crea informes personalizados de calidad de agua</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportGenerator />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
