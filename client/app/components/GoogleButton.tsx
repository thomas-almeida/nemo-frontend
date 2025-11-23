'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
    children: React.ReactNode;
    className: string;
    logo?: boolean;
    icon?: React.ReactNode
}


export default function GoogleButton({ children, className, logo = true, icon }: GoogleButtonProps) {
    return (
        <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className={`shadow border cursor-pointer my-2 ${className}`}
        >
            {
                logo && <Image src="/google.png" alt="Logo" width={20} height={20} className="mr-2" />
            }
            {children}
            {icon && <span>{icon}</span>}
        </Button>
    )
}