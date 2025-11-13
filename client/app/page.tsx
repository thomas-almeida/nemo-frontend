import { FishSymbol } from "lucide-react";
import GoogleButton from "./components/GoogleButton";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-full py-4">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex items-center gap-1 text-green-600">
         <div className="rounded border p-1 border-green-600 shadow">
           <FishSymbol className="h-5 w-5 -rotate-90" />
         </div>
          <h1 className="text-4xl font-semibold">Nemo</h1>
        </div>
        <p className="text-sm text-slate-700 italic py-1">Venda melhor, mais rápido e <b>MUITO</b> mais barato!</p>
        <GoogleButton />
      </div>
    </div>
  );
}