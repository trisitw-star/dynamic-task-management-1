import React from "react"
import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'

import './globals.css'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'ระบบจัดการกะทำงาน',
  description: 'ระบบบริหารจัดการกะทำงานของช่าง',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansThai.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
