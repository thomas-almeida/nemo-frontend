"use client"

import { useCustomers } from "@/app/hooks/use-customers"
import { useState, useMemo } from "react"
import DataTable from "@/app/components/DataTable"
import { Search } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NewCustomerSheet } from "./components/NewCustomerSheet"
import { ImportCustomersSheet } from "./components/ImportCustomersSheet"

export default function CustomersPage() {
    const { customers } = useCustomers()
    const [searchValue, setSearchValue] = useState('')

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
        },
        {
            accessorKey: "phone",
            header: "Telefone"
        }
    ];

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
                        data={filteredCustomers}
                        columns={columns}
                    />
                )}
            </div>
        </div>
    )
}