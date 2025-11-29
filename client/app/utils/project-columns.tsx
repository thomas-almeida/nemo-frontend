import { ColumnDef } from "@tanstack/react-table";
import TypeCell from "../components/TypeCell";
import UnitCountBadge from "../components/UnitCountBadge";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "info.name",
    header: "Nome" as const,
    size: 150, // Fixed width in pixels
    maxSize: 150,
    cell: (info) => (
      <div className="truncate" style={{ maxWidth: '150px' }} title={info.getValue() as string}>
        {info.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "info.address",
    header: "Endereço" as const,
    size: 200, // Fixed width in pixels
    maxSize: 200,
    cell: (info) => (
      <div className="truncate" style={{ maxWidth: '150px' }} title={info.getValue() as string}>
        {info.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "info.developer",
    header: "Incorporadora" as const,
    size: 150, // Fixed width in pixels
    maxSize: 150,
    cell: (info) => (
      <div className="truncate" style={{ maxWidth: '150px' }} title={info.getValue() as string}>
        {info.getValue() as string}
      </div>
    ),
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
    header: "Unidades",
    cell: (info) => {
      const units = info.row.original.units || [];
      return <UnitCountBadge units={units} />;
    },
  },
];
