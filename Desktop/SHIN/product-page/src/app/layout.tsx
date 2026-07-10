import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHIN — Experience Engine for AI Agents",
  description:
    "AI agents have knowledge but no experience. SHIN gives them the latter. A persistent engineering judgment layer for AI coding agents.",
  openGraph: {
    title: "SHIN — Experience Engine for AI Agents",
    description:
      "AI agents have knowledge but no experience. SHIN gives them the latter.",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ colorScheme: "light" }}
    >
      <head />
      <body className="min-h-screen flex flex-col bg-pink-100 text-zinc-800 font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
