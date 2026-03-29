"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { t } from '@/lib/translations'
import { wilayasArray } from '@/lib/wilayas'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShoppingCart, Minus, Plus, X, ArrowLeft, ArrowRight, CreditCard, Truck } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { language, cart, updateCartQty, removeFromCart, clearCart, cartTotal, getShippingPrice, addOrder } = useStore()
  const isRTL = language === 'ar'

  const [formData, setFormData] = useState({ name: '', phone: '', state: '', city: '' })
  const [shippingPrice, setShippingPrice] = useState<{ price: number; free: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (formData.state) {
      const result = getShippingPrice(formData.state)
      setShippingPrice(result)
    } else {
      setShippingPrice(null)
    }
  }, [formData.state, getShippingPrice])

  const grandTotal = cartTotal + (shippingPrice?.price || 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    setIsSubmitting(true)

    const orderId = Date.now().toString() + Math.floor(Math.random() * 100)
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      products: cart.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      shipping: shippingPrice?.price || 0,
      total: grandTotal,
      name: formData.name,
      phone: formData.phone,
      state: formData.state,
      city: formData.city,
      status: t(language, 'statusNew'),
    }

    addOrder(order)
    
    // Store in session for success page
    sessionStorage.setItem('lastOrder', JSON.stringify(order))
    clearCart()
    router.push('/order-success')
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-[1020px] mx-auto px-4 md:px-8 py-11 md:py-12">
        <h1 className="font-serif text-3xl text-foreground mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          {t(language, 'shoppingCart')}
        </h1>

        <div className="grid lg:grid-cols-[1fr_340px] gap-7 items-start">
          {/* Cart Items */}
          <div>
            <div className="bg-card border border-gold-border rounded-2xl overflow-hidden">
              {cart.length === 0 ? (
                <div className="text-center py-16 px-5">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3.5" />
                  <p className="text-muted-foreground text-base mb-5">{t(language, 'cartEmpty')}</p>
                  <Link href="/" className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                    {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {t(language, 'browseProductsLink')}
                  </Link>
                </div>
              ) : (
                <div>
                  {cart.map((item, i) => {
                    const price = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0
                    const subtotal = price * item.qty

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 p-5 ${i < cart.length - 1 ? 'border-b border-secondary' : ''}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          className="w-[72px] h-[72px] rounded-lg object-cover border border-gold-border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-bold text-foreground mb-1 truncate">{item.name}</h3>
                          <div className="text-sm text-primary font-bold">{item.price} {t(language, 'currency')}</div>
                          <div className="flex items-center gap-2.5 mt-2">
                            <div className="flex items-center border border-gold-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateCartQty(item.id, item.qty - 1)}
                                className="w-8 h-8 bg-secondary flex items-center justify-center text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                value={item.qty}
                                readOnly
                                className="w-[38px] h-8 bg-muted border-x border-gold-border text-foreground text-sm font-bold text-center"
                              />
                              <button
                                onClick={() => updateCartQty(item.id, item.qty + 1)}
                                className="w-8 h-8 bg-secondary flex items-center justify-center text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-sm text-muted-foreground mr-auto whitespace-nowrap">
                              {subtotal.toLocaleString('ar-DZ')} {t(language, 'currency')}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-muted-foreground/60 rounded-md transition-colors hover:text-destructive hover:bg-destructive/10"
                              title={t(language, 'delete')}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <Link href="/" className="inline-flex items-center gap-2 text-primary text-sm font-semibold mt-4">
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t(language, 'continueShopping')}
            </Link>
          </div>

          {/* Summary + Checkout Form */}
          <div className="bg-card border border-gold-border rounded-2xl p-6 lg:sticky lg:top-[88px]">
            <h2 className="text-base font-bold text-foreground mb-4 pb-3.5 border-b border-secondary">
              {t(language, 'orderSummary')}
            </h2>

            <div className="flex justify-between text-sm text-muted-foreground mb-2.5">
              <span>{t(language, 'itemCount')}</span>
              <span>{cart.reduce((s, i) => s + i.qty, 0)} {t(language, 'piece')}</span>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground mb-2.5">
              <span>{t(language, 'shipping')}</span>
              <span className={shippingPrice?.free ? 'text-green-500 font-bold' : ''}>
                {formData.state
                  ? shippingPrice?.free
                    ? t(language, 'freeShipping')
                    : `${shippingPrice?.price.toLocaleString('ar-DZ')} ${t(language, 'currency')}`
                  : t(language, 'selectState')}
              </span>
            </div>

            <div className="flex justify-between text-sm font-black text-foreground pt-3.5 mt-1.5 border-t border-gold-border">
              <span className="text-muted-foreground">{t(language, 'total')}</span>
              <span className="text-xl text-primary">{cartTotal.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
            </div>

            {shippingPrice && (
              <div className="flex justify-between text-base font-black text-foreground mt-1 pt-2.5 border-t border-gold-border">
                <span className="text-muted-foreground">{t(language, 'totalWithShipping')}</span>
                <span className="text-primary">{grandTotal.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
              </div>
            )}

            <div className="h-px bg-secondary my-4" />

            <form onSubmit={handleCheckout} className="space-y-3.5">
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
                  className="w-full px-3.5 py-3 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
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
                  title="Enter 10 digits"
                  className="w-full px-3.5 py-3 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                    {t(language, 'state')} *
                  </label>
                  <select
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    required
                    className="w-full px-3.5 py-3 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
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
                    className="w-full px-3.5 py-3 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cart.length === 0 || isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black text-base transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(201,168,76,0.3)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 mt-1.5"
              >
                {isSubmitting ? t(language, 'sending') : t(language, 'confirmOrder')}
              </button>
            </form>

            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3.5 py-2.5 mt-3.5 text-xs text-green-500">
              <CreditCard className="w-4 h-4" />
              {t(language, 'codPayment')}
              <span className="mx-1">·</span>
              <Truck className="w-4 h-4" />
              {t(language, 'allAlgeria')}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
