"use client";

interface UnitCountBadgeProps {
  units: Array<{ footage: string; price: number }>;
}

export default function UnitCountBadge({ units }: UnitCountBadgeProps) {
  if (!units || units.length === 0) {
    return <span className="text-sm text-muted-foreground">Sem unidades</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {units.map((unit, index) => (
        <span 
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
          title={`R$ ${unit.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        >
          {unit.footage} m2
        </span>
      ))}
    </div>
  );
}
