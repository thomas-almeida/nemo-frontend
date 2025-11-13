import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/SideBar";

export const metadata: Metadata = {
  title: "Nemo",
  description: "Venda melhor, mais rápido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tw-animate/1.0.1/tw-animate.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased flex h-screen justify-start">
        <SideBar />
        {children}
      </body>
    </html>
  );
}
