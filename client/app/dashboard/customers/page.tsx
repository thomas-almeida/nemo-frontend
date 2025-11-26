"use client"

import { useCustomers } from "@/app/hooks/use-customers"
import { useCustomerList } from "@/app/hooks/use-customerlist"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useAuth } from "@/app/hooks/use-auth"
import { getAllCustomers } from "@/app/service/customer-service"
import { createCustomerList } from "@/app/service/customerlist-service"
import useCustomerStore from "@/app/store/customer-store"
import DataTable from "@/app/components/DataTable"
import { Search, X, ListPlus, PhoneCall } from "lucide-react"
import { ColumnDef, Row } from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NewCustomerSheet } from "./components/NewCustomerSheet"
import LabelBadge from "@/app/components/LabelBadge"
import { MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AddToListModal } from "./components/AddToListModal"
import { EditCustomerModal } from "./components/EditCustomerModal"
import { ImportCustomersSheet } from "./components/ImportCustomersSheet"
import { SendMessageModal } from "./components/SendMessageModal"

export default function CustomersPage() {
    const { customers } = useCustomers()
    const { user } = useAuth()
    const { customerLists } = useCustomerList()
    const [searchValue, setSearchValue] = useState('')
    const [selectedLabel, setSelectedLabel] = useState<string>('')
    const [selectedStage, setSelectedStage] = useState<string>('')
    const [availableLabels, setAvailableLabels] = useState<string[]>([])
    const [editingCustomer, setEditingCustomer] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [messagingCustomer, setMessagingCustomer] = useState<any>(null)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
    const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false)
    const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)
    const [listName, setListName] = useState("")

    // Extract all unique labels from customers
    useEffect(() => {
        const labels = new Set<string>();
        customers.forEach(customer => {
            if (customer.labels && Array.isArray(customer.labels)) {
                customer.labels.forEach((label: string) => labels.add(label));
            }
        });
        setAvailableLabels(Array.from(labels).sort());
    }, [customers]);

    const toggleCustomerSelection = useCallback((customerId: string) => {
        setSelectedCustomers(prev => {
            const newSelection = new Set(prev)
            if (newSelection.has(customerId)) {
                newSelection.delete(customerId)
            } else {
                newSelection.add(customerId)
            }
            return newSelection
        })
    }, [])

    const isCustomerSelected = useCallback((customerId: string) => {
        return selectedCustomers.has(customerId)
    }, [selectedCustomers])

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            // Search filter
            const matchesSearch = !searchValue ||
                customer.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchValue.toLowerCase());

            // Label filter
            const matchesLabel = selectedLabel === 'all' || !selectedLabel ||
                (customer.labels && customer.labels.includes(selectedLabel));

            // Stage filter
            const matchesStage = selectedStage === 'all' || !selectedStage || customer.stage === selectedStage;

            return matchesSearch && matchesLabel && matchesStage;
        });
    }, [customers, searchValue, selectedLabel, selectedStage]);

    const handleCreateList = useCallback(async () => {
        if (!listName.trim() || selectedCustomers.size === 0) return

        try {

            const newList = {
                name: listName,
                owner: user.id,
                customers: Array.from(selectedCustomers)
            }

            await createCustomerList(newList)
            // Reset form and close modal
            setListName('')
            setSelectedCustomers(new Set())
            setIsCreateListModalOpen(false)

            // Show success message or trigger refresh
        } catch (error) {
            console.error('Error creating list:', error)
            // Handle error (e.g., show error message)
        }
    }, [listName, selectedCustomers])

    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={selectedCustomers.size > 0 && selectedCustomers.size === filteredCustomers.length}
                        onChange={() => {
                            if (selectedCustomers.size === filteredCustomers.length) {
                                setSelectedCustomers(new Set())
                            } else {
                                setSelectedCustomers(new Set(filteredCustomers.map(c => c._id).filter((id): id is string => Boolean(id))))
                            }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>
            ),
            cell: ({ row }) => {
                const customerId = row.original._id;
                if (!customerId) return null;

                return (
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isCustomerSelected(customerId)}
                            onChange={() => toggleCustomerSelection(customerId)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            },
            size: 40,
        },
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
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditingCustomer(row.original)
                            setIsEditModalOpen(true)
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        title="Editar cliente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setMessagingCustomer(row.original)
                            setIsMessageModalOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                        title="Enviar mensagem"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setMessagingCustomer(row.original)
                            setIsMessageModalOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                        title="Ligar com script"
                    >
                        <PhoneCall className="h-4 w-4" />
                    </button>
                </div>
            ),
            size: 120,
        }

    ];

    console.log(customerLists)

    // Removed renderRowActions since we've added the actions directly in the columns

    return (

        <>
            <div className="container mx-auto py-6 w-[90%]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted-foreground">Gerencie seus clientes</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedCustomers.size > 0 && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreateListModalOpen(true)}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <ListPlus className="h-4 w-4" />
                                        Criar Lista ({selectedCustomers.size})
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsAddToListModalOpen(true)}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <ListPlus className="h-4 w-4" />
                                        Adicionar à Lista ({selectedCustomers.size})
                                    </Button>
                                </>
                            )}
                            <NewCustomerSheet />
                            <ImportCustomersSheet />
                        </div>
                    </div>
                </div>
                <div className="py-6">
                    <div className="flex flex-wrap gap-2 w-full">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar clientes..."
                                className="w-full pl-8"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>

                        <div className="w-full sm:w-[200px]">
                            <Select
                                value={selectedLabel || undefined}
                                onValueChange={(value) => setSelectedLabel(value || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filtrar por etiqueta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as etiquetas</SelectItem>
                                    {availableLabels.map((label) => (
                                        <SelectItem key={label} value={label}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-[200px]">
                            <Select
                                value={selectedStage || undefined}
                                onValueChange={(value) => setSelectedStage(value || '')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filtrar por etapa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as etapas</SelectItem>
                                    <SelectItem value="Aguardando Contato">Aguardando Contato</SelectItem>
                                    <SelectItem value="Primeiro Contato">Primeiro Contato</SelectItem>
                                    <SelectItem value="Esteira Encantamento">Esteira Encantamento</SelectItem>
                                    <SelectItem value="Negociação">Negociação</SelectItem>
                                    <SelectItem value="Rodando Contrato">Rodando Contrato</SelectItem>
                                    <SelectItem value="Vendido">Vendido</SelectItem>
                                    <SelectItem value="Perdido">Perdido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(selectedLabel || selectedStage) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedLabel('');
                                    setSelectedStage('');
                                }}
                                className="h-10 px-3"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpar filtros
                            </Button>
                        )}
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

            <Dialog open={isCreateListModalOpen} onOpenChange={setIsCreateListModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Nova Lista</DialogTitle>
                        <DialogDescription>
                            Crie uma nova lista com os clientes selecionados ({selectedCustomers.size} clientes)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="listName" className="text-right">
                                Nome da Lista
                            </Label>
                            <Input
                                id="listName"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                className="col-span-3"
                                placeholder="Ex: Clientes VIP, Leads Quentes, etc."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateListModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateList}
                            disabled={!listName.trim()}
                            className="cursor-pointer"
                        >
                            Criar Lista
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <EditCustomerModal
                customer={editingCustomer}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSuccess={() => {
                    // Refresh the customers list when a customer is updated
                    // This assumes you have a way to refresh the data
                    // If you're using a query hook, you might need to invalidate the query
                    // For example: queryClient.invalidateQueries('customers')
                    window.location.reload() // Temporary solution until we have proper state management
                }}
            />

            <AddToListModal
                open={isAddToListModalOpen}
                onOpenChange={setIsAddToListModalOpen}
                selectedCustomerIds={Array.from(selectedCustomers)}
                userId={user?.id || ""}
                customerLists={customerLists}
            />

            <SendMessageModal
                customer={messagingCustomer}
                open={isMessageModalOpen}
                onOpenChange={setIsMessageModalOpen}
            />
        </>
    )
}