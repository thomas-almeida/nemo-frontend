'use client';

import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/SideBar";
import { Provider } from "./components/Provider";
import MessageBanner from "./components/MessageBanner";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isRoot = pathname === '/';

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
      <body className="antialiased flex justify-start">
        <Provider>
          <SideBar />
          <div className={`${!isRoot ? 'pl-45' : ''} flex flex-col justify-start items-start w-full h-screen`}>
            {
              !isRoot && (
                <MessageBanner />
              )
            }
            <div className="w-full h-full overflow-y-auto flex justify-center items-start">
              <div className="">
                {children}
              </div>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
