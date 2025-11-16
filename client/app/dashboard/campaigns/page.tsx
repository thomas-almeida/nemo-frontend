
"use client"

import { useState } from "react"
import { MessageCircleDashed, Plus, Search } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import EmptyData from "../../components/EmptyData"
import DataTable from "@/app/components/DataTable"
import { columns, CampaignItems, statusOptions } from "@/app/utils/columns/campaign"
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

// Mock data - replace with your actual data fetching logic
const mockData: CampaignItems[] = [
  {
    id: "1",
    name: "Campanha de Verão",
    status: "Em andamento",
    createdAt: new Date(2025, 10, 15, 10, 30),
    audience: 1250
  },
  {
    id: "2",
    name: "Promoção Black Friday",
    status: "Agendada",
    createdAt: new Date(2025, 10, 25, 8, 0),
    audience: 2500
  },
  {
    id: "3",
    name: "Campanha de Inverno",
    status: "Concluída",
    createdAt: new Date(2025, 5, 1, 9, 15),
    audience: 1800
  },
  {
    id: "4",
    name: "Ofertas Relâmpago",
    status: "Cancelada",
    createdAt: new Date(2025, 9, 5, 14, 0),
    audience: 950
  },
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filteredData = mockData.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(campaign.status)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas de marketing</p>
        </div>
        <Link href="/dashboard/campaigns/new-campaign">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Novo Disparo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-lg">Todas as Campanhas</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar campanhas..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
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
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredData}
            />
          ) : (
            <div className="p-8 text-center">
              <EmptyData
                title="Nenhuma campanha encontrada"
                description="Tente ajustar seus filtros de busca"
                buttonLabel="Limpar Filtros"
                buttonLink="/dashboard/campaigns"
                icon={<MessageCircleDashed className="mx-auto h-12 w-12 text-muted-foreground" />}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}