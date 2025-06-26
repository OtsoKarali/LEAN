import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NewsTicker from '@/components/NewsTicker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adaptive Beta Portfolio',
  description: 'Real-time portfolio beta management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NewsTicker />
        {children}
      </body>
    </html>
  )
} 