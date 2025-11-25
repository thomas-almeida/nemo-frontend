'use client';

import { usePathname } from "next/navigation";
import Script from "next/script";
import "./globals.css";
import SideBar from "./components/SideBar";
import { Provider } from "./components/Provider";
import MessageBanner from "./components/MessageBanner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = pathname === '/';

  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href="https://octo.com.br" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="BR-SP" />
        <meta name="google-site-verification" content="zgHS_ojEvtjtz-1XuWQ1KYbpGK7bHuziF_7Xl2et_E8" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/tw-animate/1.0.1/tw-animate.min.css"
          as="style"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/tw-animate/1.0.1/tw-animate.min.css"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </noscript>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Octo",
              "url": "https://octo.com.br",
              "logo": "https://octo.com.br/logo.png",
              "sameAs": [
                "https://www.instagram.com/octo",
                "https://www.linkedin.com/company/octo"
              ]
            })
          }}
        />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ubuu4vu0w6");
          `}
        </Script>
      </head>
      <body className="antialiased flex justify-start">
        <Provider>
          <SideBar />
          <div className={`${!isRoot ? 'pl-45' : ''} flex flex-col justify-start items-start w-full h-screen`}>
            {!isRoot && <MessageBanner />}
            <div className="w-full h-full overflow-y-auto flex justify-center items-start">
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
