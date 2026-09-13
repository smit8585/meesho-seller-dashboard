import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  );
}

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
        <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-1">
            <Link href="/" className="font-bold text-base mr-6 flex items-center gap-2">
              <span>📦</span>
              <span>YourPick Tracker</span>
            </Link>
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/orders">Orders</NavLink>
            <NavLink href="/upload">Upload</NavLink>
          </nav>
        </header>
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t bg-white py-3 text-center text-xs text-gray-400">
          YourPick Seller Tracker · Your business, your visibility
        </footer>
      </body>
    </html>
  );
}
