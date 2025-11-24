"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCustomerListsByOwnerId, addCustomerToList } from "@/app/service/customerlist-service"

export function AddToListModal({
    open,
    onOpenChange,
    selectedCustomerIds,
    userId,
    customerLists
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedCustomerIds: string[]
    userId: string
    customerLists: any
}) {
    const [selectedListId, setSelectedListId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const allLists = customerLists?.data?.map((list: any) => list)
    console.log(allLists)

    const handleAddToList = async () => {
        if (!selectedListId || selectedCustomerIds.length === 0) return

        setIsSubmitting(true)
        setError(null)

        try {
            // Add each selected customer to the list
            for (const customerId of selectedCustomerIds) {
                await addCustomerToList(selectedListId, customerId)
            }

            // Close the modal and reset form
            onOpenChange(false)
            setSelectedListId("")
        } catch (err) {
            console.error('Error adding customers to list:', err)
            setError('Falha ao adicionar clientes à lista. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar a uma Lista</DialogTitle>
                    <DialogDescription>
                        Selecione uma lista para adicionar {selectedCustomerIds.length} cliente{selectedCustomerIds.length !== 1 ? 's' : ''} selecionado{selectedCustomerIds.length !== 1 ? 's' : ''}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-sm">{error}</div>
                    ) : allLists?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhuma lista encontrada. Crie uma lista primeiro.</p>
                    ) : (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Selecione uma lista
                            </label>
                            <Select value={selectedListId} onValueChange={setSelectedListId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione uma lista" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allLists?.map((list: any, index: number) => (
                                        <SelectItem key={index} value={list._id}>
                                            {list?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAddToList}
                        disabled={!selectedListId || isSubmitting || allLists.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adicionando...
                            </>
                        ) : (
                            `Adicionar (${selectedCustomerIds.length})`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
