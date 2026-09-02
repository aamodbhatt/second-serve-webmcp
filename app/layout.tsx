import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://second-serve-rescue.therealaamod.chatgpt.site'),
  icons: { icon: '/favicon.svg' },
  openGraph: {title: 'Second Serve — Every meal has a next stop', description: 'People + agents. Less food waste.', images: ['/og.png']},
  twitter: {card: 'summary_large_image', title: 'Second Serve', description: 'Every meal has a next stop.', images: ['/og.png']},
  title: 'Second Serve — Every meal has a next stop',
  description: 'A shared food-rescue workspace for people and their agents. Match surplus meals, protect commitments, and adapt together with WebMCP.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
