import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <Providers>
            <Navbar />
            {children}
            <Toaster />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
