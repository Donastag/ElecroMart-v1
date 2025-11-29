import './globals.css'
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
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      50: '#fff7ed',
                      100: '#ffedd5',
                      500: '#f97316',
                      600: '#ea580c',
                      900: '#7c2d12',
                    },
                    neon: {
                      red: '#ff003c',
                      blue: '#00f3ff',
                      yellow: '#fcee0a',
                    }
                  },
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    display: ['Inter', 'sans-serif'],
                  },
                  animation: {
                    'float': 'float 6s ease-in-out infinite',
                    'float-delayed': 'float 6s ease-in-out 3s infinite',
                    'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    'shimmer': 'shimmer 2.5s linear infinite',
                    'slide-left': 'slide-left 20s linear infinite',
                  },
                  keyframes: {
                    float: {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-20px)' },
                    },
                    shimmer: {
                      '0%': { backgroundPosition: '-1000px 0' },
                      '100%': { backgroundPosition: '1000px 0' },
                    },
                    'slide-left': {
                      '0%': { transform: 'translateX(0)' },
                      '100%': { transform: 'translateX(-50%)' },
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}