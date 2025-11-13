import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleButton() {
    return (
        <Button
            variant="secondary"
            className="shadow border border-slate-300 cursor-pointer my-2"
        >
            <Image src="/google.png" alt="Logo" width={20} height={20} />
            Comece Grátis sem Cartão
        </Button>
    )
}