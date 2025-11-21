"use client";

import { Row } from "@tanstack/react-table";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  labels?: string[];
  stage: string;
}

export default function UnitBadge({ row }: { row: Row<Customer> }) {
  const labels = row.original.labels || [];
  
  if (labels.length === 0) {
    return <span className="text-sm text-muted-foreground">Sem etiquetas</span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label, index) => (
        <span 
          key={`${row.original._id}-${index}`} 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
