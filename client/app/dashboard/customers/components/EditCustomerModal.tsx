'use client'

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateCustomer, deleteCustomer } from "@/app/service/customer-service"
import Select from "@/app/components/Select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type FormData = {
    name: string
    phone: string
    stage: string
    labels?: string[]
}

interface EditCustomerModalProps {
    customer: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function EditCustomerModal({ customer, open, onOpenChange, onSuccess }: EditCustomerModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: customer?.name || '',
            phone: customer?.phone || '',
            stage: customer?.stage || '',
            labels: customer?.labels || []
        },
        mode: 'onChange'
    })

    const handleAddLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
            const currentLabels = getValues('labels') || []
            if (!currentLabels.includes(inputValue.trim())) {
                setValue('labels', [...currentLabels, inputValue.trim()], { shouldDirty: true })
            }
            setInputValue('')
        }
    }

    const removeLabel = (labelToRemove: string) => {
        const currentLabels = getValues('labels') || []
        setValue('labels', currentLabels.filter(label => label !== labelToRemove), { shouldDirty: true })
    }

    const onSubmit = async (data: FormData) => {
        if (!customer?._id) return

        setIsLoading(true)
        try {
            await updateCustomer(customer._id, {
                name: data.name,
                phone: data.phone,
                stage: data.stage,
                labels: data.labels || []
            })
            toast.success("Cliente atualizado com sucesso!")
            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao atualizar cliente")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteCustomer(customer._id)
            toast.success("Cliente excluído com sucesso!")
            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            console.error("Error deleting customer:", error)
            toast.error("Erro ao excluir cliente")
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    // Reset form when customer changes
    useEffect(() => {
        if (customer) {
            reset({
                name: customer.name || '',
                phone: customer.phone || '',
                stage: customer.stage || '',
                labels: customer.labels || []
            })
        }
    }, [customer, reset])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar Cliente</SheetTitle>
                    <SheetDescription>
                        Atualize as informações do cliente.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 p-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            placeholder="Nome do cliente"
                            {...register('name', { required: 'Nome é obrigatório' })}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            placeholder="(00) 00000-0000"
                            {...register('phone', { required: 'Telefone é obrigatório' })}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="">
                            <Label>Etapa de Funil</Label>
                            <p className="text-xs text-muted-foreground py-1">Em que momento seu cliente esta?</p>
                            <Select
                                options={[
                                    { value: 'Aguardando Contato', label: 'Aguardando Contato' },
                                    { value: 'Primeiro Contato', label: 'Primeiro Contato' },
                                    { value: 'Esteira Encantamento', label: 'Esteira Encantamento' },
                                    { value: 'Negociação', label: 'Negociação' },
                                    { value: 'Rodando Contrato', label: 'Rodando Contrato' },
                                    { value: 'Vendido', label: 'Vendido' },
                                    { value: 'Perdido', label: 'Perdido' },
                                ]}
                                value={watch('stage')}
                                onChange={(value) => {
                                    setValue('stage', value, { shouldDirty: true });
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="pb-2">
                            <Label>Etiquetas</Label>
                            <p className="text-xs text-muted-foreground py-1">lembretes rápidos do que se trata a etapa do seu cliente</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {watch('labels')?.map((label) => (
                                <div key={label} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                                    {label}
                                    <button
                                        type="button"
                                        onClick={() => removeLabel(label)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Input
                            placeholder="Digite e pressione Enter para adicionar etiqueta"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleAddLabel}
                        />
                    </div>

                    <div className="flex flex-col justify-end space-y-2 pt-4">
                        <Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
                            {isLoading ? 'Salvando...' : 'Salvar alterações'}
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full cursor-pointer text-red-500 border-red-300 hover:bg-red-50" 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsDeleteDialogOpen(true);
                            }}
                            disabled={isLoading}
                        >
                            Excluir Cliente
                        </Button>
                    </div>

                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza que deseja excluir este cliente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados do cliente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </SheetContent>
        </Sheet>
    )
}
