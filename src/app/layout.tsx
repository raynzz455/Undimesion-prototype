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

// Use generateMetadata so VERCEL_URL is available at RUNTIME (not build time).
// Static `metadata` is baked at build time when VERCEL_URL doesn't exist.
export function generateMetadata(): Metadata {
  // VERCEL_URL is auto-set by Vercel at runtime (e.g. "undimension.vercel.app")
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || "https://undimension.vercel.app";

  return {
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
      icon: [
        { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon.png", type: "image/png", sizes: "256x256" },
      ],
      apple: "/icon.png",
    },
    openGraph: {
      title: "UNDIMENSION — Circle Beyond Space & Time",
      description:
        "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.",
      url: siteUrl,
      siteName: "UNDIMENSION",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
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
      images: [`${siteUrl}/og-image.png`],
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
}

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
