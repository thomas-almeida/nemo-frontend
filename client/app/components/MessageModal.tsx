'use client';
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface MessageModalProps {
    message: string;
    description: string;
    visible: boolean;
    onClose: () => void;
}

export default function MessageModal({ message, description, visible, onClose }: MessageModalProps) {

    return (
        <>
            {visible && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-black/50 z-[9999]"
                >
                    <div className="w-[40%] flex flex-col justify-center items-center bg-white p-12 rounded text-center relative z-[10000]" onClick={(e) => e.stopPropagation()}>
                        <Crown className="w-10 h-10 text-primary mb-4" />
                        <h1 className="text-2xl font-semibold">{message}</h1>
                        <p className="text-sm text-gray-500 py-2">{description}</p>
                        <div className="grid grid-cols-2 gap-1 w-full">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="mt-4 cursor-pointer"
                                variant={"outline"}
                            >
                                Usar limitado
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="mt-4 cursor-pointer"
                                disabled
                            >
                                Decolar vendas
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}