import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export type CampaignItems = {
    id: string
    name: string
    status: 'Em andamento' | 'Concluída' | 'Agendada' | 'Cancelada'
    createdAt: Date
    audience: number
}

export const statusOptions = [
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Concluída', label: 'Concluída' },
    { value: 'Agendada', label: 'Agendada' },
    { value: 'Cancelada', label: 'Cancelada' },
] as const

export const columns: ColumnDef<CampaignItems>[] = [
    {
        accessorKey: "name",
        header: "Nome da Campanha",
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("name")}</div>
        },
        enableColumnFilter: true,
        filterFn: "includesString",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusMap = {
                'Em andamento': 'bg-blue-100 text-blue-800',
                'Concluída': 'bg-green-100 text-green-800',
                'Agendada': 'bg-yellow-100 text-yellow-800',
                'Cancelada': 'bg-red-100 text-red-800',
            }
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status as keyof typeof statusMap] || ''}`}>
                    {status}
                </span>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: "Data do Disparo",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })
        },
    },
    {
        accessorKey: "audience",
        header: "Contatos",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("audience"))
            return <div className="text-right font-medium">{amount.toLocaleString('pt-BR')}</div>
        },
    },
]