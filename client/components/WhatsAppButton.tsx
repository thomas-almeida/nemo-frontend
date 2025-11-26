'use client';

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const phoneNumber = '5511949098312';
    const message = 'Olá Thom, preciso de ajuda no Octo!';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const handleClick = () => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            onClick={handleClick}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-1 px-3 py-2 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300 cursor-pointer group w-12 h-12 hover:w-auto hover:px-4 overflow-hidden hover:animate-duration-1000 hover:animate-ease-out"
            aria-label="Fale conosco pelo WhatsApp"
            title="Suporte"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <MessageCircle className="w-6 h-6 transition-all duration-300 group-hover:animate-pulse shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">Suporte</span>
        </div>
    );
}
