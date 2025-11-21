"use client";

interface LabelBadgeProps {
  labels: string[];
}

export default function LabelBadge({ labels }: LabelBadgeProps) {
  if (!labels || labels.length === 0) {
    return <span className="text-sm text-muted-foreground">Sem etiquetas</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label, index) => (
        <span 
          key={index}
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
            label.toLowerCase() === 'atendida' 
              ? 'bg-green-100 text-green-800' 
              : label.toLowerCase() === 'sem interesse'
                ? 'bg-red-100 text-red-800'
                : 'bg-purple-100 text-purple-800'
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
