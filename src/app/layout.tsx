import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food & Meal Planner AI",
  description: "AI-powered food and meal planning app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <UtensilsCrossed className="w-6 h-6 text-primary-600" />
              <span>Nutri<span className="text-primary-600">AI</span></span>
            </Link>
            <nav className="flex gap-6 font-medium">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <Link href="/plan" className="hover:text-primary-600 transition-colors">My Plan</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        
        <ChatWidget />
      </body>
    </html>
  );
}
