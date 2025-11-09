import { useEffect, useMemo, useState } from 'react';
import ParallaxHero from './components/ParallaxHero';
import CategoryGrid from './components/CategoryGrid';
import ProductSection from './components/ProductSection';
import CartDrawer from './components/CartDrawer';
import FooterRetro from './components/FooterRetro';
import Breadcrumbs from './components/Breadcrumbs';
import Carousel from './components/Carousel';
import ScrollParallax from './components/ScrollParallax';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => (window.location.hash = r)];
}

const PATHS = {
  home: '#/',
  category: (cat) => `#/category/${encodeURIComponent(cat)}`,
  subcategory: (cat, sub) => `#/category/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}`,
  product: (id) => `#/product/${encodeURIComponent(id)}`,
  checkout: '#/checkout',
  login: '#/login',
  admin: '#/admin',
  adminUsers: '#/admin/users',
  adminSalary: '#/admin/salary',
  adminSettings: '#/admin/settings',
};

export default function App() {
  const [route] = useHashRoute();
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);
  const cartCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const addToCart = (item) => {
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

  // Routing guards for admin subpages
  const isAdmin = route.startsWith('#/admin');

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-[#101020] text-white`}> 
      <Breadcrumbs route={route} />
      {isAdmin ? (
        <AdminPage darkMode={darkMode} setDarkMode={setDarkMode} route={route} />
      ) : route.startsWith('#/checkout') ? (
        <CheckoutPage items={items} onClear={() => setItems([])} />
      ) : route.startsWith('#/login') ? (
        <AuthPage />
      ) : route.startsWith('#/category') ? (
        <CategoryPage route={route} onAdd={addToCart} />
      ) : route.startsWith('#/product') ? (
        <ProductDetailPage route={route} onAdd={addToCart} />
      ) : (
        <>
          <ParallaxHero
            onToggleTheme={() => setDarkMode((d) => !d)}
            darkMode={darkMode}
            cartCount={cartCount}
            onOpenCart={() => setCartOpen(true)}
          />

          <div className="max-w-6xl mx-auto px-6">
            <Carousel />
          </div>

          <ScrollParallax className="relative py-14 sm:py-16 md:py-20">
            <div data-speed="0.15" className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
              <div className="absolute top-20 -right-10 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>
            <div data-speed="0" className="relative z-10">
              <div className="max-w-6xl mx-auto px-6">
                <CategoryGrid onSelect={(id) => { setActiveCategory(id); window.location.hash = PATHS.category(id); }} />
                <ProductSection activeCategory={activeCategory} onAdd={addToCart} />
              </div>
            </div>
          </ScrollParallax>

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

function AdminTabs() {
  return (
    <div className="flex flex-wrap gap-2">
      <a href="#/admin" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Overview</a>
      <a href="#/admin/users" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Users</a>
      <a href="#/admin/salary" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Salary</a>
      <a href="#/admin/settings" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Web Settings</a>
    </div>
  );
}

function AdminPage({ darkMode, setDarkMode, route }) {
  const sub = route.replace('#/admin', '') || '';

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-[#101020] to-[#191937] text-white`}>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex gap-2">
            <a href="#/" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Store</a>
            <a href="#/login" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Logout</a>
            <button onClick={()=>setDarkMode(d=>!d)} className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Theme</button>
          </div>
        </div>

        <AdminTabs />

        {sub === '' && <AdminOverview />}
        {sub.startsWith('/') && sub === '/users' && <AdminUsers />}
        {sub.startsWith('/') && sub === '/salary' && <AdminSalary />}
        {sub.startsWith('/') && sub === '/settings' && <AdminSettings />}
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Categories</div>
        <div className="text-sm mt-2 opacity-80">Manage categories, subcategories, and products in dedicated pages.</div>
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
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 'U001', name: 'Arif', email: 'arif@example.com', role: 'admin' },
    { id: 'U002', name: 'Sinta', email: 'sinta@example.com', role: 'user' },
  ]);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Add User</div>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Name" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} placeholder="Email" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <select value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={()=>{ if(!form.name||!form.email) return; const id = 'U' + (Math.random()*1000|0).toString().padStart(3,'0'); setUsers(prev=>[...prev, { id, ...form }]); setForm({ name:'', email:'', role:'user' }); }} className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500">Save</button>
        </div>
      </div>
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Users</div>
        <div className="mt-3 space-y-2">
          {users.map((u)=> (
            <div key={u.id} className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name} <span className="text-xs opacity-70">({u.role})</span></div>
                <div className="text-xs opacity-70">{u.email}</div>
              </div>
              <button onClick={()=>setUsers(prev=>prev.filter(p=>p.id!==u.id))} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSalary() {
  const [records, setRecords] = useState([
    { id: 'S001', name: 'Arif', amount: 3500000, month: '2025-10' },
  ]);
  const [form, setForm] = useState({ name: '', amount: '', month: '' });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Add Salary</div>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Name" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <input type="number" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} placeholder="Amount" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <input type="month" value={form.month} onChange={(e)=>setForm({...form, month: e.target.value})} className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <button onClick={()=>{ if(!form.name||!form.amount||!form.month) return; const id='S'+(Math.random()*1000|0).toString().padStart(3,'0'); setRecords(prev=>[...prev,{ id, name: form.name, amount: Number(form.amount), month: form.month }]); setForm({ name:'', amount:'', month:'' }); }} className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500">Save</button>
        </div>
      </div>
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Salary Records</div>
        <div className="mt-3 space-y-2">
          {records.map((r)=> (
            <div key={r.id} className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs opacity-70">{r.month}</div>
              </div>
              <div className="text-emerald-300">Rp {r.amount.toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [settings, setSettings] = useState({ brand: 'Digital Store Hub', theme: 'retro-soft', primary: '#a21caf' });
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Brand & Theme</div>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input value={settings.brand} onChange={(e)=>setSettings({...settings, brand: e.target.value})} className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none" />
          <select value={settings.theme} onChange={(e)=>setSettings({...settings, theme: e.target.value})} className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none">
            <option value="retro-soft">Retro Soft UI</option>
            <option value="pastel-neon">Pastel Neon</option>
            <option value="pixel-art">Pixel Art</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm opacity-80">Primary</label>
            <input type="color" value={settings.primary} onChange={(e)=>setSettings({...settings, primary: e.target.value})} />
          </div>
        </div>
      </div>
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <div className="font-semibold">Preview</div>
        <div className="mt-3 p-6 rounded-2xl border border-white/10" style={{ background: `linear-gradient(135deg, ${settings.primary}22, transparent)` }}>
          <div className="text-lg font-bold" style={{ color: settings.primary }}>{settings.brand}</div>
          <div className="text-xs opacity-80">Theme: {settings.theme}</div>
        </div>
      </div>
    </div>
  );
}

function CategoryPage({ route, onAdd }) {
  const parts = route.replace(/^#\//,'').split('/').slice(1); // ['game'] or ['game','Mobile%20Legends']
  const category = decodeURIComponent(parts[0] || '');
  const sub = decodeURIComponent(parts[1] || '');

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold">{sub ? `${sub} — ${category}` : category}</h2>
        <div className="mt-6">
          <ProductSection activeCategory={category} onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage({ route, onAdd }) {
  const id = decodeURIComponent(route.split('/').pop() || '');
  // For demo, navigate back to home products
  return (
    <div className="min-h-[50vh] max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold">Product: {id}</h2>
      <div className="text-sm opacity-80 mt-2">This is a simple detail page stub. Choose from listings to add to cart.</div>
      <div className="mt-6">
        <a href="#/" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">Back</a>
      </div>
    </div>
  );
}
