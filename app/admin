"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useStore, type Product } from '@/lib/store'
import { t } from '@/lib/translations'
import { wilayasArray } from '@/lib/wilayas'
import {
  BarChart3,
  Tags,
  PlusCircle,
  Package,
  Truck,
  Phone,
  ClipboardList,
  Archive,
  LogOut,
  Home,
  Trash2,
  Edit,
  Search,
  X,
  RotateCcw,
  Globe,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Language } from '@/lib/translations'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export default function AdminPage() {
  const {
    language, setLanguage,
    products, setProducts,
    categories, setCategories,
    orders, setOrders, updateOrderStatus,
    archive, archiveOrder, restoreOrder, deleteArchive, setArchive,
    shipping, setShipping,
    contact, setContact,
  } = useStore()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })

  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', price: '', video: '', description: '', category: '', stock: 99, imageUrl: ''
  })

  const [newCategory, setNewCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const currentLang = languages.find(l => l.code === language) || languages[0]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError(t(language, 'wrongCredentials'))
    }
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct: Product = {
      id: editProduct?.id ?? Date.now(),
      name: productForm.name,
      price: productForm.price,
      video: productForm.video,
      description: productForm.description,
      category: productForm.category,
      stock: productForm.stock,
      all_images: productForm.imageUrl ? [productForm.imageUrl] : editProduct?.all_images || [],
      main_image: productForm.imageUrl || editProduct?.main_image || 'https://placehold.co/600x400/0e0e0e/c9a84c?text=صورة',
    }

    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? newProduct : p))
    } else {
      setProducts([...products, newProduct])
    }

    setEditProduct(null)
    setProductForm({ name: '', price: '', video: '', description: '', category: '', stock: 99, imageUrl: '' })
  }

  const handleEditProduct = (product: Product) => {
    setEditProduct(product)
    setProductForm({
      name: product.name,
      price: product.price,
      video: product.video || '',
      description: product.description || '',
      category: product.category || '',
      stock: product.stock,
      imageUrl: product.main_image,
    })
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm(t(language, 'delete') + '?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory('')
    }
  }

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat))
  }

  const filteredOrders = searchQuery
    ? orders.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.phone.includes(searchQuery) ||
        o.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.product?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders

  const statusOptions = [
    { value: t(language, 'statusNew'), color: '#c9a84c' },
    { value: t(language, 'statusDelivering'), color: '#3498db' },
    { value: t(language, 'statusDelivered'), color: '#2ecc71' },
    { value: t(language, 'statusCancelled'), color: '#e74c3c' },
  ]

  // Login Screen
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-5 relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="bg-card border border-gold-border rounded-2xl p-12 w-[380px] text-center">
          <Link href="/" className="inline-block text-muted-foreground/60 text-sm mb-7 hover:text-primary transition-colors">
            ← {t(language, 'backToStore')}
          </Link>

          <div className="font-serif text-2xl text-primary mb-2">✦ {t(language, 'storeName')}</div>
          <p className="text-sm text-muted-foreground/60 mb-8">{t(language, 'adminPanel')}</p>

          {/* Language Switcher */}
          <div className="mb-6 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-border bg-transparent text-muted-foreground hover:text-primary hover:bg-gold-glow transition-all text-sm font-semibold">
                <Globe className="w-4 h-4" />
                {currentLang.flag} {currentLang.label}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-card border-gold-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'text-primary bg-gold-glow' : 'text-foreground hover:text-primary hover:bg-gold-glow'}`}
                  >
                    {lang.flag} {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <form onSubmit={handleLogin}>
            <div className="text-right mb-4">
              <label className="block text-[11px] font-bold text-muted-foreground/60 tracking-widest uppercase mb-2">
                {t(language, 'username')}
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <div className="text-right mb-4">
              <label className="block text-[11px] font-bold text-muted-foreground/60 tracking-widest uppercase mb-2">
                {t(language, 'password')}
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-secondary border border-muted rounded-lg text-foreground text-[15px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-black text-base transition-all hover:bg-gold-light"
            >
              {t(language, 'login')}
            </button>
          </form>

          {loginError && (
            <p className="mt-3 text-destructive text-sm bg-destructive/10 border border-destructive/30 p-2.5 rounded-lg">
              {loginError}
            </p>
          )}

          <p className="mt-4 text-xs text-muted-foreground/40">
            Demo: admin / admin123
          </p>
        </div>
      </main>
    )
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-[230px] bg-card border-l border-gold-border flex flex-col z-50 max-md:hidden">
        <div className="p-6 border-b border-gold-border">
          <div className="font-serif text-lg text-primary">✦ {t(language, 'storeName')}</div>
          <div className="text-xs text-muted-foreground/60 mt-1">{t(language, 'adminPanel')}</div>
        </div>

        <nav className="flex-1 py-3.5 overflow-y-auto">
          <a href="#stats" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <BarChart3 className="w-4 h-4" />
            {t(language, 'statistics')}
          </a>
          <a href="#categories" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <Tags className="w-4 h-4" />
            {t(language, 'categories')}
          </a>
          <a href="#add-product" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <PlusCircle className="w-4 h-4" />
            {t(language, 'addProduct')}
          </a>
          <a href="#products" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <Package className="w-4 h-4" />
            {t(language, 'productsList')}
          </a>
          <a href="#shipping" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <Truck className="w-4 h-4" />
            {t(language, 'shippingSettings')}
          </a>
          <a href="#contact" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <Phone className="w-4 h-4" />
            {t(language, 'contactSettings')}
          </a>
          <a href="#orders" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <ClipboardList className="w-4 h-4" />
            {t(language, 'orders')}
          </a>
          <a href="#archive" className="flex items-center gap-2.5 px-5 py-2.5 text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground hover:bg-gold-glow border-r-[3px] border-transparent hover:border-primary">
            <Archive className="w-4 h-4" />
            {t(language, 'archive')}
          </a>
        </nav>

        <div className="p-3.5 border-t border-gold-border space-y-1">
          {/* Language Switcher in Sidebar */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 w-full px-3 py-2 text-muted-foreground/60 text-sm transition-colors hover:text-primary">
              <Globe className="w-4 h-4" />
              {currentLang.flag} {currentLang.label}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-gold-border">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer ${language === lang.code ? 'text-primary bg-gold-glow' : 'text-foreground hover:text-primary hover:bg-gold-glow'}`}
                >
                  {lang.flag} {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-muted-foreground/60 text-sm transition-colors hover:text-primary">
            <Home className="w-4 h-4" />
            {t(language, 'backToStore')}
          </Link>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 w-full px-3 py-2 text-muted-foreground/60 text-sm transition-colors hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            {t(language, 'logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:mr-[230px] p-4 md:p-8">
        {/* Stats */}
        <div id="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <div className="bg-card border border-gold-border rounded-xl p-4 flex items-center gap-3.5 transition-colors hover:border-primary">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-black text-primary leading-none">{products.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t(language, 'activeProducts')}</div>
            </div>
          </div>
          <div className="bg-card border border-gold-border rounded-xl p-4 flex items-center gap-3.5 transition-colors hover:border-primary">
            <ClipboardList className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-black text-primary leading-none">{orders.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t(language, 'newOrders')}</div>
            </div>
          </div>
          <div className="bg-card border border-gold-border rounded-xl p-4 flex items-center gap-3.5 transition-colors hover:border-primary">
            <Archive className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-black text-primary leading-none">{archive.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t(language, 'archived')}</div>
            </div>
          </div>
          <div className="bg-card border border-gold-border rounded-xl p-4 flex items-center gap-3.5 transition-colors hover:border-primary">
            <Tags className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-black text-primary leading-none">{categories.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t(language, 'category')}</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <section id="categories" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <Tags className="w-4 h-4" />
              {t(language, 'manageCategories')}
            </h3>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1.5 bg-gold-glow border border-gold-border text-primary text-sm font-bold px-3.5 py-1.5 rounded-full">
                  {cat}
                  <button onClick={() => handleDeleteCategory(cat)} className="text-destructive hover:text-destructive/80 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handleAddCategory} className="flex gap-2.5 items-center flex-wrap">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder={t(language, 'newCategoryName')}
              className="flex-1 min-w-[200px] px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-black text-sm transition-all hover:bg-gold-light flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {t(language, 'addCategory')}
            </button>
          </form>
        </section>

        {/* Add/Edit Product */}
        <section id="add-product" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              {editProduct ? <Edit className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {editProduct ? `${t(language, 'editProduct')}: ${editProduct.name}` : t(language, 'addNewProduct')}
            </h3>
            {editProduct && (
              <button
                onClick={() => {
                  setEditProduct(null)
                  setProductForm({ name: '', price: '', video: '', description: '', category: '', stock: 99, imageUrl: '' })
                }}
                className="px-4 py-2 border border-gold-border text-primary rounded-lg font-bold text-sm transition-all hover:bg-gold-glow flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                {t(language, 'cancel')}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })}
              placeholder={t(language, 'productName')}
              required
              className="px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <input
              type="text"
              value={productForm.price}
              onChange={e => setProductForm({ ...productForm, price: e.target.value })}
              placeholder={t(language, 'price')}
              required
              className="px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <select
              value={productForm.category}
              onChange={e => setProductForm({ ...productForm, category: e.target.value })}
              className="px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            >
              <option value="">{t(language, 'category')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              value={productForm.stock}
              onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
              placeholder={t(language, 'stock')}
              className="px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <input
              type="url"
              value={productForm.imageUrl}
              onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
              placeholder={`${t(language, 'images')} (URL)`}
              className="md:col-span-2 px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <input
              type="url"
              value={productForm.video}
              onChange={e => setProductForm({ ...productForm, video: e.target.value })}
              placeholder={t(language, 'videoUrl')}
              className="md:col-span-2 px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
            />
            <textarea
              value={productForm.description}
              onChange={e => setProductForm({ ...productForm, description: e.target.value })}
              placeholder={t(language, 'description')}
              rows={3}
              className="md:col-span-2 px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow resize-y"
            />
            <button
              type="submit"
              className="md:col-span-2 py-3 bg-primary text-primary-foreground rounded-lg font-black text-sm transition-all hover:bg-gold-light flex items-center justify-center gap-2"
            >
              {t(language, 'save')}
            </button>
          </form>
        </section>

        {/* Products List */}
        <section id="products" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t(language, 'productsList')}
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60">
              <Package className="w-10 h-10 mx-auto mb-2.5 opacity-25" />
              {t(language, 'noProductsYet')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'images')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'productName')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'price')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'category')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'stock')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-secondary hover:bg-gold-glow/30 transition-colors">
                      <td className="py-2.5 px-3 text-center">
                        <Image src={p.main_image} alt={p.name} width={42} height={42} className="w-[42px] h-[42px] object-cover rounded-lg border border-gold-border mx-auto" />
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">{p.name}</td>
                      <td className="py-2.5 px-3 text-center text-primary font-bold">{p.price} {t(language, 'currency')}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{p.category || '-'}</td>
                      <td className="py-2.5 px-3 text-center">{p.stock}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button onClick={() => handleEditProduct(p)} className="text-primary hover:scale-125 transition-transform mx-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-destructive hover:scale-125 transition-transform mx-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Shipping Settings */}
        <section id="shipping" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <Truck className="w-4 h-4" />
              {t(language, 'shippingConfig')}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'defaultShippingPrice')}
              </label>
              <input
                type="number"
                value={shipping.default_price}
                onChange={e => setShipping({ ...shipping, default_price: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'freeShippingStates')}
              </label>
              <input
                type="text"
                value={shipping.free_wilayas.join(', ')}
                onChange={e => setShipping({ ...shipping, free_wilayas: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="الجزائر العاصمة, وهران, ..."
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
          </div>
        </section>

        {/* Contact Settings */}
        <section id="contact" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t(language, 'contactInfo')}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'phone')}
              </label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'whatsapp')}
              </label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={e => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'instagram')}
              </label>
              <input
                type="text"
                value={contact.instagram}
                onChange={e => setContact({ ...contact, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
                {t(language, 'facebook')}
              </label>
              <input
                type="text"
                value={contact.facebook}
                onChange={e => setContact({ ...contact, facebook: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
          </div>
        </section>

        {/* Orders */}
        <section id="orders" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary flex-wrap gap-2.5">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              {t(language, 'orders')}
            </h3>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(t(language, 'clearAllOrders') + '?')) {
                    orders.forEach(o => archiveOrder(o.id))
                  }
                }}
                className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg font-bold text-sm transition-all hover:bg-destructive hover:text-white flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                {t(language, 'clearAllOrders')}
              </button>
            )}
          </div>

          {/* Search */}
          <div className="flex gap-2.5 mb-4">
            <div className="relative flex-1 max-w-[320px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t(language, 'searchOrders')}
                className="w-full pr-10 pl-3.5 py-2.5 bg-secondary border border-muted rounded-lg text-foreground text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-gold-glow"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-2.5 bg-secondary border border-muted text-muted-foreground rounded-lg text-sm transition-colors hover:text-primary"
              >
                {t(language, 'clearSearch')}
              </button>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60">
              <ClipboardList className="w-10 h-10 mx-auto mb-2.5 opacity-25" />
              {t(language, 'noOrders')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'orderId')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'product')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'customer')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'total')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'status')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="border-b border-secondary hover:bg-gold-glow/30 transition-colors">
                      <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">#{o.id.slice(-6)}</td>
                      <td className="py-2.5 px-3 text-center">
                        {o.product || o.products?.map(p => p.name).join(', ')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="font-semibold">{o.name}</div>
                        <div className="text-xs text-muted-foreground">{o.phone}</div>
                        <div className="text-xs text-muted-foreground">{o.state} / {o.city}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-primary font-bold">{o.total?.toLocaleString('ar-DZ')} {t(language, 'currency')}</td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="px-2.5 py-1 rounded-full text-xs font-bold border-none bg-secondary text-foreground"
                          style={{
                            backgroundColor: statusOptions.find(s => s.value === o.status)?.color + '20',
                            color: statusOptions.find(s => s.value === o.status)?.color,
                          }}
                        >
                          {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.value}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button onClick={() => archiveOrder(o.id)} className="text-destructive hover:scale-125 transition-transform mx-1" title={t(language, 'archive')}>
                          <Archive className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Archive */}
        <section id="archive" className="bg-card border border-gold-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-secondary flex-wrap gap-2.5">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <Archive className="w-4 h-4" />
              {t(language, 'archive')}
            </h3>
            {archive.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(t(language, 'clearArchive') + '?')) {
                    setArchive([])
                  }
                }}
                className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg font-bold text-sm transition-all hover:bg-destructive hover:text-white flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                {t(language, 'clearArchive')}
              </button>
            )}
          </div>

          {archive.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60">
              <Archive className="w-10 h-10 mx-auto mb-2.5 opacity-25" />
              {t(language, 'noOrders')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'orderId')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'product')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'customer')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'total')}</th>
                    <th className="py-2.5 px-3 text-center text-xs font-bold text-primary tracking-wider border-b border-gold-border">{t(language, 'actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {archive.map(o => (
                    <tr key={o.id} className="border-b border-secondary hover:bg-gold-glow/30 transition-colors">
                      <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">#{o.id.slice(-6)}</td>
                      <td className="py-2.5 px-3 text-center">
                        {o.product || o.products?.map(p => p.name).join(', ')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="font-semibold">{o.name}</div>
                        <div className="text-xs text-muted-foreground">{o.phone}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-primary font-bold">{o.total?.toLocaleString('ar-DZ')} {t(language, 'currency')}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button onClick={() => restoreOrder(o.id)} className="text-green-500 hover:scale-125 transition-transform mx-1" title={t(language, 'restore')}>
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteArchive(o.id)} className="text-destructive hover:scale-125 transition-transform mx-1" title={t(language, 'deletePermanently')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
