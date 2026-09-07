import type { Metadata } from "next";
import { Bebas_Neue, Outfit, Space_Mono, Cinzel, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/undimension/theme-provider";

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
  ],
  authors: [{ name: "The Undimension Collective" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "UNDIMENSION — Circle Beyond Space & Time",
    description:
      "Sebuah circle teman lama yang tak terikat ruang maupun waktu.",
    type: "website",
  },
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
