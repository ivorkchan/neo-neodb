import type { Metadata } from 'next'

// import { Noto_Serif, Noto_Serif_SC } from 'next/font/google'
import { Provider } from '@/components/provider'

import '@/styles/global.css'

// const font_serif = Noto_Serif({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-serif',
// })

// const font_serif_cn = Noto_Serif_SC({
//   display: 'swap',
//   preload: false,
//   weight: ['500', '700'],
//   variable: '--font-serif-cn',
// })

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
  width: 'device-width',
}

export const metadata: Metadata = {
  title: 'NeoDB - Ivork',
  description: 'My digital garden.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={`!font-serif antialiased ${font_serif.variable} ${font_serif_cn.variable}`}
        className="font-serif antialiased"
      >
        <Provider>
          {children}
          <div className="mybg fixed inset-0 w-dvw h-dvw -z-10" />
        </Provider>
      </body>
    </html>
  )
}
