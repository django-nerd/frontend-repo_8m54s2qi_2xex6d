import { useEffect, useMemo, useState } from 'react';
import ParallaxHero from './components/ParallaxHero';
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

const PATHS = {
  home: '#/',
  category: (cat) => `#/category/${encodeURIComponent(cat)}`,
  subcategory: (cat, sub) => `#/category/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}`,
  product: (id) => `#/product/${encodeURIComponent(id)}`,
  checkout: '#/checkout',
  login: '#/login',
};

export default function App() {
  const [route] = useHashRoute();
  const [darkMode, setDarkMode] = useState(true);
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

  const { currentCategory, currentSub, currentProductId } = parseRoute(route);

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-[#0b0c14] text-white`}> 
      <ParallaxHero
        onToggleTheme={() => setDarkMode((d) => !d)}
        darkMode={darkMode}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="shop" className="relative py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          {route.startsWith('#/product') ? (
            <ProductDetail id={currentProductId} />
          ) : (
            <ProductSection
              currentCategory={currentCategory}
              currentSub={currentSub}
              onChangeCategory={(cat) => (window.location.hash = PATHS.category(cat))}
              onChangeSub={(sub) => (window.location.hash = PATHS.subcategory(currentCategory || 'game', sub))}
              onAdd={addToCart}
            />
          )}
        </div>
      </main>

      <FooterRetro />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} onRemove={removeItem} />
    </div>
  );
}

function parseRoute(route) {
  // Supported: #/, #/category/:cat, #/category/:cat/:sub, #/product/:id
  if (route.startsWith('#/category')) {
    const parts = route.replace(/^#\//, '').split('/'); // ['category', ':cat', ':sub?']
    const currentCategory = decodeURIComponent(parts[1] || '');
    const currentSub = decodeURIComponent(parts[2] || '');
    return { currentCategory, currentSub, currentProductId: '' };
  }
  if (route.startsWith('#/product')) {
    const id = decodeURIComponent(route.split('/').pop() || '');
    return { currentCategory: '', currentSub: '', currentProductId: id };
  }
  return { currentCategory: '', currentSub: '', currentProductId: '' };
}

function ProductDetail({ id }) {
  return (
    <section className="min-h-[40vh]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product: {id}</h2>
        <a href="#/" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">Back</a>
      </div>
      <div className="mt-4 text-sm opacity-80">This is a focused product view. Pricing and inputs are available on the listing cards.</div>
    </section>
  );
}
