import { useMemo, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'ml_86', category: 'game', sub: 'Mobile Legends', name: '86 Diamonds', price: 25000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mobilelegends.svg', inputLabel: 'Player ID' },
  { id: 'ff_140', category: 'game', sub: 'Free Fire', name: '140 Diamonds', price: 27000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/garena.svg', inputLabel: 'Player ID' },
  { id: 'spotify_prem', category: 'apps', sub: 'Spotify', name: 'Premium 1 Month', price: 54000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg', inputLabel: 'Email' },
  { id: 'netflix_prem', category: 'apps', sub: 'Netflix', name: 'Premium 1 Month', price: 65000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg', inputLabel: 'Email' },
  { id: 'data_10', category: 'data', sub: 'Telkomsel', name: 'Data 10GB', price: 45000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telkomsel.svg', inputLabel: 'Phone Number' },
  { id: 'pln_20', category: 'ppob', sub: 'PLN', name: 'Token 20k', price: 22000, logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lightning.svg', inputLabel: 'Meter Number' },
];

const SUBCATS = {
  game: ['Mobile Legends', 'Free Fire'],
  apps: ['Spotify', 'Netflix'],
  data: ['Telkomsel'],
  ppob: ['PLN'],
};

export default function ProductSection({ activeCategory, onAdd }) {
  const [activeSub, setActiveSub] = useState('');

  const products = useMemo(() => {
    const base = MOCK_PRODUCTS.filter((p) => !activeCategory || p.category === activeCategory);
    if (!activeSub) return base;
    return base.filter((p) => p.sub === activeSub);
  }, [activeCategory, activeSub]);

  const subs = SUBCATS[activeCategory] || [];

  return (
    <section className="relative py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-pink-50">Products</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {subs.map((s) => (
              <button key={s} onClick={() => setActiveSub(s)} className={`px-3 py-2 rounded-full text-sm border transition shadow-[inset_6px_6px_12px_rgba(0,0,0,0.2),_inset_-6px_-6px_12px_rgba(255,255,255,0.06)] ${activeSub===s? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-pink-100/80'}`}>{s}</button>
            ))}
            {subs.length>0 && (
              <button onClick={() => setActiveSub('')} className={`px-3 py-2 rounded-full text-sm border transition ${activeSub===''? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-pink-100/80'}`}>All</button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd }) {
  const [value, setValue] = useState('');
  const [qty, setQty] = useState(1);
  const price = product.price * qty;

  return (
    <div className="relative p-5 rounded-3xl bg-white/5 border border-white/10 text-pink-50 shadow-[10px_10px_20px_rgba(0,0,0,0.35),_-10px_-10px_20px_rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3">
        <img src={product.logo} alt={product.name} className="w-10 h-10 object-contain drop-shadow" />
        <div>
          <div className="font-semibold leading-tight">{product.name}</div>
          <div className="text-xs text-pink-100/70">{product.sub}</div>
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs text-pink-100/80">{product.inputLabel}</label>
        <input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={product.inputLabel} className="mt-1 w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-fuchsia-400/40 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.25),_inset_-8px_-8px_16px_rgba(255,255,255,0.06)]" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-pink-100/80">Rp {price.toLocaleString('id-ID')}</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setQty(Math.max(1, qty-1))} className="w-8 h-8 grid place-items-center rounded-xl bg-white/10 border border-white/15"><Minus size={14} /></button>
          <span className="min-w-[2ch] text-center">{qty}</span>
          <button onClick={()=>setQty(qty+1)} className="w-8 h-8 grid place-items-center rounded-xl bg-white/10 border border-white/15"><Plus size={14} /></button>
        </div>
      </div>
      <button
        onClick={()=> onAdd({ ...product, qty, meta: value })}
        className="mt-4 w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-medium shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] hover:scale-[1.01] transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
