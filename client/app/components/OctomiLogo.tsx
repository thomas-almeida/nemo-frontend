import { Rocket } from "lucide-react"

export function OctomiLogo() {
  return (
    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Rocket className="w-5 h-5 fill-current" />
      </div>
      <span>OCTOMI</span>
    </div>
  )
}
