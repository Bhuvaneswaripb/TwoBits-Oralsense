'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductGraphic } from '@/components/ui/ProductGraphic';
import {
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Info,
  CheckCircle2,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { getStoredChildProfile, getStoredBrushReplacement, saveBrushReplacement, getTodayStr } from '@/lib/storage';
import { getStoredCart, addToCart, updateCartItemQuantity, removeFromCart, createDemoOrder } from '@/lib/cartStorage';
import { ChildProfile, BrushReplacement, DentalProduct, CartItem, DentalOrder, ShippingDetails } from '@/types';
import { getApiDentalProducts } from '@/lib/api';

const DEFAULT_PRODUCTS: DentalProduct[] = [
  {
    id: 'prod-1',
    name: 'OralSense Junior Soft Sonic Toothbrush',
    category: "Children's Toothbrushes",
    ageRange: '3-6 years',
    description: 'Ultra-soft tapered bristles with 2-minute zone pulse timer designed for gentle primary teeth cleaning.',
    price: 24.99,
    rating: 4.9,
    reviewCount: 128,
    recommendedFor: 'Early habit builders needing gentle gumline care',
    inStock: true,
    currency: '$',
    features: [
      'Ultra-soft tapered bristles for delicate gums',
      '2-minute quadrant pulse timer',
      'Ergonomic non-slip child grip',
      'Rechargeable battery (up to 30 days use)',
    ],
  },
  {
    id: 'prod-2',
    name: 'Kids Smart Oscillating Power Brush',
    category: 'Electric Toothbrushes',
    ageRange: '6-12 years',
    description: 'Dual-speed gentle oscillating brush head with pressure sensor and quadrant timer.',
    price: 39.99,
    rating: 4.8,
    reviewCount: 94,
    recommendedFor: 'Developing permanent teeth and independent brushing',
    inStock: true,
    currency: '$',
    features: [
      'Dual-speed gentle oscillating motion',
      'Visible pressure sensor to protect enamel',
      'Smart 2-minute zone guide timer',
      'Compatible with all soft replacement heads',
    ],
  },
  {
    id: 'prod-3',
    name: 'Mild Mint Fluoride Enamel Protection Toothpaste',
    category: 'Toothpaste',
    ageRange: '6+ years',
    description: 'Dentist-recommended 1450 ppm fluoride formula with low abrasivity to support enamel remineralization.',
    price: 6.49,
    rating: 4.9,
    reviewCount: 215,
    recommendedFor: 'Daily cavity prevention and enamel fortification',
    inStock: true,
    currency: '$',
    features: [
      '1450 ppm active fluoride enamel defense',
      'Mild kid-approved mint flavor',
      'Low RDA abrasivity rating',
      'SLS-free gentle foam formula',
    ],
  },
  {
    id: 'prod-4',
    name: 'Gentle Care Kids Fluoride Free Starter Gel',
    category: 'Toothpaste',
    ageRange: '2-5 years',
    description: 'Natural berry-flavored low-foam gel formulated safely for young children learning to spit.',
    price: 5.99,
    rating: 4.7,
    reviewCount: 86,
    recommendedFor: 'Toddlers & early brushers starting daily routine',
    inStock: true,
    currency: '$',
    features: [
      'Safe if swallowed starter gel',
      'Natural wild berry flavor',
      'Xylitol enriched to discourage plaque',
      'Free from artificial dyes and preservatives',
    ],
  },
  {
    id: 'prod-5',
    name: 'Ergonomic Handle Kids Flossers (48 Pack)',
    category: 'Flossers',
    ageRange: '4-12 years',
    description: 'Shred-resistant PTFE floss string with easy-grip safety handles in fun colors.',
    price: 7.99,
    rating: 4.9,
    reviewCount: 310,
    recommendedFor: 'Interdental cleaning between tight back teeth',
    inStock: true,
    currency: '$',
    features: [
      'Shred-resistant fluoride coated floss',
      'Child-safe rounded pick tip',
      'Easy-grip ergonomic animal handle',
      '48 individually sealed flossers',
    ],
  },
  {
    id: 'prod-6',
    name: 'Ultra-Soft Replacement Brush Heads (4 Pack)',
    category: 'Replacement Brush Heads',
    ageRange: 'All Ages',
    description: 'Color-fading indicator bristles that signal when 3-month replacement interval is due.',
    price: 18.99,
    rating: 4.8,
    reviewCount: 164,
    recommendedFor: 'Quarterly brush head replacement reminder routine',
    inStock: true,
    currency: '$',
    features: [
      'Color fading indicator bristles',
      'Ultra-soft micro-fine filament bristles',
      'Snap-on universal fit shaft',
      '4 color-coded identification rings',
    ],
  },
];

export default function DentalProductsPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [products, setProducts] = useState<DentalProduct[]>(DEFAULT_PRODUCTS);
  const [replacement, setReplacement] = useState<BrushReplacement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [replacementDateInput, setReplacementDateInput] = useState(getTodayStr());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<DentalProduct | null>(null);
  const [modalQty, setModalQty] = useState(1);

  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [confirmedOrder, setConfirmedOrder] = useState<DentalOrder | null>(null);

  // Shipping Form State
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: 'Jane Doe',
    phone: '(555) 234-5678',
    address: '123 Health Tech Way',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
  });

  useEffect(() => {
    const p = getStoredChildProfile();
    setProfile(p);
    if (p?.id) {
      const b = getStoredBrushReplacement(p.id);
      setReplacement(b);
      setReplacementDateInput(b.lastReplacementDate || getTodayStr());
    }

    setCart(getStoredCart());

    getApiDentalProducts().then((res) => {
      if (res && res.length > 0) {
        setProducts(res);
      }
    });
  }, []);

  const categories = ['All', "Children's Toothbrushes", 'Electric Toothbrushes', 'Toothpaste', 'Flossers', 'Replacement Brush Heads'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((item) => item.category === selectedCategory);

  const handleUpdateReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    const updated = saveBrushReplacement(profile.id, replacementDateInput);
    setReplacement(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (product: DentalProduct, qty: number = 1) => {
    const updated = addToCart(product, qty);
    setCart(updated);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleQtyChange = (productId: string, newQty: number) => {
    const updated = updateCartItemQuantity(productId, newQty);
    setCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = removeFromCart(productId);
    setCart(updated);
  };

  // Checkout Handlers
  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteDemoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createDemoOrder(cart, shipping);
    setConfirmedOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  // Calculated Subtotals
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal >= 35 || cartSubtotal === 0 ? 0 : 3.99;
  const cartTotal = Number((cartSubtotal + deliveryFee).toFixed(2));
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dental-habits" className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dental Habits
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
              Dental Essentials Shop & Refill Reminders
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Age-Appropriate Toothbrushes • Toothpaste & Floss • 3-Month Replacement Tracker
          </p>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 bg-brand-900 hover:bg-brand-950 text-white px-4 py-2.5 rounded-2xl shadow-subtle hover:shadow-premium font-bold text-xs transition-all relative self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Shopping Cart</span>
          {cartCount > 0 && (
            <span className="bg-cyan-500 text-brand-950 font-black px-2 py-0.5 rounded-full text-[10px] animate-in zoom-in-95">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Suggested Recommendations & Replacement Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner 1: Age Recommendation */}
        <Card className="p-6 md:col-span-2 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white rounded-3xl space-y-3 border-0 shadow-premium flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase font-extrabold text-cyan-300 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" /> SUGGESTED FOR YOUR ROUTINE
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Suggested Products for {profile?.name || 'Child'} (Age {profile?.age || 6})
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {profile && profile.age <= 5
                ? "For ages 2-5, we suggest a soft-bristle starter toothbrush and a low-foam starter gel. Supervise morning and bedtime brushing."
                : "For ages 6+, we suggest a gentle oscillating power brush with a 2-minute timer and fluoride enamel protection toothpaste."}
            </p>
          </div>
          
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 flex items-center justify-between">
            <span><strong>Free Shipping:</strong> On orders $35 and above</span>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px] font-bold">
              Demo Checkout Active
            </Badge>
          </div>
        </Card>

        {/* Banner 2: Never Miss a Replacement Widget */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-subtle rounded-3xl space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-700" />
            <h3 className="text-base font-extrabold text-brand-950">Never Miss a Replacement</h3>
          </div>

          <div className="space-y-1 text-left">
            <div className="text-[10px] uppercase font-extrabold text-slate-400">NEXT REMINDER</div>
            <div className="text-lg font-extrabold text-brand-950">{replacement?.nextReminderDate || '3 months out'}</div>
            <div className="text-[11px] text-slate-500">Suggested interval: 3 Months</div>
          </div>

          <form onSubmit={handleUpdateReplacement} className="space-y-2 pt-1">
            <input
              type="date"
              value={replacementDateInput}
              onChange={(e) => setReplacementDateInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500"
            />
            <Button type="submit" variant="secondary" size="sm" className="w-full text-xs font-bold">
              Update Replacement Date
            </Button>
            {savedSuccess && (
              <div className="text-[10px] font-bold text-emerald-600 text-center">
                ✓ Replacement reminder updated!
              </div>
            )}
          </form>
        </Card>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6 bg-white border-slate-200/80 shadow-subtle hover:shadow-premium transition-all rounded-3xl flex flex-col justify-between space-y-4 group">
            
            {/* Realistic Product Image Graphic */}
            <ProductGraphic productId={product.id} category={product.category} />

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-900 font-bold text-[10px]">
                  {product.category}
                </Badge>
                <span className="text-xs font-extrabold text-slate-500">{product.ageRange}</span>
              </div>

              <h3 className="text-base font-extrabold text-brand-950 leading-snug group-hover:text-brand-700 transition-colors">
                {product.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Product Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold pt-1">
                  <span>★</span>
                  <span className="text-slate-800">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount || 42})</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xl font-black text-brand-950">${product.price.toFixed(2)}</div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setModalQty(1);
                  }}
                  className="text-xs font-bold w-full"
                >
                  View Details
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product, 1)}
                  icon={<ShoppingCart className="w-3.5 h-3.5" />}
                  className="text-xs font-bold w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 border-0 shadow-sm"
                >
                  Add to Cart
                </Button>
              </div>
            </div>

          </Card>
        ))}
      </div>

      {/* Educational Catalog Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <strong>Shopping Notice:</strong> Products in OralSense Dental Essentials represent a demo shopping catalog to support daily habit routines. Purchases use a demo checkout flow and do not charge real payment cards.
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="p-6 sm:p-8 bg-white max-w-xl w-full rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <ProductGraphic productId={selectedProduct.id} category={selectedProduct.category} className="w-full h-48" />

            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <Badge variant="primary" className="bg-cyan-100 text-cyan-900 font-bold text-xs">
                  {selectedProduct.category}
                </Badge>
                <span className="text-xs font-bold text-slate-500">Suitable for: {selectedProduct.ageRange}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-brand-950">{selectedProduct.name}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>

              {/* Key Features */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-extrabold text-brand-950 uppercase tracking-wider">Key Features:</div>
                <ul className="space-y-1.5">
                  {selectedProduct.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong>Suggested for:</strong> {selectedProduct.recommendedFor}
              </div>
            </div>

            {/* Modal Price & Quantity Selector */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Price</div>
                <div className="text-2xl font-black text-brand-950">${selectedProduct.price.toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl p-1 bg-slate-50">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-extrabold text-slate-800">{modalQty}</span>
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleAddToCart(selectedProduct, modalQty)}
                  icon={<ShoppingCart className="w-4 h-4" />}
                  className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0"
                >
                  Add to Cart (${(selectedProduct.price * modalQty).toFixed(2)})
                </Button>
              </div>
            </div>

          </Card>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-700" />
                  <h3 className="text-xl font-extrabold text-brand-950">Shopping Cart ({cartCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="text-base font-extrabold text-brand-950">Your cart is empty</div>
                  <p className="text-xs text-slate-500">Browse Dental Essentials to add toothbrushes, toothpaste, or flossers.</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0">
                          <ProductGraphic productId={item.product.id} category={item.product.category} className="w-full h-full" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-brand-950 line-clamp-1">{item.product.name}</div>
                          <div className="text-[11px] text-slate-500">${item.product.price.toFixed(2)} each</div>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => handleQtyChange(item.product.id, item.quantity - 1)} className="p-1 rounded bg-slate-100 hover:bg-slate-200">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button onClick={() => handleQtyChange(item.product.id, item.quantity + 1)} className="p-1 rounded bg-slate-100 hover:bg-slate-200">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-brand-950">${(item.product.price * item.quantity).toFixed(2)}</div>
                        <button onClick={() => handleRemoveItem(item.product.id)} className="text-rose-500 hover:text-rose-700 text-[11px] font-bold mt-1">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-bold text-slate-900">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-brand-950 border-t border-slate-100 pt-2">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProceedCheckout}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0"
                >
                  Proceed to Checkout (${cartTotal.toFixed(2)})
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="p-6 sm:p-8 bg-white max-w-2xl w-full rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <Badge variant="primary" className="bg-cyan-100 text-cyan-900 font-bold text-[10px]">
                DEMO CHECKOUT
              </Badge>
              <h2 className="text-2xl font-extrabold text-brand-950">Complete Order</h2>
              <p className="text-xs text-slate-500">Provide shipping details for your Dental Essentials demo order.</p>
            </div>

            <form onSubmit={handleCompleteDemoPayment} className="space-y-6">
              
              {/* Delivery Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-700" /> STEP 1: DELIVERY INFORMATION
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Phone</label>
                    <input
                      type="text"
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">State / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={`${shipping.state} ${shipping.postalCode}`}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & Demo Payment */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="font-extrabold text-brand-950 uppercase tracking-wider flex items-center justify-between">
                  <span>STEP 2: ORDER SUMMARY ({cartCount} ITEMS)</span>
                  <span className="text-cyan-700">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="space-y-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-slate-700">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Payment Option */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-3">
                <div className="text-xs font-extrabold text-cyan-950 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-700" /> STEP 3: PAYMENT METHOD (DEMO)
                  </span>
                  <Badge variant="secondary" className="bg-cyan-200 text-cyan-950 text-[9px] font-bold">
                    No Real Payment Charged
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Select a demo payment method below. Demo checkout — no real payment will be processed.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'bg-white border-cyan-500 shadow-sm font-bold text-cyan-950' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                    <CreditCard className="w-4 h-4 text-cyan-700" />
                    <span>Card (Demo)</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'bg-white border-cyan-500 shadow-sm font-bold text-cyan-950' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="sr-only" />
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>UPI (Demo)</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'bg-white border-cyan-500 shadow-sm font-bold text-cyan-950' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="sr-only" />
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>Wallet (Demo)</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0 shadow-md"
              >
                Place Demo Order — ${cartTotal.toFixed(2)}
              </Button>
            </form>

          </Card>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="p-8 bg-white max-w-lg w-full rounded-3xl shadow-2xl space-y-6 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <Badge variant="primary" className="bg-emerald-100 text-emerald-900 font-bold text-xs">
                ORDER CONFIRMED #{confirmedOrder.orderId}
              </Badge>
              <h2 className="text-2xl font-black text-brand-950">Your dental essentials are on their way!</h2>
              <p className="text-xs text-slate-500">
                Estimated Delivery: 3–5 Business Days to {confirmedOrder.shippingDetails.city}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="font-extrabold text-slate-800">Order Summary ({confirmedOrder.items.length} items):</div>
              {confirmedOrder.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-slate-600">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-brand-950 text-sm">
                <span>Total Paid (Demo)</span>
                <span>${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setConfirmedOrder(null)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-extrabold border-0"
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      )}

    </div>
  );
}
