import type { Metadata } from 'next';
import { themeInitScript, ThemeScript } from '@/components/theme-provider';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
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
