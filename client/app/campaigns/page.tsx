import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "@/components/ui/empty"

import { MessageCircleDashed } from "lucide-react";

export default function Campaign() {
    return (
        <div className="flex justify-center items-start h-screen w-full py-4">
            <div className="w-[80%] p-4">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MessageCircleDashed color="gray" />
                        </EmptyMedia>
                        <EmptyTitle>Campanhas</EmptyTitle>
                        <EmptyDescription>
                            Nenhuma campanha cadastrada
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        </div>
    );
}