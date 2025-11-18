"use client";

import { Row } from "@tanstack/react-table";

interface Unit {
  footage: number;
  price: number;
  _id: string;
}

interface Project {
  info: {
    name: string;
    address: string;
    developer: string;
    releaseDate: string;
  };
  type: string[];
  units: Unit[];
}

export default function UnitBadge({ row }: { row: Row<Project> }) {
  const units = row.original.units || [];
  
  return (
    <div className="flex gap-1">
      {units.map((unit) => (
        <div key={unit._id} className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs rounded-full bg-muted">
            {unit.footage}m²
          </span>
        </div>
      ))}
    </div>
  );
}
