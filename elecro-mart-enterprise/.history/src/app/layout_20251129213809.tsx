// import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elecro.Mart - Online Shopping in Kenya',
  description: 'Kenya\'s premier electronics and technology store with AI-powered recommendations and competitive prices.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ 
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  )
}