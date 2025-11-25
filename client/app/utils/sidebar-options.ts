import { House, BadgePercent, Folder, MessageCircle, Settings, User, UserStar } from "lucide-react"

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
        name: "Gerar Leads",
        href: "#",
        icon: UserStar
    },
    {
        name: "Planos",
        href: "#",
        icon: BadgePercent
    },
    {
        name: "Configurações",
        href: "/dashboard/settings",
        icon: Settings
    }
]