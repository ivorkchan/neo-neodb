import type { Metadata } from 'next'

import { Provider } from '@/components/provider'

import '@/styles/global.css'

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
      <body className="font-sans antialiased">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
