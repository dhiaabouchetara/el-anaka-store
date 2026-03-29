"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { t } from '@/lib/translations'
import { Crown, Home, ShoppingCart, CheckCircle } from 'lucide-react'

interface OrderData {
  id: string
  product?: string
  products?: { name: string; price: string; qty: number }[]
  price?: string
  qty?: number
  shipping: number
  total: number
  name: string
  phone: string
  state: string
  city: string
}

export default function OrderSuccessPage() {
  const { language } = useStore()
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder')
    if (stored) {
      setOrder(JSON.parse(stored))
      sessionStorage.removeItem('lastOrder')
    }
  }, [])

  const price = order?.price ? parseInt(String(order.price).replace(/[^0-9]/g, '')) : 0
  const subtotal = price * (order?.qty || 1)

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-5 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="bg-card border border-gold-border rounded-2xl p-12 max-w-[500px] w-full text-center shadow-[0_0_60px_rgba(201,168,76,0.1)] animate-[pop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both] relative">
        {/* Icon */}
        <div className="w-[78px] h-[78px] bg-gold-glow border-2 border-gold-border rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          <Crown className="w-8 h-8 text-primary" />
        </div>

        <h1 className="font-serif text-2xl text-foreground mb-3.5">{t(language, 'orderReceived')}</h1>
        
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
          {t(language, 'thankYou')} <strong className="text-primary">{order?.name || '...'}</strong> {t(language, 'onYourTrust')}
          <br />
          {t(language, 'teamWillContact')}{' '}
          <strong className="text-lg tracking-wider">{order?.phone || '...'}</strong>{' '}
          {t(language, 'toConfirmShipping')}
        </p>

        {/* Order Summary */}
        <div className="bg-secondary border border-gold-border rounded-xl p-5 mb-7 text-right">
          {order?.product ? (
            // Single product order
            <>
              <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
                <span>{t(language, 'product')}</span>
                <span className="font-bold text-primary">{order.product}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
                <span>{t(language, 'quantity')}</span>
                <span className="font-bold text-foreground">{order.qty}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
                <span>{t(language, 'unitPrice')}</span>
                <span className="font-bold text-foreground">{price.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
              </div>
              {order.qty && order.qty > 1 && (
                <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
                  <span>{t(language, 'subtotal')}</span>
                  <span className="font-bold text-foreground">{subtotal.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
                </div>
              )}
            </>
          ) : order?.products ? (
            // Cart order
            <>
              {order.products.map((p, i) => (
                <div key={i} className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
                  <span>{p.name} x{p.qty}</span>
                  <span className="font-bold text-foreground">{p.price} {t(language, 'currency')}</span>
                </div>
              ))}
            </>
          ) : null}

          {order?.shipping !== undefined && (
            <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
              <span>{t(language, 'shipping')}</span>
              <span className={`font-bold ${order.shipping === 0 ? 'text-green-500' : 'text-foreground'}`}>
                {order.shipping === 0 ? t(language, 'freeShipping') : `${order.shipping.toLocaleString('ar-DZ')} ${t(language, 'currency')}`}
              </span>
            </div>
          )}

          <div className="flex justify-between text-[15px] font-black border-t border-gold-border/30 mt-1 pt-2.5">
            <span className="text-foreground">{t(language, 'total')}</span>
            <span className="text-primary text-lg">{order?.total?.toLocaleString('ar-DZ')} {t(language, 'currency')}</span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground py-1.5 border-b border-foreground/5">
            <span>{t(language, 'location')}</span>
            <span className="font-bold text-foreground">{order?.state} / {order?.city}</span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground py-1.5">
            <span>{t(language, 'paymentMethod')}</span>
            <span className="font-bold text-green-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t(language, 'onDelivery')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-9 py-3.5 bg-primary text-primary-foreground rounded-full font-black transition-all hover:bg-gold-light hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            {t(language, 'backToStoreBtn')}
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-9 py-3.5 bg-transparent border border-gold-border text-primary rounded-full font-black transition-all hover:bg-gold-glow"
          >
            <ShoppingCart className="w-4 h-4" />
            {t(language, 'cart')}
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pop {
          from {
            opacity: 0;
            transform: scale(0.82);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  )
}
