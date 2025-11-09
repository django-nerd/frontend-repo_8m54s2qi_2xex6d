import { useEffect, useMemo, useState } from 'react';
import ParallaxHero from './components/ParallaxHero';
import CategoryGrid from './components/CategoryGrid';
import ProductSection from './components/ProductSection';
import CartDrawer from './components/CartDrawer';
import FooterRetro from './components/FooterRetro';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => (window.location.hash = r)];
}

export default function App() {
  const [route] = useHashRoute();
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);
  const cartCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const addToCart = (item) => {
    // merge by id + meta
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.meta === item.meta);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };
  const removeItem = (item) => setItems((prev) => prev.filter((p) => !(p.id === item.id && p.meta === item.meta)));

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-[#101020] text-white`}>      
      {route.startsWith('#/admin') ? (
        <AdminPage darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : route.startsWith('#/checkout') ? (
        <CheckoutPage items={items} onClear={() => setItems([])} />
      ) : route.startsWith('#/login') ? (
        <AuthPage />
      ) : (
        <>
          <ParallaxHero
            onToggleTheme={() => setDarkMode((d) => !d)}
            darkMode={darkMode}
            cartCount={cartCount}
            onOpenCart={() => setCartOpen(true)}
          />
          <CategoryGrid onSelect={(id) => setActiveCategory(id)} />
          <ProductSection activeCategory={activeCategory} onAdd={addToCart} />
          <FooterRetro />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} onRemove={removeItem} />
        </>
      )}
    </div>
  );
}

function CheckoutPage({ items, onClear }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const payments = ['QRIS', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'Bank Transfer', 'Virtual Account'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111123] to-[#1a1a35] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <a href="#/" className="text-sm text-pink-200/80">← Continue Shopping</a>
        <h2 className="mt-2 text-3xl font-bold text-white">Checkout</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.length === 0 && (
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-pink-100/80">Your cart is empty.</div>
            )}
            {items.map((item) => (
              <div key={item.id+item.meta} className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <img src={item.logo} alt={item.name} className="w-8 h-8" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-pink-100/70">{item.meta}</div>
                  </div>
                  <div className="text-sm">x{item.qty}</div>
                  <div className="font-semibold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
              <div className="font-semibold">Payment Methods</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {payments.map((p) => (
                  <div key={p} className="px-3 py-2 rounded-2xl text-sm text-center bg-white/10 border border-white/15 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.25),_inset_-6px_-6px_12px_rgba(255,255,255,0.06)]">{p}</div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-sm text-pink-100/80">
                <span>Total</span>
                <span className="text-white font-semibold">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <button onClick={onClear} className="mt-4 w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-medium shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)]">Pay Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#111123] to-[#1a1a35] px-6 py-10">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/10 text-white shadow-[10px_10px_20px_rgba(0,0,0,0.35),_-10px_-10px_20px_rgba(255,255,255,0.06)]">
        <h2 className="text-2xl font-bold">Login</h2>
        <div className="mt-4">
          <label className="text-sm text-pink-100/80">Email</label>
          <input className="mt-1 w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-fuchsia-400/40" placeholder="you@example.com" />
        </div>
        <div className="mt-3">
          <label className="text-sm text-pink-100/80">Password</label>
          <input type="password" className="mt-1 w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-fuchsia-400/40" placeholder="••••••••" />
        </div>
        <a href="#/admin" className="mt-5 block w-full text-center px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-medium">Enter Dashboard</a>
        <a href="#/" className="mt-2 block text-center text-sm text-pink-200/80">Back to store</a>
      </div>
    </div>
  );
}

function AdminPage({ darkMode, setDarkMode }) {
  const [categories, setCategories] = useState([
    { id: 'game', name: 'Game Top-up' },
    { id: 'apps', name: 'Premium Apps' },
  ]);
  const [newCat, setNewCat] = useState('');

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-[#101020] to-[#191937] text-white`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex gap-2">
            <a href="#/" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Store</a>
            <a href="#/login" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Logout</a>
            <button onClick={()=>setDarkMode(d=>!d)} className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Theme</button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
            <div className="font-semibold">Categories</div>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/10 border border-white/15">
                  <span>{c.name}</span>
                  <button onClick={()=>setCategories(prev=>prev.filter(p=>p.id!==c.id))} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Delete</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <input value={newCat} onChange={(e)=>setNewCat(e.target.value)} placeholder="New category name" className="flex-1 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
              <button onClick={()=>{ if(!newCat.trim()) return; const id=newCat.toLowerCase().replace(/\s+/g,'-'); setCategories(prev=>[...prev,{id,name:newCat}]); setNewCat(''); }} className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500">Add</button>
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
            <div className="font-semibold">Transactions</div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
              <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                <span>#TRX-001 • Success</span>
                <span className="text-emerald-300">Rp 120.000</span>
              </div>
              <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                <span>#TRX-002 • Pending</span>
                <span className="text-amber-300">Rp 65.000</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="font-semibold">Deposit (Mock)</div>
              <div className="mt-2 flex gap-2">
                <input placeholder="Amount" className="flex-1 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
                <button className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
