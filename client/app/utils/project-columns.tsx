import { ColumnDef } from "@tanstack/react-table";
import TypeCell from "../components/TypeCell";
import UnitBadge from "../components/UnitBadge";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "info.name",
    header: "Nome" as const,
  },
  {
    accessorKey: "info.address",
    header: "Endereço" as const,
  },
  {
    accessorKey: "info.developer",
    header: "Incorporadora" as const,
  },
  {
    accessorKey: "type",
    header: "Tipos" as const,
    cell: (info) => {
      return <TypeCell row={info.row} />;
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const types = row.original.type || [];
      return types.includes(value);
    },
  },
  {
    id: "units",
    header: "Unidades" as const,
    cell: (info) => {
      return <UnitBadge row={info.row} />;
    },
  },
  {
    id: "averagePrice",
    header: "Preço Médio" as const,
    cell: (info) => {
      const units = info.row.original.units || [];
      if (units.length === 0) return '-';
      
      const total = units.reduce((sum: number, unit: { price: number }) => sum + unit.price, 0);
      const average = total / units.length;
      
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(average);
    },
  },
  {
    accessorKey: "info.releaseDate",
    header: "Entrega" as const,
    cell: (info) => {
      const date = info.getValue() as string;
      if (!date) return '-'; // Retorna um traço se não houver data
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
  },
];
