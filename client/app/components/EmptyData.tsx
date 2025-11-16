
import { MessageCircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

interface EmptyDataProps {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
    icon: React.ReactNode;
}

export default function EmptyData({ title, description, buttonLabel, buttonLink, icon }: EmptyDataProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    {icon}
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>
                    {description}
                </EmptyDescription>
                <Button>
                    <Link href={buttonLink}>{buttonLabel}</Link>
                </Button>
            </EmptyHeader>
        </Empty>
    )
}