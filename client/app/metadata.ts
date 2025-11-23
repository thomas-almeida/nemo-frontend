import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Octo - Feito de corretor para corretor',
    template: '%s | Octo',
  },
  description: 'Organize seus imóveis, automatize o WhatsApp e economize 40% do seu tempo. A ferramenta essencial para corretores imobiliários.',
  keywords: ['corretor imobiliário', 'automação de WhatsApp', 'organização de imóveis', 'ferramenta para corretores', 'gestão de leads'],
  authors: [{ name: 'Octo' }],
  creator: 'Octo',
  publisher: 'Octo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://octo.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Octo - Ferramenta Essencial para Corretores Imobiliários',
    description: 'Organize seus imóveis, automatize o WhatsApp e economize 40% do seu tempo.',
    url: 'https://octo.com.br',
    siteName: 'Octo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Octo - Ferramenta para Corretores',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Octo - Ferramenta Essencial para Corretores Imobiliários',
    description: 'Organize seus imóveis, automatize o WhatsApp e economize 40% do seu tempo.',
    images: ['/twitter-image.png'],
    creator: '@octo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
