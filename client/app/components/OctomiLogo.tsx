import { Rocket } from "lucide-react"
import Image from "next/image"

export function OctomiLogo() {
  return (
    <div className="group flex items-center gap-2 font-bold text-xl tracking-tight hover:text-primary">
      <div className="transition-transform duration-300 group-hover:rotate-12">
        <Image
          src={"/octopus-logo.png"}
          width={400}
          height={200}
          alt="logo"
          className="w-10 h-auto object-cover"
        />
      </div>
      <span className="italic text-2xl font-semibold">octo.</span>
    </div>
  )
}
