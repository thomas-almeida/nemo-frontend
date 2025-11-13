'use client';

import { Button } from "@/components/ui/button";
import { FishSymbol, Send, House, Settings, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

import axios from "axios";
import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";

export default function SideBar() {
    const pathname = usePathname();

    // Hide sidebar if we're on the root path
    if (pathname === '/') {
        return null;
    }

    const [statusData, setStatusData] = useState<any>({});

    useEffect(() => {
        axios.get("http://localhost:3000/status").then((response) => {
            setStatusData(response.data);
        });
    }, []);

    return (
        <div className="flex flex-col h-screen p-4 px-2 border-r border-gray-300 relative">
            <div className="flex items-center gap-1 text-green-600 mb-4">
                <div className="rounded border p-1 border-green-600 shadow">
                    <FishSymbol className="h-3 w-3 -rotate-90" />
                </div>
                <h1 className="font-semibold text-lg">Nemo</h1>
            </div>
            <Link href="/campaigns/new-campaign">
                <Button
                    className="my-1 bg-green-600 hover:bg-green-700 cursor-pointer w-full rounded-sm"
                >
                    Novo Disparo
                    <Send className="h-4 w-4" />
                </Button>
            </Link>
            <ul className="py-2 flex flex-col gap-2">
                <Link href="/dashboard" className="flex justify-start items-center gap-1 px-2 rounded-sm hover:bg-gray-200">
                    <House className="h-4 w-4" />
                    <li className="py-1">Home</li>
                </Link>
                <Link href="/campaigns" className="flex justify-start items-center gap-1 px-2 rounded-sm hover:bg-gray-200">
                    <Send className="h-4 w-4" />
                    <li className="py-1">Campanhas</li>
                </Link>
                <Link href="/campaigns" className="flex justify-start items-center gap-1 px-2 rounded-sm hover:bg-gray-200">
                    <Folder className="h-4 w-4" />
                    <li className="py-1">Projetos</li>
                </Link>
                <Link href="/settings" className="flex justify-start items-center gap-1 px-2 rounded-sm hover:bg-gray-200">
                    <Settings className="h-4 w-4" />
                    <li className="py-1">Configurações</li>
                </Link>
                <div className=" p-1 absolute bottom-3">
                    <b
                        style={{
                            color: statusData?.isConnected === true ? "green" : "red"
                        }}
                        className="flex justify-start items-center gap-1 text-sm"
                    >
                        <div className="p-1 rounded">
                            {
                                statusData?.isConnected === true ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <X className="h-3 w-3" />
                                )
                            }
                        </div>
                        {statusData?.isConnected === true ? "Conectado" : "Desconectado"}
                    </b>
                </div>
            </ul>
        </div>
    );
}