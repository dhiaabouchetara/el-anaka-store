"use client"

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { t } from '@/lib/translations'
import { wilayasArray } from '@/lib/wilayas'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShoppingCart, Zap, ArrowRight, ArrowLeft, Truck, CreditCard, Shield, ChevronDown, ChevronUp, Minus, Plus, Play } from 'lucide-react'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { language, products, addToCart, getShippingPrice } = useStore()
  const isRTL = language === 'ar'

  const product = products.find(p => p.id === parseInt(id))

  const [mainMedia, setMainMedia] = useState<{ type: 'image' | 'video'; src: string } | null>(null)
  const [qty, setQty] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', city: '' })
  const [shippingPrice, setShippingPrice] = useState<{ price: number; free: boolean } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (product) {
      setMainMedia({ type: 'image', src: product.main_image })
    }
  }, [product])

  useEffect(() => {
    if (formData.state) {
      const result = getShippingPrice(formData.state)
      setShippingPrice(result)
    } else {
      setShippingPrice(null)
    }
  }, [formData.state, getShippingPrice])

  if (!product) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <p className="text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </main>
    )
  }

  const price = parseInt(String(product.price).replace(/[^0-9]/g, '')) || 0
  const subtotal = price * qty
  const total = subtotal + (shippingPrice?.price || 0)

  // Related products
  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || Math.abs(parseInt(String(p.price).replace(/[^0-9]/g, '')) - price) <= 1500))
    .slice(0, 3)

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.main_image }, qty)
    setToast(t(language, 'addedToCart', { count: qty }))
    setTimeout(() => setToast(null), 3000)
  }

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const orderId = Date.now().toString() + Math.floor(Math.random() * 100)
    const orderData = {
      id: orderId,
      product: product.name,
      price: product.price,
      qty,
      shipping: shippingPrice?.price || 0,
      total,
      ...formData,
    }
    
    // Store in session for success page
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData))
    router.push('/order-success')
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-11 md:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-9 transition-colors hover:text-primary">
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t(language, 'backToStore')}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Media Column */}
          <div className="md:sticky md:top-[85px]">
            <div className="rounded-2xl overflow-hidden border border-gold-border bg-secondary aspect-square mb-3">
              {mainMedia?.type === 'video' ? (
                <iframe
                  src={mainMedia.src.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={imageError ? 'https://placehold.co/600x600/0e0e0e/c9a84c?text=صورة' : (mainMedia?.src || product.main_image)}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 flex-wrap">
              {product.all_images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMainMedia({ type: 'image', src: img })
                    setImageError(false)
                  }}
                  className={`w-[70px] h-[70px] rounded-lg overflow-hidden border transition-all ${
                    mainMedia?.src === img ? 'border-primary' : 'border-muted hover:border-primary'
                  }`}
                >
                  <Image src={img} alt="" width={70} height={70} className="w-full h-full object-cover" />
                </button>
              ))}
              {product.video && (
                <button
                  onClick={() => setMainMedia({ type: 'video', src: product.video! })}
                  className="w-[70px] h-[70px] rounded-lg bg-gold-glow border border-gold-border flex items-center justify-center text-xl transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <Play className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Order Column */}
          <div className="bg-card border border-gold-border rounded-2xl p-8">
            {product.category && (
              <span className="inline-block bg-gold-glow border border-gold-border text-primary text-[11px] font-bold px-3.5 py-1 rounded-full mb-3">
                {product.category}
              </span>
            )}

            <h1 className="font-serif text-3xl font-bold text-foreground mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-1.5 text-3xl font-black text-primary mb-1">
              {price.toLocaleString('ar-DZ')}
              <span className="text-lg text-gold-dark">{t(language, 'currency')}</span>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold px-3.5 py-1.5 rounded-full mt-2">
                {t(language, 'onlyLeft', { count: product.stock })}
              </div>
            )}

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{product.description}</p>
            )}

            <div className="h-px bg-gold-border my-5" />

            {/* Quantity */}
            <span className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2.5">
              {t(language, 'quantity')}
            </span>
            <div className="flex items-center border border-gold-border rounded-lg overflow-hidden w-fit mb-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-11 h-11 bg-secondary flex items-center justify-center text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={qty}
                readOnly
                className="w-[60px] h-11 bg-muted border-x border-gold-border text-foreground text-base font-bold text-center"
              />
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-11 h-11 bg-secondary flex items-center justify-center text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price Breakdown */}
            {(qty > 1 || shippingPrice) && (
              <div className="bg-secondary border border-gold-border rounded-xl p-4 mb-3">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{t(language, 'unitPrice')}</span>
                  <span className="text-foreground font-bold">{price.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
                </div>
                {qty > 1 && (
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{t(language, 'subtotal')}</span>
                    <span className="text-foreground font-bold">{subtotal.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
                  </div>
                )}
                {shippingPrice && (
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{t(language, 'shipping')}</span>
                    <span className={`font-bold ${shippingPrice.free ? 'text-green-500' : 'text-foreground'}`}>
                      {shippingPrice.free ? t(language, 'freeShipping') : `${shippingPrice.price.toLocaleString('ar-DZ')} ${t(language, 'currency')}`}
                    </span>
                  </div>
                )}
                <div className="h-px bg-gold-border my-2" />
                <div className="flex justify-between text-base font-black">
                  <span className="text-muted-foreground">{t(language, 'total')}</span>
                  <span className="text-primary text-xl">{total.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 bg-gold-glow border border-gold-border text-primary rounded-xl font-bold text-[15px] transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <ShoppingCart className="w-5 h-5" />
                {t(language, 'addToCartFull')}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-black text-[15px] transition-all hover:bg-gold-light hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5" />
                {t(language, 'orderNowFull')}
              </button>
            </div>

            {/* Order Form Toggle */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-between w-full py-3.5 px-4 bg-secondary rounded-lg border border-muted transition-all hover:border-gold-border"
            >
              <span className="text-sm font-bold">{t(language, 'directOrderDetails')}</span>
              {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Order Form */}
            {showForm && (
              <form onSubmit={handleOrder} className="pt-4 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                    {t(language, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t(language, 'fullNamePlaceholder')}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                    {t(language, 'phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                      {t(language, 'state')} *
                    </label>
                    <select
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                    >
                      <option value="">{t(language, 'selectOption')}</option>
                      {wilayasArray.map(w => (
                        <option key={w.code} value={w.name}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                      {t(language, 'municipality')} *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder={t(language, 'municipality')}
                      required
                      className="w-full px-4 py-3 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-lg transition-all hover:bg-gold-light hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {t(language, 'confirmOrderNow')}
                </button>
              </form>
            )}

            {/* Trust Row */}
            <div className="flex gap-4 mt-4 justify-center flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="w-4 h-4" />
                {t(language, 'fastDelivery')}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                {t(language, 'codPayment')}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                {t(language, 'safeData')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 pb-20">
          <div className="font-serif text-2xl font-bold text-foreground mb-1.5">✦ {t(language, 'youMayAlsoLike')}</div>
          <div className="text-sm text-muted-foreground mb-7">{t(language, 'similarProducts')}</div>

          <div className="grid md:grid-cols-3 gap-5">
            {related.map(rp => (
              <Link
                key={rp.id}
                href={`/product/${rp.id}`}
                className="group block bg-card border border-gold-border rounded-2xl overflow-hidden transition-all hover:border-primary hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="h-[200px] overflow-hidden">
                  <Image
                    src={rp.main_image}
                    alt={rp.name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[15px] font-bold text-foreground mb-1.5">{rp.name}</div>
                  <div className="text-lg font-black text-primary">{rp.price} {t(language, 'currency')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />

      {/* Toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-primary rounded-xl px-6 py-3.5 text-foreground text-sm font-semibold z-50 transition-all duration-400 whitespace-nowrap ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        {toast}
      </div>
    </main>
  )
}
