// app/(landing)/layout.tsx
import { Metadata } from 'next';
import NavBar from './_components/NavBar';

export const metadata: Metadata = {
  title: 'MoodMeter - Transform Feedback into Action',
  description: 'Gather anonymous feedback, track mood trends, and improve experiences with real-time insights.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}