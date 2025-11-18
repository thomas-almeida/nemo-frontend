"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";

// Defina o tipo dos seus dados
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  date: string;
};

// Dados de exemplo
const data: Payment[] = [
  {
    id: "1",
    amount: 100,
    status: "pending",
    email: "exemplo1@email.com",
    date: "2023-05-15",
  },
  {
    id: "2",
    amount: 200,
    status: "processing",
    email: "exemplo2@email.com",
    date: "2023-05-16",
  },
  {
    id: "3",
    amount: 300,
    status: "success",
    email: "exemplo3@email.com",
    date: "2023-05-17",
  },
  {
    id: "4",
    amount: 400,
    status: "failed",
    email: "exemplo4@email.com",
    date: "2023-05-18",
  },
];

// Defina as colunas da tabela
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap: Record<string, string> = {
        pending: "Pendente",
        processing: "Processando",
        success: "Sucesso",
        failed: "Falha",
      };

      return <div>{statusMap[status] || status}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = new Intl.DateTimeFormat("pt-BR").format(date);
      return <div>{formatted}</div>;
    },
  },
];

export function TableExample() {
  // Função chamada quando uma linha é clicada
  const handleRowClick = (row: Payment) => {
    console.log("Linha clicada:", row);
    // Aqui você pode navegar para uma página de detalhes, abrir um modal, etc.
  };

  // Função chamada quando a seleção de linhas muda
  const handleRowSelectionChange = (selectedRows: Payment[]) => {
    console.log("Linhas selecionadas:", selectedRows);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Tabela</h1>
      <DataTable
        columns={columns}
        data={data}
        searchKey="email" // Habilita busca pelo campo email
        onRowClick={handleRowClick}
        onRowSelectionChange={handleRowSelectionChange}
        pageSize={5}
      />
    </div>
  );
}
