"use client"

import { useCustomers } from "@/app/hooks/use-customers"
import { useState, useMemo } from "react"
import { useAuth } from "@/app/hooks/use-auth"
import { getAllCustomers } from "@/app/service/customer-service"
import useCustomerStore from "@/app/store/customer-store"
import DataTable from "@/app/components/DataTable"
import { Search } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NewCustomerSheet } from "./components/NewCustomerSheet"
import { ImportCustomersSheet } from "./components/ImportCustomersSheet"
import { EditCustomerModal } from "./components/EditCustomerModal"
import { SendMessageModal } from "./components/SendMessageModal"
import LabelBadge from "@/app/components/LabelBadge"
import { MessageSquare } from "lucide-react"

export default function CustomersPage() {
    const { customers } = useCustomers()
    const { user } = useAuth()
    const [searchValue, setSearchValue] = useState('')
    const [editingCustomer, setEditingCustomer] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [messagingCustomer, setMessagingCustomer] = useState<any>(null)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

    const filteredCustomers = useMemo(() => {
        if (!searchValue) return customers;

        const searchLower = searchValue.toLowerCase();
        return customers.filter(customer =>
            customer.name?.toLowerCase().includes(searchLower) ||
            customer.email?.toLowerCase().includes(searchLower) ||
            customer.phone?.toLowerCase().includes(searchLower)
        );
    }, [customers, searchValue]);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.getValue("name")}
                    <p className="text-sm text-muted-foreground">
                        {row.original.email}
                    </p>
                </div>
            ),
            size: 300,
        },
        {
            accessorKey: "phone",
            header: "Telefone"
        },
        {
            accessorKey: "labels",
            header: "Etiquetas",
            cell: ({ row }) => {
                const labels = row.original.labels || [];
                return <LabelBadge labels={labels} />;
            },
        },
        {
            accessorKey: "stage",
            header: "Etapa de funil",
            cell: ({ row }) => {
                const stage = row.getValue("stage") as string;
                
                // Define colors for each stage
                const stageColors: Record<string, string> = {
                    'Aguardando Contato': 'bg-blue-100 text-blue-800 border-blue-200',
                    'Primeiro Contato': 'bg-purple-100 text-purple-800 border-purple-200',
                    'Esteira Encantamento': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    'Negociação': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    'Rodando Contrato': 'bg-green-100 text-green-800 border-green-200',
                    'Vendido': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    'Perdido': 'bg-red-100 text-red-800 border-red-200'
                };

                // Default color if stage is not in the list
                const defaultColor = 'bg-gray-100 text-gray-800 border-gray-200';
                const colorClasses = stageColors[stage] || defaultColor;

                return (
                    <div className={`font-medium p-1 px-2 border rounded-full w-[180px] text-center ${colorClasses}`}>
                        <p className="text-xs font-medium">{stage}</p>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setMessagingCustomer(row.original)
                        setIsMessageModalOpen(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Enviar mensagem"
                >
                    <MessageSquare className="h-4 w-4" />
                </button>
            ),
            size: 100,
        }

    ];

    // Removed renderRowActions since we've added the actions directly in the columns

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                    <p className="text-muted-foreground">Gerencie seus clientes</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar clientes..."
                            className="w-full pl-8 sm:w-[200px] md:w-[300px]"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <NewCustomerSheet />
                        <ImportCustomersSheet />
                        <EditCustomerModal
                            customer={editingCustomer}
                            open={isEditModalOpen}
                            onOpenChange={setIsEditModalOpen}
                            onSuccess={() => {
                                // Refresh the customers list
                                const fetchCustomers = async () => {
                                    if (user?.id) {
                                        try {
                                            const customersData = await getAllCustomers(user.id)
                                            useCustomerStore.setState({ customers: customersData.data })
                                        } catch (error) {
                                            console.error(error)
                                        }
                                    }
                                }
                                fetchCustomers()
                            }}
                        />
                        <SendMessageModal
                            customer={messagingCustomer}
                            open={isMessageModalOpen}
                            onOpenChange={setIsMessageModalOpen}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                {filteredCustomers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-muted-foreground">
                            {searchValue ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                        </p>
                        {!searchValue && (
                            <NewCustomerSheet>
                                <Button variant="link" className="mt-2">
                                    Adicionar primeiro cliente
                                </Button>
                            </NewCustomerSheet>
                        )}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredCustomers}
                        onRowClick={(row) => {
                            setEditingCustomer({
                                _id: row._id,
                                name: row.name || '',
                                phone: row.phone || '',
                                stage: row.stage || '',
                                labels: row.labels || []
                            })
                            setIsEditModalOpen(true)
                        }}
                        // Removed renderRowActions prop since we're using a dedicated actions column
                    />
                )}
            </div>
        </div>
    )
}