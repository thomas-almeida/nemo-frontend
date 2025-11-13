'use client'

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Spinner from "@/app/components/Spinner";

import { Goal } from "lucide-react";

import { sendMessage } from "@/app/service/sender-service";

export default function NewCampaign() {

    const [numbers, setNumbers] = useState('');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [intervalMinutes, setIntervalMinutes] = useState(1); // Default to 1 minute

    async function send(numbers: string) {
        const numbersArr = numbers.split(',').map(num => num.trim()).filter(Boolean);
        let currentIndex = 0;
        setIsProcessing(true);
        setProgress(0);

        const printNextNumber = async () => {
            if (currentIndex < numbersArr.length) {
                console.log(numbersArr[currentIndex]);

                await sendMessage(numbersArr[currentIndex], message);

                // Update progress
                const newProgress = Math.round(((currentIndex + 1) / numbersArr.length) * 100);
                setProgress(newProgress);

                currentIndex++;
                const intervalMs = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds
                setTimeout(printNextNumber, intervalMs);
            } else {
                setIsProcessing(false);
            }
        };

        printNextNumber();
    }

    return (
        <div className="flex justify-center items-start h-screen w-full py-4">
            <div className="w-[80%] p-4">
                <div className="flex items-center gap-1">
                    <Goal className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Nova campanha</h1>
                </div>

                <div className="flex flex-col justify-start">

                    <div className="py-2rounded flex flex-col p-2 my-2">
                        <div className="py-2 flex flex-col">
                            <label htmlFor="Mensagem">Mensagem:</label>
                            <textarea
                                placeholder="Mensagem de Texto"
                                className="p-4 border border-slate-400 rounded my-2"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                            >

                            </textarea>
                        </div>
                        <div className="py-2 flex flex-col">
                            <label htmlFor="">Intervalo entre Envios (evitar bloqueio)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="p-2 border border-slate-400 rounded my-2 w-20"
                                    value={intervalMinutes}
                                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                                />
                                <span>minutos</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-2rounded flex flex-col p-2 my-2">
                        <label htmlFor="">Numeros:</label>
                        <textarea
                            placeholder="Insira os numeros separados por vírgula"
                            className="p-4 border border-slate-400 rounded my-2"
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                            rows={3}
                        ></textarea>
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
                            : 'Enviar'
                    }
                    {
                        isProcessing
                            ? <Spinner />
                            : <Send className="h-4 w-4" />
                    }

                </Button>

            </div>
        </div>
    );
}