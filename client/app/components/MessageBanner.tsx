import { Button } from "@/components/ui/button";
import { BadgePercent } from "lucide-react";

export default function MessageBanner() {
    return (
        <div className="flex justify-start items-center gap-2 px-4 py-3 bg-green-100 w-full shadow-sm relative">
            <BadgePercent className="h-8 w-8 text-green-600" />
            <div>
                <h3 className="text-sm font-semibold">Modo Gratuito - 7 Dias Restantes</h3>
                <p className="text-xs">Você esta no periodo de testes do <b className="italic">Octo</b>, aproveite os recursos equanto escolhe um de nossos planos. </p>
            </div>
            <Button className="rounded-sm shadow text-xs absolute right-2 bg-green-600 hover:bg-green-700 cursor-pointer">
                Escolher Plano
            </Button>
        </div>
    )
}