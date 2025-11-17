import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ProjectHub Dashboard',
    template: '%s | ProjectHub Dashboard',
  },
  description: 'Modern project management dashboard with authentication, filtering, and full CRUD operations',
  keywords: ['project management', 'dashboard', 'SaaS', 'Next.js', 'Supabase'],
  authors: [{ name: 'ProjectHub Team' }],
  creator: 'ProjectHub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ProjectHub Dashboard',
    description: 'Modern project management dashboard',
    siteName: 'ProjectHub Dashboard',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}

