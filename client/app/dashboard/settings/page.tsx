'use client'
import { Settings } from "lucide-react";
import { getQrCode } from "@/app/service/connection-service";
import { useEffect, useState } from "react"
import useUserStore from "@/app/store/user-store";


export default function SettingsPage() {
    const user = useUserStore((state) => state);
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        if (!user.sessionId) return;

        async function qrCode() {
            const response = await getQrCode(user.sessionId);
            setQrCode(response?.qrCode);
        }

        qrCode();

    }, [user.sessionId]);

    return (
        <div className="flex justify-center items-start h-screen w-full py-4">
            <div className="w-[80%] p-4">
                <div className="flex items-center gap-1">
                    <Settings className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Configurações</h1>
                </div>
                <div className="py-4">
                    <h3 className="font-semibold">Conexão via QrCode:</h3>
                    <p className="text-sm text-slate-700">Abra seu Whatsapp e conecte-se via o QrCode abaixo para enviar mensagens a seus clientes</p>
                </div>
                {
                    qrCode && (
                        <img src={qrCode} alt="QrCode" />
                    )
                }
            </div>
        </div>
    );
}