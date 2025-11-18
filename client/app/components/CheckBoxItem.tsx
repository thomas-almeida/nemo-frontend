import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckBoxItemProps {
    label: string;
    description: string;
    id?: string;
}

export default function CheckBoxItem({ label, description, id }: CheckBoxItemProps) {
    return (
        <>
            <Label htmlFor={id} className="cursor-pointer">
                <div className="flex items-start gap-3 border p-4 rounded shadow w-full">
                    <Checkbox id={id} defaultChecked={false} />
                    <div className="grid gap-2">
                        {label}
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    </div>
                </div>
            </Label>
        </>
    )
}