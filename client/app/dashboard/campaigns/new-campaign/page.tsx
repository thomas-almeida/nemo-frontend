'use client'

import { Send, Goal, Plus, CalendarCheck2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import Spinner from "@/app/components/Spinner";
import Select from "@/app/components/Select";
import MessageComponent from "@/app/components/MessageComponent";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { sendMessage } from "@/app/service/sender-service";
import Image from "next/image";
import Accordion from "@/app/components/Accordion";
import { useProjects } from "@/app/hooks/use-projects";
import { useMessages } from "@/app/hooks/use-messages";
import { useCustomers } from "@/app/hooks/use-customers";

export default function NewCampaign() {

    const { projects } = useProjects();
    const { messages: allMessages } = useMessages();
    const { customers } = useCustomers();

    const [numbers, setNumbers] = useState('');
    const [targetList, setTargetList] = useState<string>('select');
    const [selectedCustomers, setSelectedCustomers] = useState<any>([]);
    const [image, setImage] = useState('')
    const [copy, setCopy] = useState('')
    const [messages, setMessages] = useState<Array<{ id: number; text: string; image?: string }>>([]);
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

    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [intervalMinutes, setIntervalMinutes] = useState(5); // Default to 1 minute
    const [messagesPerSend, setMessagesPerSend] = useState(5);
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

    async function send(numbers: string) {
        const numbersArr = numbers.split(',').map(num => num.trim()).filter(Boolean);
        let currentIndex = 0;
        setIsProcessing(true);
        setProgress(0);

        const sendNextBatch = async () => {
            const batch = numbersArr.slice(currentIndex, currentIndex + messagesPerSend);

            // Envia as mensagens em sequência para cada número do lote atual
            for (const number of batch) {
                console.log('Enviando para:', number);

                // Envia todas as mensagens para o número atual
                for (const msg of messages) {
                    await sendMessage(number, msg.text);
                }

                currentIndex++;
                const newProgress = Math.round((currentIndex / numbersArr.length) * 100);
                setProgress(newProgress);

                // Aguarda o intervalo entre mensagens, exceto após a última mensagem
                if (currentIndex < numbersArr.length) {
                    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
                }
            }

            // Se ainda houver mais números para enviar, agenda o próximo lote
            if (currentIndex < numbersArr.length) {
                setTimeout(sendNextBatch, 0);
            } else {
                setIsProcessing(false);
            }
        };

        // Inicia o processo de envio
        sendNextBatch();
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
                                    <h4 className="font-medium">Mensagens por vez:</h4>
                                    <Select
                                        options={[
                                            { value: 1, label: '1 por vez' },
                                            { value: 5, label: '5 por vez' },
                                            { value: 10, label: '10 por vez' },
                                            { value: 15, label: '15 por vez' },
                                        ]}
                                        value={messagesPerSend}
                                        onChange={(value) => setMessagesPerSend(Number(value))}
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
                                                        { value: '/building.jpeg', label: '/building.jpeg' },
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
                                                        text: copy || '',
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
                                                    message={message.text}
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

                {
                    isProcessing && (
                        <div className="w-full flex items-center justify-between gap-1 bg-gray-200 rounded-full h-1 mb-4">
                            <div
                                className="bg-green-600 h-1 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <span>{progress}%</span>
                        </div>
                    )
                }

                <div className="grid grid-cols-2 gap-2 px-2 pb-4">
                    <Button
                        disabled={numbers.length === 0 || isProcessing}
                        className={`cursor-pointer ${isProcessing ? 'bg-gray-700' : 'bg-green-600'} w-full`}
                        onClick={() => {
                            const intervalMs = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds
                            console.log(`Interval set to ${intervalMs}ms`);
                            send(numbers);
                        }}
                    >
                        {
                            isProcessing
                                ? 'Enviando...'
                                : 'Disparar Agora'
                        }
                        {
                            isProcessing
                                ? <Spinner />
                                : <Send className="h-4 w-4" />
                        }

                    </Button>
                    <Button
                        disabled={numbers.length === 0 || isProcessing}
                        className={`cursor-pointer ${isProcessing ? 'bg-gray-700' : 'bg-slate-600'} w-full`}
                        onClick={() => {
                            const intervalMs = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds
                            console.log(`Interval set to ${intervalMs}ms`);
                            send(numbers);
                        }}
                    >
                        {
                            isProcessing
                                ? 'Enviando...'
                                : 'Agendar Disparo'
                        }
                        {
                            isProcessing
                                ? <Spinner />
                                : <CalendarCheck2 className="h-4 w-4" />
                        }

                    </Button>
                </div>

            </div>
        </div>
    );
}