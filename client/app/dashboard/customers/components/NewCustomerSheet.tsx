'use client'

import { useState } from "react"
import { Plus, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useAuth } from "@/app/hooks/use-auth"
import { createCustomer } from "@/app/service/customer-service"
import { toast } from "sonner"

type FormData = {
    name: string
    phone: string,
}

interface NewCustomerSheetProps {
    children?: React.ReactNode;
}

export function NewCustomerSheet({ children }: NewCustomerSheetProps) {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: ''
        },
        mode: 'onChange'
    })

    const onSubmit = async (data: FormData) => {
        try {
            await createCustomer({
                name: data.name,
                phone: data.phone,
                userId: user.id
            })
            toast.success("Cliente adicionado com sucesso!")
            reset()
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao adicionar cliente")
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children || (
                    <Button className="cursor-pointer">
                        Adicionar Cliente
                        <Plus className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto p-4 px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="pb-6 border-b">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="font-semibold">Adicionar Novo Cliente</SheetTitle>
                                <SheetDescription className="text-xs">
                                    Preencha os campos abaixo para adicionar um novo cliente.
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 py-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Nome Completo *
                            </Label>
                            <Input
                                id="name"
                                placeholder="Nome do cliente"
                                className={`transition-colors focus:ring-2 focus:ring-primary/20 ${errors.name
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-200 focus:border-primary"
                                    }`}
                                {...register("name", {
                                    required: "O nome é obrigatório",
                                    minLength: {
                                        value: 3,
                                        message: "O nome deve ter pelo menos 3 caracteres"
                                    }
                                })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                Telefone *
                            </Label>
                            <Input
                                id="phone"
                                placeholder="(00) 00000-0000"
                                className={`transition-colors focus:ring-2 focus:ring-primary/20 ${errors.phone
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-200 focus:border-primary"
                                    }`}
                                {...register("phone", {
                                    required: "O telefone é obrigatório",
                                    minLength: {
                                        value: 11,
                                        message: "Telefone inválido"
                                    }
                                })}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <SheetFooter>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full sm:w-auto transition-all ${!isSubmitting
                                    ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                                    : "opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        Salvando...
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                    </>
                                ) : (
                                    <>
                                        Adicionar Cliente
                                        <Plus className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </SheetFooter>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
