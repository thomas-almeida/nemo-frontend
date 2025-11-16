import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Check, X } from "lucide-react"

export type ProjectItems = {
    id: string
    name: string
    neighborhood: string
    unitTotal: number
    hisUnit: boolean
    hmpUnit: boolean
    nrUnit: boolean
    r2vUnit: boolean
    launchDate: Date
    deliveryDate: Date
    status: 'Em andamento' | 'Concluído' | 'Em planejamento' | 'Suspenso'
}

export const statusOptions = [
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Em planejamento', label: 'Em planejamento' },
    { value: 'Suspenso', label: 'Suspenso' },
] as const

export const unitTypeOptions = [
    { value: 'hisUnit', label: 'HIS' },
    { value: 'hmpUnit', label: 'HMP' },
    { value: 'nrUnit', label: 'NR' },
    { value: 'r2vUnit', label: 'R2V' },
] as const

export const columns: ColumnDef<ProjectItems>[] = [
    {
        accessorKey: "name",
        header: "Nome do Projeto",
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("name")}</div>
        },
        enableColumnFilter: true,
        filterFn: "includesString",
    },
    {
        accessorKey: "neighborhood",
        header: "Bairro",
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.getValue("neighborhood") || '-'}</div>
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
                'Concluído': 'bg-green-100 text-green-800',
                'Em planejamento': 'bg-yellow-100 text-yellow-800',
                'Suspenso': 'bg-red-100 text-red-800',
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
        accessorKey: "unitTotal",
        header: "Total de Unidades",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("unitTotal"))
            return <div className="text-right font-medium">{amount.toLocaleString('pt-BR')}</div>
        },
    },
    ...unitTypeOptions.map(unit => ({
        accessorKey: unit.value,
        header: unit.label,
        cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
            const value = row.getValue(unit.value)
            return (
                <div className="flex justify-center">
                    {value ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 text-gray-400" />
                    )}
                </div>
            )
        },
        filterFn: (row: { getValue: (key: string) => any }, id: string, value: string[]) => {
            if (value.length === 0) return true
            return value.some(v => row.getValue(v) === true)
        },
    })),
    {
        accessorKey: "launchDate",
        header: "Data de Lançamento",
        cell: ({ row }) => {
            const date = row.getValue("launchDate")
            return date ? format(new Date(date as string), "dd/MM/yyyy", { locale: ptBR }) : '-'
        },
    },
    {
        accessorKey: "deliveryDate",
        header: "Data de Entrega",
        cell: ({ row }) => {
            const date = row.getValue("deliveryDate")
            return date ? format(new Date(date as string), "dd/MM/yyyy", { locale: ptBR }) : '-'
        },
    },
]