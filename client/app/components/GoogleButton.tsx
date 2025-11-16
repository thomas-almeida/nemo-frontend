'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
    return (
        <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            variant="secondary"
            className="shadow border border-slate-300 cursor-pointer my-2"
        >
            <Image src="/google.png" alt="Logo" width={20} height={20} />
            Comece Grátis sem Cartão
        </Button>
    )
}