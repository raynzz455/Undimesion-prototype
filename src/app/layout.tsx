import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit, Space_Mono, Cinzel, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/undimension/theme-provider";
import { ChaosProvider } from "@/components/undimension/chaos-provider";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono-ud",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// For OG image, we need a URL available at BUILD time (static page generation).
// VERCEL_URL is runtime-only, so prioritize NEXT_PUBLIC_SITE_URL (build-time).
// Set NEXT_PUBLIC_SITE_URL in Vercel dashboard to your deployment URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  || "https://undimension.vercel.app";

// Absolute OG image URL — social scrapers need this to be a full https:// URL.
const ogImageUrl = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  title: "UNDIMENSION — Circle Beyond Space & Time",
  description:
    "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.",
  keywords: [
    "UNDIMENSION",
    "circle pertemanan",
    "SMK",
    "collective",
    "friend group profile",
    "seven stars",
    "one orbit",
  ],
  authors: [{ name: "The Undimension Collective" }],
  creator: "The Undimension Collective",
  publisher: "The Undimension Collective",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
    apple: ogImageUrl,
  },
  openGraph: {
    title: "UNDIMENSION — Circle Beyond Space & Time",
    description:
      "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.",
    url: siteUrl,
    siteName: "UNDIMENSION",
    images: [
      {
        url: ogImageUrl,
        width: 1344,
        height: 768,
        alt: "UNDIMENSION — Circle Beyond Space & Time",
        type: "image/png",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNDIMENSION — Circle Beyond Space & Time",
    description:
      "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Est. 2020.",
    images: [ogImageUrl],
    creator: "@undimension",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${bebas.variable} ${outfit.variable} ${spaceMono.variable} ${cinzel.variable} ${chakra.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ChaosProvider>
            {children}
            <Toaster />
          </ChaosProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
