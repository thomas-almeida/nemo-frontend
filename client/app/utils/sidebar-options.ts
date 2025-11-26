import { House, Folder, MessageCircle, Settings, User } from "lucide-react"

export const sidebarOptions = [
    {
        name: "Home",
        href: "/dashboard",
        icon: House
    },
    {
        name: "Projetos",
        href: "/dashboard/projects",
        icon: Folder
    },
    {
        name: "Clientes",
        href: "/dashboard/customers",
        icon: User
    },
    {
        name: "Mensagens",
        href: "/dashboard/messages",
        icon: MessageCircle
    },
    {
        name: "Configurações",
        href: "/dashboard/settings",
        icon: Settings
    }
]