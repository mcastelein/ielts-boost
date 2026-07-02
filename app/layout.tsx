import type { Metadata } from "next";
import { Sora, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/conditional-shell";
import { LanguageProvider } from "@/lib/language-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsBeacon from "@/components/analytics-beacon";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "IELTSBoost - AI-Powered IELTS Preparation",
  description:
    "Get instant AI feedback on your IELTS writing and speaking. Bilingual support in English and Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <LanguageProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
