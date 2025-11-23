'use client'

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Item from "../components/Item";
import Link from "next/link";
import { useAuth } from "../hooks/use-auth";
import useCustomerStore from "@/app/store/customer-store";
import { 
  User, 
  MessageSquare, 
  Sparkles, 
  Handshake, 
  FileText, 
  Users 
} from "lucide-react";

export default function Dashboard() {
    const session = useSession();
    const { user } = useAuth()
    const { customers } = useCustomerStore();

    const stages = [
        { 
            name: 'Aguardando Contato', 
            count: 0,
            icon: <User className="h-5 w-5 text-blue-500" />,
            description: 'Clientes que ainda não atenderam ligações ou responderam ao seu disparo'
        },
        { 
            name: 'Primeiro Contato', 
            count: 0,
            icon: <MessageSquare className="h-5 w-5 text-green-500" />,
            description: 'Ligações atendidas e interações no Whatsapp'
        },
        { 
            name: 'Esteira Encantamento', 
            count: 0,
            icon: <Sparkles className="h-5 w-5 text-purple-500" />,
            description: 'Em processo de encantamento, pesquisa e esteira'
        },
        { 
            name: 'Negociação', 
            count: 0,
            icon: <Handshake className="h-5 w-5 text-yellow-500" />,
            description: 'Converas sobre fluxo de pagamento, cliente mandou documentos'
        },
        { 
            name: 'Rodando Contrato', 
            count: 0,
            icon: <FileText className="h-5 w-5 text-emerald-500" />,
            description: 'Contrato em andamento, esperando assinatura do cliente'
        }
    ];

    // Count customers by stage
    customers.forEach(customer => {
        const stage = customer.stage || 'Aguardando Contato';
        const stageObj = stages.find(s => s.name === stage);
        if (stageObj) {
            stageObj.count++;
        }
    });

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            redirect('/');
        }
    }, [session.status])

    return (
        <div className="flex justify-center items-start h-screen w-[90%]">
            <div className="w-full">
                <div className="py-4">
                    <h1>Olá, <b>{user.username}</b></h1>
                </div>
                <div className="grid grid-cols-2 gap-4">

                </div>
                <div className="py-4">
                    <div className="">
                        <h2 className="font-semibold">Resumo da carteira</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                    <Item 
                        title="Total de Clientes" 
                        value={customers.length.toString()} 
                        description="Clientes Cadastrados"
                        icon={<Users className="h-5 w-5 text-indigo-500" />}
                    />
                    {stages.map((stage, index) => (
                        <Item 
                            key={index} 
                            title={stage.name} 
                            value={stage.count.toString()} 
                            description={stage.description}
                            icon={stage.icon}
                        />
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
}

