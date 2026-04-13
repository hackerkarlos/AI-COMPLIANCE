import type { Metadata } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import { themeInitScript, ThemeScript } from '@/components/theme-provider';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'EUComply — AI-powered EU compliance for Danish SMBs',
    template: '%s · EUComply',
  },
  description:
    'Automated GDPR, Bogforingsloven, NIS2 and EU AI Act compliance assessments for Danish small and medium businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
