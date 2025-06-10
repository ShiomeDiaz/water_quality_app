"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Download, Eye, FileText, MapPin } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const GEORGIA_LOCATIONS = {
  "0": "Atlanta", // Ciudad principal
  "2198840": "Clarkesville", // Habersham County
  "2198920": "Toccoa", // Stephens County
  2198950: "Carnesville", // Franklin County
  2203603: "Dahlonega", // Lumpkin County - famosa por el oro
  2203655: "Cleveland", // White County
  2203700: "Gainesville", // Hall County - "Poultry Capital of the World"
  2203831: "Lawrenceville", // Gwinnett County
  2203863: "Atlanta", // Fulton County - centro de Atlanta
  2203873: "Decatur", // DeKalb County
  2203900: "Marietta", // Cobb County
  2203950: "Jonesboro", // Clayton County
  2203960: "McDonough", // Henry County
  2204037: "Milledgeville", // Baldwin County - antigua capital de Georgia
  2207135: "Augusta", // Richmond County - Masters Tournament
  2207160: "Evans", // Columbia County - suburbio de Augusta
  
} as const

export function ReportGenerator() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [endDate, setendDate] = useState<Date>()
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [reportGenerated, setReportGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")
  const { toast } = useToast()
  const [reportData, setReportData] = useState<any>(null)

  const canGenerate = () => {
    return selectedDate && selectedLocation
  }

  const generateReport = async () => {
    if (!canGenerate()) {
      toast({
        title: "Error",
        description: "Selecciona una fecha y una ubicación",
        variant: "destructive",
      })
      return
    }
    setIsGenerating(true)
    setReportGenerated(true)

  }

  const downloadPDF = async () => {
    try {
      // Formatear fechas para la URL
      const fechaInicioStr = selectedDate!.toISOString().split("T")[0]
      const fechaFinStr = endDate!.toISOString().split("T")[0]

      // Construir la URL del PDF
      //const pdfUrl = `http://localhost:8080/api/ica-report/pdf?fecha_inicio=${fechaInicioStr}&fecha_fin=${fechaFinStr}`
      const pdfUrl = `http://localhost:8080/api/ica-report/pdf?fecha_inicio=${fechaInicioStr}&fecha_fin=${fechaFinStr}&location_id=${selectedLocationId}`

      // Verificar que la API esté disponible
      window.open(pdfUrl, "_blank")

      toast({
        title: `Descarga iniciada ${selectedLocationId}`,
        description: `Descargando reporte PDF del ${format(selectedDate!, "dd/MM/yyyy")} al ${format(endDate!, "dd/MM/yyyy")} `,
      })
    } catch (error) {
      console.error("Error al descargar PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF. Verifica que el servidor esté disponible.",
        variant: "destructive",
      })
    } 

    toast({
      title: "Descarga iniciada",
      description: "El archivo PDF se está descargando",
    })
  }


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selección de Fecha */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Fecha del Informe
            </CardTitle>
            <CardDescription>Selecciona la fecha para el análisis de calidad de agua</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de análisis</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha Final</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setendDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Selección de Ubicación */}
        <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación de Monitoreo
          </CardTitle>
          <CardDescription>Selecciona la estación de monitoreo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Estación de monitoreo</Label>
            <Select 
              value={selectedLocationId} 
              onValueChange={(id) => {
                setSelectedLocationId(id);
                setSelectedLocation(GEORGIA_LOCATIONS[id as keyof typeof GEORGIA_LOCATIONS]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ubicación">
                  {selectedLocationId ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {GEORGIA_LOCATIONS[selectedLocationId as keyof typeof GEORGIA_LOCATIONS]}
                      <span className="text-xs text-gray-500">({selectedLocationId})</span>
                    </div>
                  ) : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Object.entries(GEORGIA_LOCATIONS)
                  .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB))
                  .map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {name}
                        <span className="text-xs text-gray-500">({id})</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={generateReport} disabled={!canGenerate() || isGenerating} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {isGenerating ? "Generando..." : "Generar Informe"}
        </Button>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!reportGenerated} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vista Previa del Informe</DialogTitle>
              <DialogDescription>
                Informe de Calidad de Agua - {selectedDate && format(selectedDate, "dd/MM/yyyy")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-white p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-4">Informe de Calidad de Agua</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <strong>Fecha de análisis:</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy")}
                  </div>
                  <div>
                    <strong>Fecha de generación:</strong> {format(new Date(), "dd/MM/yyyy HH:mm")}
                  </div>
                  <div className="md:col-span-2">
                    <strong>Ubicación:</strong> {selectedLocation}
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">Parámetros Analizados:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">pH</h5>
                    <div className="text-lg font-bold text-blue-600">{reportData?.ph}</div>
                    <div className="text-sm text-gray-600">Rango normal: 6.5 - 8.5</div>
                  </div>
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">Oxígeno Disuelto</h5>
                    <div className="text-lg font-bold text-green-600">{reportData?.oxygen} mg/L</div>
                    <div className="text-sm text-gray-600">Rango normal: 5 - 10 mg/L</div>
                  </div>
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">Temperatura</h5>
                    <div className="text-lg font-bold text-orange-600">{reportData?.temperature} °C</div>
                    <div className="text-sm text-gray-600">Rango normal: 15 - 30 °C</div>
                  </div>
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">Conductividad</h5>
                    <div className="text-lg font-bold text-purple-600">{reportData?.conductivity} μS/cm</div>
                    <div className="text-sm text-gray-600">Rango normal: 200 - 800 μS/cm</div>
                  </div>
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">Turbidez</h5>
                    <div className="text-lg font-bold text-yellow-600">{reportData?.turbidity} NTU</div>
                    <div className="text-sm text-gray-600">Rango normal: 0 - 5 NTU</div>
                  </div>
                  <div className="border p-3 rounded">
                    <h5 className="font-medium">Cloro Residual</h5>
                    <div className="text-lg font-bold text-cyan-600">{reportData?.chlorine} mg/L</div>
                    <div className="text-sm text-gray-600">Rango normal: 0.2 - 2.0 mg/L</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Evaluación General:</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Calidad del Agua: BUENA</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Los parámetros analizados se encuentran dentro de los rangos aceptables para consumo humano según
                      las normas vigentes. No se detectaron anomalías significativas que requieran intervención
                      inmediata.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Observaciones:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Todos los parámetros físico-químicos dentro de norma</li>
                    <li>Niveles de cloro residual adecuados para desinfección</li>
                    <li>Temperatura del agua en rango óptimo</li>
                    <li>Se recomienda continuar con el monitoreo regular</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={downloadPDF} disabled={!reportGenerated} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

    </div>
  )
}
