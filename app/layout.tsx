import type { Metadata } from 'next'

import { Cormorant } from 'next/font/google'
import { Provider } from '@/components/provider'

import '@/public/fonts/HYFangSongS/result.css'
import '@/styles/global.css'

const font_serif = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
  width: 'device-width',
}

export const metadata: Metadata = {
  title: 'basket',
  description: 'sometimes i read.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`!font-serif ${font_serif.variable}`}
      >
        <Provider>
          {children}
          <div className="mybg fixed inset-0 w-dvw h-dvw -z-10" />
        </Provider>
      </body>
    </html>
  )
}
