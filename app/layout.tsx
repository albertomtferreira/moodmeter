// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";



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
  applicationName: 'MoodMeter',
  appleWebApp: {
    capable: true,
    title: 'MoodMeter',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#4CAF50',
}

// Loading component for the main content
function MainLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoadingOverlay />
    </div>
  );
}

// Loading component for the navbar
function NavbarLoadingFallback() {
  return (
    <div className="h-20 bg-background border-b animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="w-10 h-10 bg-gray-200 rounded" />
        <div className="w-32 h-10 bg-gray-200 rounded" />
        <div className="w-10 h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
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
            <div className="relative flex min-h-screen flex-col">
              <Suspense fallback={<NavbarLoadingFallback />}>
                <Navbar />
              </Suspense>

              <main className="flex-1">
                <Suspense fallback={<MainLoadingFallback />}>
                  {children}
                </Suspense>
              </main>

              <Toaster />

              {/* LoadingOverlay will be shown when global loading state is true */}
              <LoadingOverlay />
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}