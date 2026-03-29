import type { Metadata } from 'next'
import { Cairo, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'متجر الأناقة | Elegance Store',
  description: 'أرقى المنتجات المختارة بعناية — دفع عند الاستلام مع توصيل سريع لكل ولايات الجزائر',
  keywords: ['متجر', 'تسوق', 'الجزائر', 'أناقة', 'منتجات', 'توصيل'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <StoreProvider>
          {children}
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
