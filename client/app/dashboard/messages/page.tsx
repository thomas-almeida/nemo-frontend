"use client"

import { useMessages } from "@/app/hooks/use-messages"
import { useProjects } from "@/app/hooks/use-projects"
import DataTable from "@/app/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { NewMessageDialog } from "./components/NewMessageDialog"

export default function MessagesPage() {

    const { messages } = useMessages();
    const { projects } = useProjects()

    const getProjectName = (projectId: string) => {
        const project = projects.find(p => p._id === projectId);
        return project ? project.info?.name : 'Projeto não encontrado';
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "projectId",
            header: "Projeto",
            cell: ({ row }) => {
                const projectId = row.original?.projectId;
                console.log(">>>", projectId)
                return <span>{getProjectName(projectId)}</span>;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Data de Criação"
        }
    ];

    return (
        <div className="container mx-auto py-6 w-[90%]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mensagens</h1>
                    <p className="text-muted-foreground">Gerencie suas mensagens</p>
                </div>
                <NewMessageDialog />
            </div>
            <DataTable
                data={messages}
                columns={columns}
            />
        </div>
    )
}