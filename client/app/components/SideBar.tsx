'use client';

import { Button } from "@/components/ui/button";
import { Send, House, Settings, Folder, LogOut, BadgePercent, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { sidebarOptions } from "../utils/sidebar-options";

export default function SideBar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (pathname === '/') {
        return null;
    }

    return (
        <div className="fixed flex flex-col h-screen p-4 px-2 border-r border-gray-300 bg-white w-45 z-10">
            <div>
                <div className="flex items-center gap-1 text-slate-800 mb-4">
                    <h1 className="font-bold text-lg">OCTO</h1>
                </div>
            </div>
            <Link href="/dashboard/campaigns/new-campaign">
                <Button
                    className="cursor-pointer w-full rounded-sm"
                >
                    Novo Disparo
                    <Send className="h-4 w-4" />
                </Button>
            </Link>
            <ul className="py-4 flex flex-col gap-2">
                {sidebarOptions.map((option: any) => (
                    <Link
                        key={option.name}
                        href={option.href}
                        className="flex justify-start items-center gap-1 px-2 rounded-sm hover:bg-gray-200"
                    >
                        <option.icon className="h-4 w-4" />
                        <li className="py-1">{option.name}</li>
                    </Link>
                ))}
            </ul>
            <div className="absolute bottom-0 w-[90%]">
                <div className="flex items-center gap-1 text-slate-800 mb-4 cursor-pointer">
                    <Image
                        src={session?.user?.image || "/avatar.png"}
                        alt="Avatar"
                        width={35}
                        height={35}
                        className="rounded-sm"
                    />
                    <div>
                        <p className="text-sm font-semibold">{session?.user?.name?.split(" ")[0]}</p>
                        <p className="text-xs bg-slate-500 text-gray-300 font-semibold w-8 rounded-xs text-center">PRO</p>
                    </div>
                </div>
                <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer w-full rounded-sm my-2 border border-slate-300 hover:border-red-400"
                    variant="outline"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            </div>
        </div>
    );
}