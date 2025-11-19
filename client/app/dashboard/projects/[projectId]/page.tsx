'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Project } from "@/app/types/project"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/app/hooks/use-projects"
import { useMessages } from "@/app/hooks/use-messages"
import { useAttachments } from "@/app/hooks/use-attachments"
import Accordion from "@/app/components/Accordion"
import Link from "next/link"
import FileUpload from "@/app/components/FileUpload"
import { useAuth } from "@/app/hooks/use-auth"
import { createAttachment } from "@/app/service/attachment-service"

export default function ProjectPage() {
    const { projectId } = useParams()
    const router = useRouter()
    const { projects } = useProjects()
    const { messages } = useMessages()
    const { attachments } = useAttachments()
    const { user } = useAuth()
    const [project, setProject] = useState<Project | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [projectMessage, setProjectMessage] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [editingField, setEditingField] = useState<string | null>(null)
    const [tempValue, setTempValue] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)
    const [attachmentList, setAttachmentList] = useState<any[]>([])

    const handleFileSelect = async (file: File | null) => {
        if (!file || !project || !user) return

        try {
            setIsUploading(true)

            // Usar a extensão do arquivo como tipo
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'file';
            const type = fileExtension;

            await createAttachment({
                file,
                name: file.name,
                projectId: project._id,
                ownerId: user.id
            })

            toast.success('Arquivo enviado com sucesso!')

            // Atualizar a lista de anexos
            const updatedAttachments = [...attachments, {
                _id: Date.now().toString(), // ID temporário
                name: file.name,
                type,
                projectId: project._id,
                fileUrl: URL.createObjectURL(file),
                createdAt: new Date().toISOString()
            }]

            setAttachmentList(updatedAttachments.filter(a => a.projectId === projectId))

        } catch (error) {
            console.error('Erro ao enviar arquivo:', error)
            toast.error('Erro ao enviar arquivo. Tente novamente.')
        } finally {
            setIsUploading(false)
        }
    }

    useEffect(() => {
        if (projects && projectId) {
            const foundProject = projects.find(p => p._id === projectId)
            if (foundProject) {
                setProject(foundProject)
            } else {
                toast.error('Projeto não encontrado')
            }
            setIsLoading(false)
        }
    }, [projects, projectId])


    useEffect(() => {
        if (messages && projectId) {
            console.log(messages)
            let projectM: any[] = []

            messages.forEach(msg => {
                if (msg.projectId === projectId) {
                    projectM.push(msg)
                }
            })

            console.log(projectM)
            if (projectM.length > 0) {
                setProjectMessage(projectM)
            }
        }
    }, [messages, projectId])

    useEffect(() => {
        if (attachments && projectId) {
            console.log(attachments)
            let projectA: any[] = []

            attachments.forEach(att => {
                if (att.projectId === projectId) {
                    projectA.push(att)
                }
            })

            console.log(projectA)
            setAttachmentList(projectA)

        }
    }, [attachments, projectId])

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field)
        setTempValue(currentValue)
    }

    const handleSave = async (field: keyof Project['info']) => {
        if (!project) return

        try {
            setIsSaving(true)
            const updatedProject = {
                ...project,
                info: {
                    ...project.info,
                    [field]: tempValue
                }
            }

            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject)
            })

            if (!response.ok) throw new Error('Failed to update project')

            setProject(updatedProject)
            setEditingField(null)
            toast.success('Project updated successfully')
        } catch (error) {
            console.error('Error updating project:', error)
            toast.error('Failed to update project')
        } finally {
            setIsSaving(false)
        }
    }

    const renderEditableField = (label: string, field: keyof Project['info'], value: string) => {
        if (isLoading) return <Skeleton className="h-4 w-full" />

        return (
            <div className="flex items-center gap-2">
                {editingField === field ? (
                    <div className="flex-1 flex gap-2">
                        <Input
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            size="sm"
                            onClick={() => handleSave(field)}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingField(null)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{value || 'Not set'}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(field, value)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Edit
                        </Button>
                    </div>
                )}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-4">
                <Skeleton className="h-8 w-64 mb-6" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                <Button onClick={() => router.push('/dashboard/projects')}>
                    Back to Projects
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{project.info.name}</h1>
                    <p className="text-muted-foreground text-xs">Project ID: {project._id}</p>

                    <div className="flex gap-2 py-2">
                        {
                            project.type?.map(type => (
                                <b className="text-lg" key={type}>
                                    {type}
                                </b>
                            ))
                        }
                    </div>
                </div>
                <Button variant="outline" onClick={() => router.push('/dashboard/projects')}>
                    Back to Projects
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Empreendimento</CardTitle>
                    <CardDescription>Gerencie as informações do empreendimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-2 gap-2">
                    <div className="border p-2">
                        <h3 className="font-medium mb-2">Nome</h3>
                        {renderEditableField('Name', 'name', project.info.name)}
                    </div>
                    <div className="border p-2">
                        <h3 className="font-medium mb-2">Endereço</h3>
                        {renderEditableField('Address', 'address', project.info.address || '')}
                    </div>
                    <div className="border p-2">
                        <h3 className="font-medium mb-2">Incorporadora</h3>
                        {renderEditableField('Developer', 'developer', project.info.developer || '')}
                    </div>
                    <div className="border p-2">
                        <h3 className="font-medium mb-2">Construtora</h3>
                        {renderEditableField('Description', 'description', project.info.description || '')}
                    </div>
                    <div className="border p-2">
                        <h3 className="font-medium mb-2">Data de Entrega</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <span className="text-sm text-muted-foreground">
                                    {project.info.releaseDate || 'Not set'}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Edit
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
                {project.units && project.units.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Unidades</CardTitle>
                            <CardDescription>Unidades do empreendimento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {project.units.map((unit) => (
                                    <div key={unit._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{unit.footage}m²</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {unit.type || 'No type specified'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(unit.price || 0)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {unit.status || 'Available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {project.location && project.location.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Localização</CardTitle>
                            <CardDescription>Localização do empreendimento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {project.location.map((location: any) => (
                                    <div key={location._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{location.name}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {location.distance} metros
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div>
                {
                    projectMessage && projectMessage.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Mensagens</CardTitle>
                                <CardDescription>Copys que você cria para automatizar os disparos do empreendimento</CardDescription>
                                <Link href={"/dashboard/messages"} className="py-2">
                                    <Button>
                                        Ir Para Mensagens
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {projectMessage.map((message: any) => (
                                        <Accordion
                                            title={message.name}
                                            defaultOpen={false}
                                            key={message._id}
                                        >
                                            <div className="text-left w-[40%] border p-2 rounded bg-slate-100">
                                                <p className="">
                                                    {message.copy}
                                                </p>
                                            </div>
                                        </Accordion>

                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
            </div>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Materiais</CardTitle>
                        <CardDescription>Materiais de apoio rápido para enviar para seus clientes durante o atendimento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 grid grid-cols-2 gap-4 p-2">
                        {/* Seção de Upload */}
                        <div className="p-4">
                            <h3 className="font-medium mb-4">Adicionar Novo Material</h3>
                            <div>
                                <FileUpload
                                    label={isUploading ? 'Enviando arquivo...' : 'Arraste e solte um arquivo ou clique para selecionar'}
                                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov,.avi,.xlsx,.xls,.doc,.docx"
                                    onFileSelect={isUploading ? () => { } : handleFileSelect}
                                    className={isUploading ? 'opacity-50' : ''}
                                />
                                {isUploading && (
                                    <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        Enviando arquivo...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lista de Anexos */}
                        {attachmentList && attachmentList.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="font-medium">Materiais Disponíveis</h4>
                                <div className="space-y-2">
                                    {attachmentList.map((attachment: any) => (
                                        <div
                                            key={attachment._id}
                                            className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{attachment.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {attachment.type.toUpperCase()}
                                                </p>
                                            </div>
                                            <Link
                                                href={attachment.fileUrl}
                                                target="_blank"
                                                download
                                            >
                                                <Button variant="outline" size="sm" className="shrink-0">
                                                    Baixar
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Nenhum material adicionado ainda.</p>
                                <p className="text-sm">Use o formulário acima para adicionar arquivos.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}