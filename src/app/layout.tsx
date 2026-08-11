import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Playfair_Display, Montserrat, Cinzel } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Aroma Fine Dine Restaurant & Banquet Hall | Premium Dining",
  description: "Experience the Legacy of Authentic Dining in Hanamkonda. Jaw-dropping ambience and the finest flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${cinzel.variable}`}>
        <body className="bg-[#0F0A06] text-white min-h-screen overflow-x-hidden flex flex-col selection:bg-[#DFB15B] selection:text-[#0F0A06]">
          <SmoothScrollProvider>
            <div className="relative z-10 w-full flex flex-col min-h-screen">
              {children}
            </div>
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
