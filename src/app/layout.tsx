import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { PhaseProvider } from '@/providers/PhaseProvider'
import { ToastProvider } from '@/components/ui/toast'
import { AppShell } from '@/components/layout/AppShell'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Harmonia Testing Pool',
  description: 'Three-signal compatibility matching experiment',
  applicationName: 'Harmonia',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Harmonia',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#D4A853',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cormorantGaramond.variable} ${dmSans.variable} font-body antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <PhaseProvider>
              <ToastProvider>
                <AppShell>{children}</AppShell>
              </ToastProvider>
            </PhaseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
