import type { Metadata } from "next";
import {
  Dancing_Script,
  Playfair_Display,
  Source_Sans_3,
} from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/lib/cart/CartProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SteKir Cakes | Homemade Custom Cakes in Sacramento",
    template: "%s | SteKir Cakes",
  },
  description:
    "Eastern European-style custom cakes made to order in Sacramento. Napoleon, Medovik, Smetannik & Mannik — delivered to Folsom, Roseville, El Dorado Hills & beyond.",
  openGraph: {
    title: "SteKir Cakes | Homemade Custom Cakes in Sacramento",
    description:
      "Classic Eastern European cakes, baked fresh to order and delivered across the Sacramento area.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body">
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
