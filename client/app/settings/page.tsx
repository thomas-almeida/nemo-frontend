'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Settings, Check, X } from "lucide-react";

export default function SettingsPage() {

    const [qrCode, setQrCode] = useState("");
    const [statusData, setStatusData] = useState<any>({});

    useEffect(() => {
        axios.get("http://localhost:3000/qrcode").then((response) => {
            setQrCode(response.data.qrCode);
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/status").then((response) => {
            setStatusData(response.data);
        });
    }, []);

    return (
        <div className="flex justify-center items-start h-screen w-full py-4">
            <div className="w-[80%] p-4">
                <div className="flex items-center gap-1">
                    <Settings className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Configurações</h1>
                </div>
                <div className="py-4">
                    <h3 className="font-semibold">Conexão Atual:</h3>
                    <p className="text-sm text-slate-700">Status da conexão</p>
                    <b
                        style={{
                            color: statusData?.isConnected === true ? "green" : "red"
                        }}
                        className="flex justify-start items-center gap-1 py-2"
                    >
                        <div className="p-1 bg-gray-200 rounded">
                            {
                                statusData?.isConnected === true ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <X className="h-4 w-4" />
                                )
                            }
                        </div>
                        {statusData?.message}
                    </b>
                </div>
                <div className="py-4">
                    <h3 className="font-semibold">Conexão via QrCode:</h3>
                    <p className="text-sm text-slate-700">Abra seu Whatsapp e conecte-se via o QrCode abaixo</p>
                    {
                        qrCode ? (
                            <Image src={qrCode} alt="QR Code" width={256} height={256} />
                        ) : (
                            <div className="border border-slate-300 w-[220px] h-[200px] flex items-center justify-center rounded my-2 shadow bg-black/65 text-white">
                                <b>Conexão já estabelecida</b>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    );
}