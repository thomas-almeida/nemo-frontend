"use client"

import { useState } from "react"
import { Folder, Plus, Search, Home, MapPin, Calendar, Filter } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import EmptyData from "@/app/components/EmptyData"
import DataTable from "@/app/components/DataTable"
import { columns, ProjectItems, statusOptions, unitTypeOptions } from "@/app/utils/columns/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

// Mock data - replace with your actual data fetching logic
const mockData: ProjectItems[] = [
  {
    id: "1",
    name: "Residencial Vista Verde",
    neighborhood: "Jardim das Flores",
    unitTotal: 120,
    hisUnit: true,
    hmpUnit: true,
    nrUnit: false,
    r2vUnit: true,
    status: "Em andamento",
    launchDate: new Date(2025, 5, 15),
    deliveryDate: new Date(2026, 5, 15)
  },
  {
    id: "2",
    name: "Edifício Moderno",
    neighborhood: "Centro",
    unitTotal: 80,
    hisUnit: false,
    hmpUnit: true,
    nrUnit: true,
    r2vUnit: false,
    status: "Em planejamento",
    launchDate: new Date(2025, 8, 1),
    deliveryDate: new Date(2027, 2, 1)
  },
  {
    id: "3",
    name: "Vila Nova Esperança",
    neighborhood: "Vila Nova",
    unitTotal: 200,
    hisUnit: true,
    hmpUnit: false,
    nrUnit: true,
    r2vUnit: false,
    status: "Concluído",
    launchDate: new Date(2024, 1, 10),
    deliveryDate: new Date(2025, 1, 10)
  },
  {
    id: "4",
    name: "Condomínio das Águias",
    neighborhood: "Alto da Boa Vista",
    unitTotal: 150,
    hisUnit: true,
    hmpUnit: true,
    nrUnit: true,
    r2vUnit: true,
    status: "Suspenso",
    launchDate: new Date(2024, 9, 1),
    deliveryDate: new Date(2025, 12, 31)
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [unitTypeFilter, setUnitTypeFilter] = useState<string[]>([])

  const filteredData = mockData.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(project.status)

    const matchesUnitType = unitTypeFilter.length === 0 ||
      unitTypeFilter.some(type => project[type as keyof ProjectItems] === true)

    return matchesSearch && matchesStatus && matchesUnitType
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos imobiliários</p>
        </div>
        <Link href="/dashboard/projects/new-project">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg">Todos os Projetos</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar projetos..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter.join(",")}
                  onValueChange={(value) => setStatusFilter(value ? value.split(",") : [])}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filtrar por tipo:</span>
              </div>
              {unitTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={unitTypeFilter.includes(option.value)}
                    onCheckedChange={(checked) => {
                      setUnitTypeFilter(prev =>
                        checked
                          ? [...prev, option.value]
                          : prev.filter(v => v !== option.value)
                      )
                    }}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
              {unitTypeFilter.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 lg:px-3 text-xs"
                  onClick={() => setUnitTypeFilter([])}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <div className="w-full">
              <DataTable
                columns={columns}
                data={filteredData}
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <EmptyData
                title="Nenhum projeto encontrado"
                description="Tente ajustar seus filtros de busca"
                buttonLabel="Ver todos os projetos"
                buttonLink="/dashboard/projects"
                icon={<Folder className="mx-auto h-12 w-12 text-muted-foreground" />}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}