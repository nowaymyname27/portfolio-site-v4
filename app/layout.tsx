import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import "./globals.css";

const THEME_MODE_INIT_SCRIPT = `(() => {
  try {
    const savedTheme = localStorage.getItem("site-theme");
    const savedMode = localStorage.getItem("site-mode");
    const nextTheme =
      savedTheme === "slate" ||
      savedTheme === "charcoal" ||
      savedTheme === "violet" ||
      savedTheme === "crimson"
        ? savedTheme
        : "slate";
    const nextMode = savedMode === "light" || savedMode === "dark" ? savedMode : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.dataset.mode = nextMode;
  } catch {
    document.documentElement.dataset.theme = "slate";
    document.documentElement.dataset.mode = "dark";
  }
})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jose Ramirez | Software Engineer",
  description:
    "Portfolio of Jose Ramirez featuring projects, experience, and certifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_MODE_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="site-top" className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
