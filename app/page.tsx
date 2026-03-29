"use client"

import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { ProductsSection } from '@/components/products-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ProductsSection />
      <Footer />
    </main>
  )
}
