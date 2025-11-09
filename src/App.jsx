import { useEffect, useMemo, useState } from 'react';
import ParallaxHero from './components/ParallaxHero.jsx';
import ProductSection from './components/ProductSection.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FooterRetro from './components/FooterRetro.jsx';
import { LogIn, LogOut, User } from 'lucide-react';

// Small helper to parse hash routes like:
// #/, #/category/:cat, #/category/:cat/:sub, #/product/:id, #/checkout, #/login, #/payment
function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '').replace(/^\//, '');
  const parts = h.split('?')[0].split('/').filter(Boolean);
  const queryStr = h.includes('?') ? h.split('?')[1] : '';
  const query = Object.fromEntries(new URLSearchParams(queryStr));
  if (parts.length === 0) return { name: 'home', params: {}, query };
  if (parts[0] === 'category') {
    return {
      name: 'category',
      params: { cat: parts[1] || '', sub: parts[2] || '' },
      query,
    };
  }
  if (parts[0] === 'product') {
    return { name: 'product', params: { id: parts[1] || '' }, query };
  }
  if (parts[0] === 'checkout') return { name: 'checkout', params: {}, query };
  if (parts[0] === 'login') return { name: 'login', params: {}, query };
  if (parts[0] === 'payment') return { name: 'payment', params: {}, query };
  return { name: 'home', params: {}, query };
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

// Lightweight catalog (mirrors the cards) to support product detail & payment
const CATALOG = [
  { id: 'ml_86', category: 'game', sub: 'Mobile Legends', name: '86 Diamonds', price: 25000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mobilelegends.svg', inputLabel: 'Player ID' },
  { id: 'ff_140', category: 'game', sub: 'Free Fire', name: '140 Diamonds', price: 27000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/garena.svg', inputLabel: 'Player ID' },
  { id: 'spotify_prem', category: 'apps', sub: 'Spotify', name: 'Premium 1 Month', price: 54000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg', inputLabel: 'Email' },
  { id: 'netflix_prem', category: 'apps', sub: 'Netflix', name: 'Premium 1 Month', price: 65000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg', inputLabel: 'Email' },
  { id: 'data_10', category: 'data', sub: 'Telkomsel', name: 'Data 10GB', price: 45000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telkomsel.svg', inputLabel: 'Phone Number' },
  { id: 'pln_20', category: 'ppob', sub: 'PLN', name: 'Token 20k', price: 22000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lightning.svg', inputLabel: 'Meter Number' },
];

export default function App() {
  const route = useHashRoute();

  // theme
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // auth
  const [loggedIn, setLoggedIn] = useState(false);

  // cart & drawer
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  // fast checkout single item
  const [fastItem, setFastItem] = useState(null);

  const addToCart = (item) => {
    if (!loggedIn) {
      window.location.hash = '#/login?next=cart';
      return;
    }
    setCart((prev) => {
      const key = item.id + '|' + (item.meta || '')
      const idx = prev.findIndex((p) => p.id + '|' + (p.meta || '') === key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (item.qty || 1) };
        return copy;
      }
      return [...prev, { ...item }];
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((p) => !(p.id === item.id && (p.meta || '') === (item.meta || ''))));
  };

  const openCart = () => {
    if (!loggedIn) {
      window.location.hash = '#/login?next=cart';
      return;
    }
    setDrawerOpen(true);
  };

  // handle post-login redirect
  useEffect(() => {
    if (route.name === 'login' && loggedIn) {
      const next = route.query.next || '';
      if (next === 'cart') {
        setDrawerOpen(true);
        window.location.hash = '#/checkout';
      } else {
        window.location.hash = '#/';
      }
    }
  }, [route, loggedIn]);

  const bgGradient = 'bg-[linear-gradient(135deg,#5A639C_0%,#7776B3_35%,#9B86BD_70%,#E2BBE9_100%)]';

  return (
    <div className={`min-h-screen ${bgGradient} text-white`}>
      {/* Top navigation with auth status */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="#/" className="font-bold tracking-wide">Retro Soft Store</a>
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <button onClick={() => setLoggedIn(false)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"><LogOut size={16}/>Logout</button>
            ) : (
              <a href="#/login" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"><LogIn size={16}/>Login</a>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"><User size={16}/> {loggedIn ? 'Member' : 'Guest'}</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <ParallaxHero onToggleTheme={() => setDarkMode((d) => !d)} darkMode={darkMode} cartCount={cartCount} onOpenCart={openCart} />

      {/* Main content routing */}
      <main id="shop" className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {route.name === 'home' && (
          <ShopView onAdd={addToCart} />
        )}
        {route.name === 'category' && (
          <CategoryView cat={route.params.cat} sub={route.params.sub} onAdd={addToCart} />
        )}
        {route.name === 'product' && (
          <ProductQuickBuy id={route.params.id} onAdd={addToCart} onFast={(it) => { setFastItem(it); window.location.hash = '#/payment'; }} />
        )}
        {route.name === 'login' && (
          <LoginView onSuccess={() => setLoggedIn(true)} />
        )}
        {route.name === 'checkout' && (
          <CheckoutView loggedIn={loggedIn} cart={cart} onProceed={() => { setFastItem(null); window.location.hash = '#/payment'; }} />
        )}
        {route.name === 'payment' && (
          <PaymentView cart={cart} fastItem={fastItem} />
        )}
      </main>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={cart} onRemove={removeFromCart} />

      <FooterRetro />
    </div>
  );
}

function ShopView({ onAdd }) {
  const [cat, setCat] = useState('');
  const [sub, setSub] = useState('');
  return (
    <div className="space-y-6">
      <SectionTitle title="Browse Products" subtitle="Pick a category or jump into quick buy via each product's details." />
      <ProductSection
        currentCategory={cat}
        currentSub={sub}
        onChangeCategory={(c) => { setCat(c); setSub(''); window.location.hash = `#/category/${encodeURIComponent(c)}`; }}
        onChangeSub={(s) => { setSub(s); window.location.hash = `#/category/${encodeURIComponent(cat)}/${encodeURIComponent(s)}`; }}
        onAdd={onAdd}
      />
    </div>
  );
}

function CategoryView({ cat, sub, onAdd }) {
  const [activeCat, setActiveCat] = useState(cat || '');
  const [activeSub, setActiveSub] = useState(sub || '');
  useEffect(() => { setActiveCat(cat || ''); }, [cat]);
  useEffect(() => { setActiveSub(sub || ''); }, [sub]);
  return (
    <div className="space-y-6">
      <SectionTitle title={`Category: ${activeCat || 'All'}`} subtitle={activeSub ? `Subcategory: ${activeSub}` : 'Choose a subcategory to filter.'} />
      <ProductSection
        currentCategory={activeCat}
        currentSub={activeSub}
        onChangeCategory={(c) => { setActiveCat(c); setActiveSub(''); window.location.hash = `#/category/${encodeURIComponent(c)}`; }}
        onChangeSub={(s) => { setActiveSub(s); window.location.hash = `#/category/${encodeURIComponent(activeCat)}/${encodeURIComponent(s)}`; }}
        onAdd={onAdd}
      />
    </div>
  );
}

function ProductQuickBuy({ id, onAdd, onFast }) {
  const product = useMemo(() => CATALOG.find((p) => p.id === id), [id]);
  const [value, setValue] = useState('');
  const [qty, setQty] = useState(1);
  if (!product) {
    return (
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="text-lg font-semibold">Product not found</div>
        <a href="#/" className="underline opacity-80">Go back</a>
      </div>
    );
  }
  const total = product.price * qty;
  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="flex items-center gap-3">
          <img src={product.logo} alt={product.name} className="w-10 h-10" />
          <div>
            <div className="text-xl font-semibold">{product.name}</div>
            <div className="text-sm opacity-80">{product.sub} • Rp {product.price.toLocaleString('id-ID')}</div>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs opacity-90">{product.inputLabel}</label>
          <input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={product.inputLabel} className="mt-1 w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/20 outline-none" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={()=> setQty(Math.max(1, qty-1))} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">-</button>
          <span>{qty}</span>
          <button onClick={()=> setQty(qty+1)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">+</button>
        </div>
      </div>
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="text-lg font-semibold">Quick Buy</div>
        <p className="text-sm opacity-85 mt-1">Use one input, then choose how to pay. Cart requires login. Or use Fast Checkout without login.</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <div className="mt-5 grid gap-3">
          <button
            onClick={() => onAdd({ ...product, qty, meta: value })}
            className="w-full px-4 py-2 rounded-2xl bg-[#5A639C] hover:brightness-110 border border-white/20 shadow"
          >
            Add to Cart (login required)
          </button>
          <button
            onClick={() => onFast({ ...product, qty, meta: value })}
            className="w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-[#9B86BD] to-[#E2BBE9] text-black font-medium hover:opacity-95"
          >
            Fast Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginView({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const submit = (e) => {
    e.preventDefault();
    // Simulate success
    onSuccess();
  };
  return (
    <div className="max-w-md mx-auto p-6 rounded-3xl bg-white/10 border border-white/20">
      <div className="text-xl font-semibold">Login</div>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 outline-none" />
        <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Password" className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 outline-none" />
        <button type="submit" className="mt-2 px-4 py-2 rounded-2xl bg-[#7776B3] hover:brightness-110">Sign In</button>
      </form>
      <p className="text-xs opacity-80 mt-3">You must be logged in to use the cart. Alternatively, use Fast Checkout from a product page.</p>
    </div>
  );
}

function CheckoutView({ loggedIn, cart, onProceed }) {
  useEffect(() => {
    if (!loggedIn) window.location.hash = '#/login?next=cart';
  }, [loggedIn]);
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  return (
    <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
      <div className="text-xl font-semibold">Checkout</div>
      {cart.length === 0 ? (
        <p className="mt-2 opacity-80 text-sm">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {cart.map((i) => (
              <li key={i.id + (i.meta || '')} className="flex items-center justify-between text-sm">
                <span>{i.name} x{i.qty} <span className="opacity-70">{i.meta ? `• ${i.meta}` : ''}</span></span>
                <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm opacity-85">Total</span>
            <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <button onClick={onProceed} className="mt-5 w-full px-4 py-2 rounded-2xl bg-[#5A639C] hover:brightness-110">Proceed to Payment</button>
        </>
      )}
    </div>
  );
}

function PaymentView({ cart, fastItem }) {
  const items = fastItem ? [fastItem] : cart;
  const total = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  return (
    <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
      <div className="text-xl font-semibold">Payment</div>
      {items.length === 0 ? (
        <p className="mt-2 opacity-80 text-sm">No items to pay. Go back to shop.</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li key={i.id + (i.meta || '')} className="flex items-center justify-between text-sm">
                <span>{i.name} x{i.qty} <span className="opacity-70">{i.meta ? `• ${i.meta}` : ''}</span></span>
                <span>Rp {(i.price * i.qty).toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm opacity-85">Grand Total</span>
            <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <button className="px-4 py-2 rounded-2xl bg-[#9B86BD] text-black font-medium hover:opacity-95">Pay with QRIS</button>
            <button className="px-4 py-2 rounded-2xl bg-[#E2BBE9] text-black font-medium hover:opacity-95">Virtual Account</button>
          </div>
          <p className="text-xs opacity-75 mt-3">Mock payment UI for demo purposes.</p>
        </>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-2xl font-bold drop-shadow-sm">{title}</h2>
      {subtitle && <p className="text-sm opacity-85 mt-1">{subtitle}</p>}
    </div>
  );
}
