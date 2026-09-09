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

export const metadata: Metadata = {
  title: "UNDIMENSION — Circle Beyond Space & Time",
  description:
    "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.",
  keywords: [
    "UNDIMENSION",
    "circle pertemanan",
    "SMK",
    "neo-brutalism",
    "friend group profile",
    "collective",
  ],
  authors: [{ name: "The Undimension Collective" }],
  creator: "The Undimension Collective",
  publisher: "The Undimension Collective",
  metadataBase: new URL("https://undimension.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/og-image.png",
  },
  openGraph: {
    title: "UNDIMENSION — Circle Beyond Space & Time",
    description:
      "Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.",
    url: "https://undimension.vercel.app",
    siteName: "UNDIMENSION",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "UNDIMENSION — Circle Beyond Space & Time",
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
    images: ["/og-image.png"],
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
  themeColor: "#09090b",
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
