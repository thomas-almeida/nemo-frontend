'use client'

import { Send, Goal, Plus, CalendarCheck2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import { formatPhoneNumber } from "@/lib/phone-utils";
import Spinner from "@/app/components/Spinner";
import Select from "@/app/components/Select";
import MessageComponent from "@/app/components/MessageComponent";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from "next/image";
import Accordion from "@/app/components/Accordion";
import { useProjects } from "@/app/hooks/use-projects";
import { useMessages } from "@/app/hooks/use-messages";
import { useCustomers } from "@/app/hooks/use-customers";
import { useAttachments } from "@/app/hooks/use-attachments";
import { SendingProgressModal } from "../../../components/SendingProgressModal";
import { sendMessage } from "@/app/service/sender-service";
import { useAuth } from "@/app/hooks/use-auth";

interface Message {
    id: number | string;
    message: string;
    image?: {
        url: string;
        type: string;
        name: string;
        publicLink: string;
    };
}

export default function NewCampaign() {

    const { projects } = useProjects();
    const { messages: allMessages } = useMessages();
    const { customers } = useCustomers();
    const { attachments: allAttachments } = useAttachments();

    const { user } = useAuth();

    const [numbers, setNumbers] = useState('');
    const [targetList, setTargetList] = useState<string>('select');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<any>([]);
    const [selectedMedia, setSelectedMedia] = useState<any>(null)
    const [copy, setCopy] = useState('')
    const [messages, setMessages] = useState<Message[]>([]);
    const [availableCopies, setAvailableCopies] = useState<Array<{ value: string; label: string }>>([]);
    const [projectAttachments, setProjectAttachments] = useState<Array<{ value: string, label: string, type: string, isDocument: boolean }>>([]);

    const [allCustomers, setAllCustomers] = useState(customers);

    const moveMessage = useCallback((dragIndex: number, hoverIndex: number) => {
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const [movedMessage] = newMessages.splice(dragIndex, 1);
            newMessages.splice(hoverIndex, 0, movedMessage);
            return newMessages;
        });
    }, []);

    const handleDeleteMessage = useCallback((id: string | number) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    }, []);

    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentBatch, setCurrentBatch] = useState(1);
    const [currentNumber, setCurrentNumber] = useState('');
    const [sentNumbers, setSentNumbers] = useState<string[]>([]);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [intervalMinutes, setIntervalMinutes] = useState(5);
    const [sendsPerRound, setSendsPerRound] = useState(5);
    const [project, setProject] = useState('');

    // Atualiza os anexos quando o projeto é selecionado
    useEffect(() => {
        if (project) {
            if (project === 'all') {
                // Carrega todos os anexos quando nenhum projeto específico é selecionado
                const allMediaOptions = allAttachments.map(attachment => {
                    const projectName = projects.find(p => p._id === attachment.projectId)?.info?.name || 'Projeto';
                    return {
                        value: attachment.fileUrl,
                        label: `${projectName} - ${attachment.name}`,
                        type: attachment.type,
                        isDocument: attachment.type === 'pdf' || attachment.type === 'doc' || attachment.type === 'docx' || attachment.type === 'xls' || attachment.type === 'xlsx',
                        projectId: attachment.projectId
                    };
                });
                setProjectAttachments(allMediaOptions);
                setSelectedProject(null);
            } else {
                // Filtra os anexos do projeto selecionado
                const currentProject = projects.find(p => p._id === project);
                setSelectedProject(currentProject || null);

                const projectAttachments = allAttachments.filter(
                    attachment => attachment.projectId === project
                );

                // Mapeia os anexos para o formato do select
                const mediaOptions = projectAttachments.map(attachment => ({
                    value: attachment.fileUrl,
                    label: attachment.name,
                    type: attachment.type,
                    isDocument: attachment.type === 'pdf' || attachment.type === 'doc' || attachment.type === 'docx' || attachment.type === 'xls' || attachment.type === 'xlsx',
                    projectId: attachment.projectId
                }));

                setProjectAttachments(mediaOptions);
            }
        } else {
            setSelectedProject(null);
            setProjectAttachments([]);
        }
    }, [project, projects, allAttachments]);

    // Carrega as cópias disponíveis quando um projeto é selecionado
    useEffect(() => {
        if (allMessages.length > 0) {
            let projectMessages;

            if (project === 'all') {
                // Se "nenhum específico" for selecionado, carrega todas as mensagens
                projectMessages = allMessages;
            } else if (project) {
                // Filtra as mensagens pelo projectId selecionado
                projectMessages = allMessages.filter(msg => msg.projectId === project);
            } else {
                // Se nenhum projeto for selecionado, não mostra cópias
                setAvailableCopies([{ value: '', label: 'Nenhuma' }]);
                return;
            }

            const copies = projectMessages.map(msg => ({
                value: msg.copy || msg.name,
                label: msg.name
            }));
            setAvailableCopies([
                { value: '', label: 'Nenhuma' },
                ...copies
            ]);
        } else {
            setAvailableCopies([{ value: '', label: 'Nenhuma' }]);
        }
    }, [project, allMessages]);

    async function send() {
        if (selectedCustomers.length === 0) {
            alert('Selecione pelo menos um contato para enviar a campanha.');
            return;
        }

        if (messages.length === 0) {
            alert('Adicione pelo menos uma mensagem à campanha.');
            return;
        }

        setIsSending(true);
        setProgress(0);
        setCurrentBatch(1);
        setShowProgressModal(true);

        const numbers = selectedCustomers;
        const mps = sendsPerRound;
        const intervalMs = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds
        const msgs = messages;
        const totalBatches = Math.ceil(numbers.length / mps);
        let processedCount = 0;
        let currentIndex = 0;

        const sendBatch = async (startIdx: number, batchNumber: number) => {
            const endIdx = Math.min(startIdx + mps, numbers.length);
            setCurrentBatch(batchNumber);

            for (let i = startIdx; i < endIdx; i++) {
                setCurrentNumber(numbers[i]?.phone || '');
                processedCount++;

                // Calculate progress
                const newProgress = Math.round((processedCount / numbers.length) * 100);
                setProgress(newProgress);

                const newMsgFormatt = msgs.map(msg => ({
                    message: msg.message,
                    image: msg.image
                }));

                try {

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const formattedPhone = formatPhoneNumber(numbers[i].phone);
                    const response = await sendMessage(user.sessionId, formattedPhone, newMsgFormatt);

                    if (response) {
                        console.log(`[${i + 1}/${numbers.length}] Enviado para: ${formattedPhone}`);
                        setSentNumbers(prev => [...prev, formattedPhone]);
                    }

                } catch (error) {
                    console.error(`Erro ao enviar para ${numbers[i].phone}:`, error);
                }

                // If not the last number in the batch, wait for the interval
                if (i < endIdx - 1) {
                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                }
            }

            currentIndex = endIdx;

            // If there are more numbers to process, schedule the next batch
            if (currentIndex < numbers.length) {
                const nextBatchNumber = batchNumber + 1;
                setTimeout(() => sendBatch(currentIndex, nextBatchNumber), intervalMs);
            } else {
                console.log('\n--- Todos os envios foram concluídos! ---');
                setIsSending(false);
            }
        };

        // Start the first batch
        await sendBatch(0, 1);
    }

    return (
        <div className="flex justify-center items-start h-screen w-full py-4">
            <div className="w-[80%] p-4">
                <div>
                    <div className="flex items-center gap-1">
                        <Goal className="h-5 w-5" />
                        <h1 className="text-xl font-semibold">Nova campanha</h1>
                    </div>
                    <p className="text-sm text-slate-500">Crie novas campanhas de envio para seus clientes</p>
                </div>

                <div className="flex flex-col justify-start">

                    <div className="py-2 rounded flex flex-col p-2 my-2 gap-4">

                        <Accordion title="Projeto/Produto Alvo" defaultOpen={true}>
                            <p className="text-sm text-slate-500 mb-3">Escolha qual projeto/produto quer disparar</p>
                            <Select
                                options={[
                                    { value: '', label: 'Selecione um projeto...' },
                                    { value: 'all', label: 'Nenhum (Carrega todas as mensagens)' },
                                    ...projects.map(proj => ({
                                        value: proj._id,
                                        label: proj.info?.name || `Projeto ${proj._id.substring(0, 6)}...`
                                    }))
                                ]}
                                value={project}
                                onChange={setProject}
                            />
                        </Accordion>

                        <Accordion title="Configurações de Envio" defaultOpen={true}>
                            <p className="text-sm text-slate-500 mb-3">De quanto em quanto tempo as mensagens serão enviadas?</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="border border-slate-200 py-2 px-4 rounded-sm">
                                    <h4 className="font-medium">Envios por vez:</h4>
                                    <Select
                                        options={[
                                            { value: 1, label: '1 envio por vez' },
                                            { value: 5, label: '5 envios por vez' },
                                            { value: 10, label: '10 envios por vez' },
                                            { value: 15, label: '15 envios por vez' },
                                        ]}
                                        value={sendsPerRound}
                                        onChange={(value) => setSendsPerRound(Number(value))}
                                    />
                                </div>
                                <div className="border border-slate-200 py-2 px-4 rounded-sm">
                                    <h4 className="font-medium">Intervalo entre envios:</h4>
                                    <Select
                                        options={[
                                            { value: 1, label: '1 minuto' },
                                            { value: 5, label: '5 minutos' },
                                            { value: 10, label: '10 minutos' },
                                            { value: 15, label: '15 minutos' },
                                        ]}
                                        value={intervalMinutes}
                                        onChange={(value) => setIntervalMinutes(Number(value))}
                                    />
                                </div>
                            </div>
                        </Accordion>

                        <Accordion title="Contatos" defaultOpen={true}>
                            <p className="text-sm text-slate-500 mb-3">Selecione a lista alvo</p>
                            <Select
                                options={[
                                    { value: 'select', label: 'Selecione' },
                                    { value: 'all', label: 'Toda Minha Base' },
                                ]}
                                value={targetList}
                                onChange={(value) => {
                                    setTargetList(value);
                                    if (value === 'all') {
                                        setSelectedCustomers(allCustomers);
                                    } else {
                                        setSelectedCustomers([]);
                                    }
                                }}
                            />
                        </Accordion>

                        <Accordion title="Mensagens" defaultOpen={true}>
                            <p className="text-sm text-slate-500 mb-3">Arraste e solte para mudar a ordem das mensagens do projeto que quer enviar</p>
                            <div className="grid grid-cols-2 gap-2 border rounded p-2 my-2 shadow">
                                <div className="p-4 py-6">
                                    <h4 className="font-semibold">Montar Mensagem</h4>
                                    <p className="text-sm text-slate-500">Escolha a copy da mensagem e adicione imagens e anexos do projeto para disparar, uma prévia aparecerá ao lado</p>

                                    <div className="py-2">
                                        <div className="p-2 my-2 border border-slate-300 rounded">
                                            <h4>Mídia (Opcional)</h4>
                                            <div className="space-y-4">
                                                {selectedMedia && (
                                                    <div className="relative border rounded-lg p-3">
                                                        {selectedMedia.type?.includes("image/") ? (
                                                            <Image
                                                                src={selectedMedia.publicLink}
                                                                alt="Mídia selecionada"
                                                                width={200}
                                                                height={200}
                                                                className="w-full h-auto max-h-40 object-contain rounded"
                                                            />
                                                        ) : (
                                                            <div className="p-4 bg-muted/50 rounded flex items-center">
                                                                <div className="bg-primary/10 p-3 rounded-full mr-3">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                    </svg>
                                                                </div>
                                                                <div className="truncate">
                                                                    <p className="font-medium truncate">{selectedMedia.name}</p>
                                                                    <p className="text-xs text-muted-foreground">Arquivo {selectedMedia.type.toUpperCase()}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedMedia(null)
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}

                                                <Select
                                                    options={[
                                                        { value: '', label: 'Nenhuma' },
                                                        ...projectAttachments.map(att => ({
                                                            ...att,
                                                            label: `${att.label} (${att.type.toUpperCase()})`
                                                        }))
                                                    ]}
                                                    value={selectedMedia?.url || ''}
                                                    onChange={(value) => {
                                                        if (!value) {
                                                            setSelectedMedia(null);
                                                            return;
                                                        }
                                                        const media = projectAttachments.find(a => a.value === value);
                                                        if (media) {
                                                            const attachment = allAttachments.find(a => a.fileUrl === media.value);
                                                            setSelectedMedia({
                                                                url: media.value,
                                                                type: media.isDocument ? 'document' : media.type,
                                                                name: media.label,
                                                                publicLink: attachment?.publicLink
                                                            });
                                                            console.log({
                                                                url: media.value,
                                                                type: media.isDocument ? 'document' : media.type,
                                                                name: media.label,
                                                                publicLink: attachment?.publicLink
                                                            })
                                                        }
                                                    }}
                                                    placeholder="Selecione uma mídia do projeto"
                                                />
                                                {projectAttachments.length === 0 && project && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Nenhum anexo encontrado para este projeto.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-2 my-2 border border-slate-300 rounded">
                                            <h4>Copy da Mensagem</h4>
                                            {
                                                copy !== '' &&
                                                (
                                                    <div>
                                                        <MessageComponent
                                                            message={copy || (selectedMedia ? '' : 'Prévia da mensagem aparecerá aqui')}
                                                            draggable={false}
                                                        />
                                                    </div>
                                                )
                                            }
                                            <Select
                                                options={availableCopies}
                                                value={copy}
                                                onChange={(value) => setCopy(value)}
                                            />
                                        </div>


                                        <div className="">
                                            <Button
                                                className="w-full cursor-pointer mt-2"
                                                onClick={() => {
                                                    if (!copy && !selectedMedia) return;
                                                    const newMessage: Message = {
                                                        id: Date.now(),
                                                        message: copy,
                                                        ...(selectedMedia && {
                                                            image: {
                                                                url: selectedMedia.url,
                                                                type: selectedMedia.type,
                                                                name: selectedMedia.name,
                                                                publicLink: selectedMedia.publicLink
                                                            }
                                                        })
                                                    };
                                                    setMessages(prev => [...prev, newMessage]);
                                                    setCopy('');
                                                    setSelectedMedia(null);
                                                }}
                                                disabled={!copy && !selectedMedia}
                                            >
                                                Adicionar Mensagem
                                                <Plus className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-4 px-8">
                                    {messages.length > 0 ? (
                                        <DndProvider backend={HTML5Backend}>
                                            {messages.map((message, index) => (
                                                <MessageComponent
                                                    key={message.id}
                                                    id={message.id}
                                                    index={index}
                                                    message={message.message}
                                                    image={message.image}
                                                    moveMessage={moveMessage}
                                                    draggable={true}
                                                    onDelete={handleDeleteMessage}
                                                />
                                            ))}
                                        </DndProvider>
                                    ) : (
                                        <div className="flex justify-center items-center h-full">
                                            <div className="text-center text-gray-600">
                                                <p>As Prévias Aparecerão Aqui</p>
                                                <p className="text-xs">Adicione mensagens usando o formulário ao lado</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Accordion>

                    </div>
                </div>

                <SendingProgressModal
                    isOpen={showProgressModal}
                    onClose={() => {
                        if (progress >= 100 || !isSending) {
                            setShowProgressModal(false);
                            // Reset sent numbers when closing the modal
                            if (progress >= 100) {
                                setSentNumbers([]);
                            }
                        }
                    }}
                    progress={progress}
                    currentBatch={currentBatch}
                    totalBatches={Math.ceil(selectedCustomers.length / sendsPerRound)}
                    currentNumber={currentNumber}
                    totalNumbers={selectedCustomers.length}
                    processedCount={Math.round((progress / 100) * selectedCustomers.length)}
                    sentNumbers={sentNumbers}
                />

                <div className="grid grid-cols-1 gap-2 px-2 pb-4">
                    <Button
                        className={`cursor-pointer ${isSending ? 'bg-gray-700' : 'bg-green-600 hover:bg-green-700'} w-full`}
                        onClick={send}
                        disabled={isSending}
                    >
                        {isSending ? 'Enviando...' : 'Disparar Agora'}
                    </Button>
                </div>

            </div>
        </div>
    );
}