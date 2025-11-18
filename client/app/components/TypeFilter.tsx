"use client";

import { Button } from "@/components/ui/button";

interface TypeFilterProps {
  value: string | null;
  onChange: (type: string | null) => void;
  availableTypes: string[][];
}

export default function TypeFilter({ 
  value, 
  onChange, 
  availableTypes 
}: TypeFilterProps) {
  // Extrai todos os tipos únicos e remove duplicatas
  const uniqueTypes = Array.from(
    new Set(availableTypes.flat())
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <Button
        variant={value === null ? "default" : "outline"}
        size="sm"
        onClick={() => onChange(null)}
      >
        Todos
      </Button>
      {uniqueTypes.map((type) => (
        <Button
          key={type}
          variant={value === type ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(value === type ? null : type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
}