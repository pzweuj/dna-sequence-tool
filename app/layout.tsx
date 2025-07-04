import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DNA Sequence Tool',
  description: 'Modify Your Seq',
  generator: 'pzweuj',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
