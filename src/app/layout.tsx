import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Seller Order Tracker",
  description: "Track your Meesho orders from dispatch to payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <span className="font-bold text-lg">📦 Seller Order Tracker</span>
            <Link href="/" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Link href="/orders" className="text-sm hover:underline">
              Orders
            </Link>
            <Link href="/upload" className="text-sm hover:underline">
              Upload
            </Link>
          </nav>
        </header>
        <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">{children}</main>
      </body>
    </html>
  );
}
