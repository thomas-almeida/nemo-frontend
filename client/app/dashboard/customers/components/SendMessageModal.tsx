'use client'

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { useProjects } from "@/app/hooks/use-projects"
import { useMessages } from "@/app/hooks/use-messages"
import { useAttachments } from "@/app/hooks/use-attachments"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MessageComponent from "@/app/components/MessageComponent"
import { Plus, Send, X } from "lucide-react"
import Select from "@/app/components/Select"
import { sendMessage } from "@/app/service/sender-service"
import { useAuth } from "@/app/hooks/use-auth"
import { url } from "inspector"

export interface Message {
    id: number | string;
    message: string;
    attachment?: {
        url: string;
        type: string;
        name: string;
        publicLink: string;
    };
}

interface SendMessageModalProps {
    customer: {
        _id: string;
        name: string;
        phone: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SendMessageModal({ customer, open, onOpenChange }: SendMessageModalProps) {
    const { user } = useAuth()
    const { projects } = useProjects()
    const { messages: allMessages } = useMessages()
    const { attachments: allAttachments } = useAttachments()
    const [messages, setMessages] = useState<Message[]>([])
    const [copy, setCopy] = useState('')
    const [selectedMedia, setSelectedMedia] = useState<any>(null)
    const [availableCopies, setAvailableCopies] = useState<Array<{ value: string; label: string }>>([])
    const [projectAttachments, setProjectAttachments] = useState<Array<{ value: string, label: string, type: string, isDocument: boolean, publicLink: string }>>([])
    const [selectedProject, setSelectedProject] = useState('')
    const [isSending, setIsSending] = useState(false)

    const moveMessage = useCallback((dragIndex: number, hoverIndex: number) => {
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages]
            const [movedMessage] = newMessages.splice(dragIndex, 1)
            newMessages.splice(hoverIndex, 0, movedMessage)
            return newMessages
        })
    }, [])

    const handleDeleteMessage = useCallback((id: string | number) => {
        setMessages(prev => prev.filter(msg => msg.id !== id))
    }, [])

    // Update available messages when project changes
    useEffect(() => {
        if (allMessages.length > 0) {
            let projectMessages = selectedProject
                ? allMessages.filter((msg: any) => msg.projectId === selectedProject)
                : allMessages

            const copies = projectMessages.map((msg: any) => ({
                value: msg.copy || msg.name,
                label: msg.name
            }))

            setAvailableCopies([
                { value: '', label: 'Nenhuma' },
                ...copies
            ])
        } else {
            setAvailableCopies([{ value: '', label: 'Nenhuma' }])
        }
    }, [selectedProject, allMessages])

    // Update attachments when project changes
    useEffect(() => {
        if (selectedProject) {
            const projectAttachments = allAttachments
                .filter(att => selectedProject === 'all' || att.projectId === selectedProject)
                .map(att => ({
                    value: att.fileUrl,
                    label: att.name,
                    type: att.type,
                    isDocument: ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(att.type),
                    publicLink: att.publicLink || att.fileUrl
                }))
            setProjectAttachments(projectAttachments)
        } else {
            setProjectAttachments([])
        }
    }, [selectedProject, allAttachments])

    const checkAttachmentType = (attachment: any) => {
        if (attachment?.type.startsWith('image')) {
            return {
                image: {
                    url: attachment?.publicLink,
                    filename: attachment?.name
                }
            }
        } else if (attachment.type.startsWith('video')) {
            return {
                video: {
                    url: attachment?.publicLink,
                    filename: attachment?.name
                }
            }
        } else {
            return {
                document: {
                    url: attachment?.publicLink,
                    filename: attachment?.name
                }
            }
        }
    }

    const handleSendMessage = async () => {
        if (!customer?.phone) {
            toast.error('Número de telefone do cliente não encontrado')
            return
        }

        if (messages.length === 0) {
            toast.error('Adicione pelo menos uma mensagem')
            return
        }

        try {
            setIsSending(true)
            const formattedPhone = formatPhoneNumber(customer.phone)
            const formattedMessages = messages.map(msg => ({
                message: msg.message,
                ...(msg.attachment && checkAttachmentType(msg.attachment))
            }))

            console.log(formattedMessages)

            await sendMessage(user.sessionId, formattedPhone, formattedMessages)
            toast.success('Mensagem enviada com sucesso!')
            setMessages([])
            onOpenChange(false)
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Erro ao enviar mensagem')
        } finally {
            setIsSending(false)
        }
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 p-4"
        >
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Enviar Mensagem para {customer?.name}</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Projeto (opcional)</label>
                                <Select
                                    options={[
                                        { value: '', label: 'Selecione um projeto...' },
                                        { value: 'all', label: 'Todos os projetos' },
                                        ...projects.map(proj => ({
                                            value: proj._id,
                                            label: proj.info?.name || `Projeto ${proj._id.substring(0, 6)}...`
                                        }))
                                    ]}
                                    value={selectedProject}
                                    onChange={setSelectedProject}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Mensagem</label>
                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Select
                                                options={availableCopies}
                                                value={copy}
                                                onChange={(value) => setCopy(value)}
                                                placeholder="Selecione uma mensagem salva"
                                            />
                                            <Select
                                                value={selectedMedia?.value || ''}
                                                onChange={(value) => {
                                                    if (!value) {
                                                        setSelectedMedia(null)
                                                        return
                                                    }
                                                    const media = projectAttachments.find(a => a.value === value)
                                                    if (media) {
                                                        setSelectedMedia({
                                                            url: media.value,
                                                            type: media.isDocument ? 'document' : media.type,
                                                            name: media.label,
                                                            publicLink: media.publicLink
                                                        })
                                                    }
                                                }}
                                                options={[
                                                    { value: '', label: 'Anexos...' },
                                                    ...projectAttachments.map(att => ({
                                                        value: att.value,
                                                        label: `${att.label} (${att.type.toUpperCase()})`
                                                    }))
                                                ]}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                value={copy}
                                                onChange={(e) => setCopy(e.target.value)}
                                                placeholder="Digite sua mensagem aqui..."
                                                className="block w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!copy && !selectedMedia) return
                                                    const newMessage: Message = {
                                                        id: Date.now(),
                                                        message: copy,
                                                        ...(selectedMedia && {
                                                            attachment: {
                                                                url: selectedMedia.url,
                                                                type: selectedMedia.type,
                                                                name: selectedMedia.name,
                                                                publicLink: selectedMedia.publicLink
                                                            }
                                                        })
                                                    }
                                                    console.log(newMessage)
                                                    setMessages(prev => [...prev, newMessage])
                                                    setCopy('')
                                                    setSelectedMedia(null)
                                                }}
                                                disabled={!copy && !selectedMedia}
                                                className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4 mr-1 inline" /> Adicionar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-md p-4 bg-gray-50 min-h-[300px]">
                            {messages.length > 0 ? (
                                <DndProvider backend={HTML5Backend}>
                                    <div className="space-y-2">
                                        {messages.map((message, index) => (
                                            <MessageComponent
                                                key={message.id}
                                                id={message.id}
                                                index={index}
                                                message={message.message}
                                                attachment={message.attachment}
                                                moveMessage={moveMessage}
                                                draggable={true}
                                                onDelete={handleDeleteMessage}
                                            />
                                        ))}
                                    </div>
                                </DndProvider>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Nenhuma mensagem adicionada
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={isSending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={isSending || messages.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                        {isSending ? 'Enviando...' : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar Mensagem
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
