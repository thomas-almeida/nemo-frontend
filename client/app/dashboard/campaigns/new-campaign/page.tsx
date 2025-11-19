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
import { SendingProgressModal } from "../../../components/SendingProgressModal";
import { sendMessage } from "@/app/service/sender-service";
import { useAuth } from "@/app/hooks/use-auth";

export default function NewCampaign() {

    const { projects } = useProjects();
    const { messages: allMessages } = useMessages();
    const { customers } = useCustomers();

    const { user } = useAuth();

    const [numbers, setNumbers] = useState('');
    const [targetList, setTargetList] = useState<string>('select');
    const [selectedCustomers, setSelectedCustomers] = useState<any>([]);
    const [image, setImage] = useState('')
    const [copy, setCopy] = useState('')
    const [messages, setMessages] = useState<Array<{ id: number; message: string; image?: string }>>([]);
    const [availableCopies, setAvailableCopies] = useState<Array<{ value: string; label: string }>>([]);

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
                                            <h4>Imagem (Opcional)</h4>
                                            <div>
                                                {
                                                    image !== "" &&
                                                    (
                                                        <Image
                                                            src={image}
                                                            alt="Imagem"
                                                            width={150}
                                                            height={150}
                                                            className="w-full rounded mb-2"
                                                        />
                                                    )
                                                }

                                                <Select
                                                    options={[
                                                        { value: '', label: 'Nenhuma' },
                                                        { value: 'https://pinbarrafunda.site/assets/images/pin-book-a3-69-1.webp', label: 'Imagem Teste' },
                                                    ]}
                                                    value={image}
                                                    onChange={(value) => setImage(value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-2 my-2 border border-slate-300 rounded">
                                            <h4>Copy da Mensagem</h4>
                                            {
                                                copy !== '' &&
                                                (
                                                    <div>
                                                        <MessageComponent
                                                            message={copy || (image ? '' : 'Prévia da mensagem aparecerá aqui')}
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
                                                    if (!copy && !image) return;
                                                    const newMessage = {
                                                        id: Date.now(),
                                                        message: copy || '',
                                                        ...(image && { image })
                                                    };
                                                    setMessages(prev => [...prev, newMessage]);
                                                    setCopy('');
                                                    setImage('');
                                                }}
                                                disabled={!copy && !image}
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