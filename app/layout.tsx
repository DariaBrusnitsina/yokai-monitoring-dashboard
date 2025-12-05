import type { Metadata } from 'next'
import { Providers } from '@/app/providers'
import '@/app/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Yokai Monitoring Dashboard',
  description: 'Real-time monitoring dashboard for spiritual anomalies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

