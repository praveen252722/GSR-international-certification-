import type { Metadata } from "next";
import { Cinzel, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-official", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: "GSR INTERNATIONAL CERTIFICATIONS",
  description: "Global Standards | Integrity | Assurance",
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${cinzel.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
