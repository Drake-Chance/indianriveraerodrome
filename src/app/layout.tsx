import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IRAPOA — Indian River Aerodrome Property Owners Association",
  description:
    "The official website for the Indian River Aerodrome Property Owners Association (IRAPOA). FL74 — Private fly-in community in Vero Beach, Florida.",
  keywords: ["IRAPOA", "Indian River Aerodrome", "FL74", "Vero Beach", "fly-in community", "aviation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-gray-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
