// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LoadingOverlay } from "@/components/LoadingOverlay";
import type { Viewport } from 'next'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4CAF50'
}

export const metadata: Metadata = {
  title: 'MoodMeter - Instant Mood Tracking and Feedback Analysis',
  description: 'MoodMeter helps organizations gather anonymous feedback to track mood trends and improve experiences. Boost satisfaction and engagement with real-time insights.',
  keywords: 'mood tracking, employee feedback, customer satisfaction, anonymous feedback, experience improvement, engagement analytics',
  authors: [{ name: 'Mood Meter' }],
  openGraph: {
    title: 'MoodMeter - Enhance Experiences with Real-time Mood Insights',
    description: 'Empower your audience to share their experiences anonymously. Use real-time feedback to create better environments and boost satisfaction.',
    url: 'https://www.moodmeter.co.uk/',
    siteName: 'MoodMeter',
    images: [
      {
        url: 'https://www.moodmeter.co.uk/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodMeter - Transform Feedback into Action',
    description: 'Instant mood tracking and analysis tool. Understand and enhance experiences in real-time with MoodMeter.',
    images: ['https://www.moodmeter.co.uk/twitter-image.jpg'],
  },
  icons: {
    icon: '/assets/icons/Logo.png',
    apple: '/assets/icons/Logo.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MoodMeter',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}
      >
        <ClerkProvider>
          <Providers>
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <LoadingOverlay />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}