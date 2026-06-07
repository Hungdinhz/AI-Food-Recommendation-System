import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  UtensilsCrossed,
  MessageSquare,
  CalendarDays,
  ExternalLink,
  Heart,
} from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriAI – Trợ Lý Dinh Dưỡng AI",
  description:
    "Ứng dụng lập kế hoạch ăn uống thông minh sử dụng AI, giúp bạn xây dựng thực đơn cân bằng dinh dưỡng và phù hợp ngân sách.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-slate-900"
            >
              <UtensilsCrossed className="w-6 h-6 text-primary-600" />
              <span>
                Nutri<span className="text-primary-600">AI</span>
              </span>
            </Link>
            <nav className="flex gap-4 md:gap-6 font-medium items-center text-sm">
              <Link
                href="/"
                className="hover:text-primary-600 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/plan"
                className="flex items-center gap-1 hover:text-primary-600 transition-colors"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Thực đơn</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Chat</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                  <UtensilsCrossed className="w-5 h-5 text-primary-600" />
                  <span>
                    Nutri<span className="text-primary-600">AI</span>
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Trợ lý dinh dưỡng AI giúp bạn lập kế hoạch ăn uống cân bằng,
                  tiết kiệm và khoa học.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Tính năng
                </h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-primary-600 transition-colors"
                    >
                      Gợi ý món ăn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/plan"
                      className="hover:text-primary-600 transition-colors"
                    >
                      Lập thực đơn tuần
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chat"
                      className="hover:text-primary-600 transition-colors"
                    >
                      Tư vấn dinh dưỡng AI
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Công nghệ
                </h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li>Next.js + Tailwind CSS</li>
                  <li>Java Spring Boot + PostgreSQL</li>
                  <li>Redis Cache + REST API</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-400" /> by AI Food
                Team © {new Date().getFullYear()}
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
