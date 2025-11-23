
import { LucideIcon } from "lucide-react";

interface ItemProps {
    title: string;
    value: string;
    description: string;
    icon?: React.ReactNode;
}

export default function Item({ title, value, description, icon }: ItemProps) {
    return (
        <div className="flex flex-col gap-2 border border-gray-200 px-4 py-4 rounded hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
                <span className="text-4xl font-bold text-gray-800">{value}</span>
            </div>
            <div className="flex justify-start items-center gap-2">
                {icon}
                <h3 className="text-lg font-semibold text-gray-800 leading-tight">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 leading-tight">{description}</p>
        </div>
    )
}