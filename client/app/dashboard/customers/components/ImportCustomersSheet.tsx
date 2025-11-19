'use client'

import { useState, useRef } from "react"
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createCustomer } from "@/app/service/customer-service"

import { useAuth } from "@/app/hooks/use-auth"

type CustomerCSV = {
    name: string
    phone: string
}


type ImportStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

export function ImportCustomersSheet() {
    const [file, setFile] = useState<File | null>(null)
    const [customers, setCustomers] = useState<CustomerCSV[]>([])
    const [status, setStatus] = useState<ImportStatus>('idle')
    const [progress, setProgress] = useState(0)
    const [processed, setProcessed] = useState(0)
    const [errors, setErrors] = useState<{ row: number, message: string }[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { user } = useAuth()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            parseCSV(selectedFile)
        }
    }

    const parseCSV = (file: File) => {
        setStatus('uploading')
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split('\n').filter(line => line.trim() !== '')

                // Skip header row and parse data
                const parsedCustomers = lines.slice(1).map((line, index) => {
                    const [name, phone, email] = line.split(',').map(item => item.trim())
                    return { name, phone, email: email || '' }
                })

                setCustomers(parsedCustomers)
                setStatus('idle')
            } catch (error) {
                console.error('Error parsing CSV:', error)
                setStatus('error')
            }
        }

        reader.onerror = () => {
            setStatus('error')
        }

        reader.readAsText(file)
    }

    const handleImport = async () => {
        if (customers.length === 0) return

        setStatus('processing')
        setErrors([])
        let successCount = 0
        const errorList: { row: number, message: string }[] = []

        for (let i = 0; i < customers.length; i++) {
            const customer = customers[i]
            try {
                await createCustomer({
                    name: customer.name,
                    phone: customer.phone,
                    userId: user.id
                })
                successCount++
            } catch (error: any) {
                errorList.push({
                    row: i + 2, // +2 because of 0-index and header row
                    message: error.message || 'Erro ao importar cliente'
                })
            } finally {
                const currentProgress = Math.round(((i + 1) / customers.length) * 100)
                setProgress(currentProgress)
                setProcessed(i + 1)
            }
        }

        setStatus('completed')
        setErrors(errorList)

    }

    const resetForm = () => {
        setFile(null)
        setCustomers([])
        setStatus('idle')
        setProgress(0)
        setProcessed(0)
        setErrors([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <Sheet onOpenChange={(open) => !open && resetForm()}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Importar CSV
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Importar Clientes</SheetTitle>
                    <SheetDescription>
                        Faça upload de um arquivo CSV com os dados dos clientes.
                        <br />
                        Formato esperado: nome,telefone,email (opcional)
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="csv-upload"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${status === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                                    </p>
                                    <p className="text-xs text-gray-500">CSV (nome, telefone, email)</p>
                                </div>
                                <input
                                    id="csv-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".csv,text/csv"
                                    onChange={handleFileChange}
                                    disabled={status === 'uploading'}
                                />
                            </label>
                        </div>

                        {file && (
                            <div className="flex items-center gap-2 p-3 text-sm border rounded-md">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <div className="flex-1 truncate">
                                    {file.name}
                                    <p className="text-xs text-gray-500">
                                        {customers.length} clientes encontrados
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setFile(null)
                                        setCustomers([])
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ''
                                        }
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {(status === 'processing' || status === 'completed') && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Progresso</span>
                                    <span>{processed} de {customers.length}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                {status === 'completed' && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <Check className="w-4 h-4" />
                                        Importação concluída!
                                    </div>
                                )}
                            </div>
                        )}

                        {errors.length > 0 && (
                            <div className="mt-4 p-3 text-sm border border-red-200 bg-red-50 rounded-md">
                                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Erros encontrados:
                                </h4>
                                <ul className="space-y-1 text-red-700">
                                    {errors.slice(0, 5).map((error, i) => (
                                        <li key={i} className="text-xs">
                                            Linha {error.row}: {error.message}
                                        </li>
                                    ))}
                                    {errors.length > 5 && (
                                        <li className="text-xs">
                                            ...e mais {errors.length - 5} erros
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <SheetFooter>
                    <div className="flex w-full justify-between">
                        <Button
                            variant="outline"
                            onClick={resetForm}
                            disabled={status === 'processing'}
                        >
                            Limpar
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={customers.length === 0 || status === 'processing'}
                        >
                            {status === 'processing' ? 'Importando...' : 'Importar Clientes'}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
