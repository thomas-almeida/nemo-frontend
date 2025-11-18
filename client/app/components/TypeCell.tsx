"use client";

import { Row } from "@tanstack/react-table";

interface Project {
  info: {
    name: string;
    address: string;
    developer: string;
    releaseDate: string;
  };
  type: string[];
  units: {
    footage: string;
  };
}

export default function TypeCell({ row }: { row: Row<Project> }) {
  const types = row.original.type || [];
  
  return (
    <div className="flex gap-1 flex-wrap">
      {types.map((type) => (
        <span
          key={type}
          className="px-2 py-1 text-xs rounded-full bg-muted"
        >
          {type}
        </span>
      ))}
    </div>
  );
}