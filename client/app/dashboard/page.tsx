'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Item from "../components/Item";
import Link from "next/link";
import { useAuth } from "../hooks/use-auth";

export default function Dashboard() {
    const session = useSession();
    const { user } = useAuth()
    
    useEffect(() => {
        if (session.status === 'unauthenticated') {
            redirect('/');
        }
    }, [session.status])

    return (
        <div className="flex justify-center items-start h-screen w-full">
            <div className="flex flex-col gap-1 w-full p-4 py-6">
                <div className="py-4">
                    <h1>Olá, <b>{user.username}</b></h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/dashboard/campaigns">
                        <Item title="Vendas" value="R$ -" description="Total em vendas esse mês" />
                    </Link>
                    <Link href="/dashboard/projects">
                        <Item title="Comissionado" value="R$ -" description="Total em comissionado esse mês" />
                    </Link>
                </div>
                <div className="py-4">
                    <div className="">
                        <h2 className="font-semibold">Atividades</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-4 py-2">
                        <Item title="Disparos" value="-" description="Disparos" />
                        <Item title="Interações" value="-" description="Interações" />
                        <Item title="Na Esteira" value="-" description="Na Esteira" />
                        <Item title="Negociando" value="-" description="Negociando" />
                    </div>
                </div>
            </div>
        </div>
    );
}

