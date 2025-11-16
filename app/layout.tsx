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
    default: 'SaaS Mini Dashboard',
    template: '%s | SaaS Mini Dashboard',
  },
  description: 'Modern project management dashboard with authentication, filtering, and full CRUD operations',
  keywords: ['project management', 'dashboard', 'SaaS', 'Next.js', 'Supabase'],
  authors: [{ name: 'SaaS Mini Team' }],
  creator: 'SaaS Mini',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'SaaS Mini Dashboard',
    description: 'Modern project management dashboard',
    siteName: 'SaaS Mini Dashboard',
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

