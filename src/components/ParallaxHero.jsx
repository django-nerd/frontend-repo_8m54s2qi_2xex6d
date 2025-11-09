import { useEffect, useRef } from 'react';
import { Sun, Moon, ShoppingCart } from 'lucide-react';

function Layer({ className = '', speed = 0.03 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) * speed;
      const y = (e.clientY - innerHeight / 2) * speed;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [speed]);

  return <div ref={ref} className={className} />;
}

export default function ParallaxHero({ onToggleTheme, darkMode, cartCount, onOpenCart }) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden flex items-center justify-center">
      {/* Background gradient + grain */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1020] via-[#1b1e3b] to-[#26244a] dark:from-[#0a0b14] dark:via-[#121329] dark:to-[#181738]" />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(255,255,255,0.08), transparent 60%), radial-gradient(ellipse at bottom, rgba(0,0,0,0.3), transparent 60%)",
      }} />

      {/* Neon horizon */}
      <Layer speed={0.01} className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-fuchsia-500/30 via-pink-400/10 to-transparent blur-2xl" />

      {/* Pixel skyline silhouette */}
      <Layer speed={0.015} className="absolute bottom-0 inset-x-0 h-40 opacity-60">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200">
          <rect x="0" y="120" width="80" height="80" fill="#3f3a72" />
          <rect x="90" y="100" width="60" height="100" fill="#433d7e" />
          <rect x="170" y="140" width="90" height="60" fill="#3b366d" />
          <rect x="280" y="90" width="70" height="110" fill="#4a428f" />
          <rect x="360" y="130" width="120" height="70" fill="#3b366d" />
          <rect x="500" y="110" width="90" height="90" fill="#433d7e" />
          <rect x="610" y="140" width="120" height="60" fill="#3f3a72" />
          <rect x="750" y="100" width="70" height="100" fill="#4a428f" />
          <rect x="830" y="120" width="90" height="80" fill="#3b366d" />
          <rect x="930" y="130" width="120" height="70" fill="#433d7e" />
          <rect x="1070" y="100" width="80" height="100" fill="#3f3a72" />
        </svg>
      </Layer>

      {/* Glow orbs */}
      <Layer speed={0.03} className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <Layer speed={0.04} className="absolute top-20 -right-10 w-80 h-80 rounded-full bg-cyan-400/30 blur-3xl" />

      {/* Header actions */}
      <div className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between">
        <div className="text-pink-200/90 font-semibold tracking-widest uppercase text-xs drop-shadow">Retro • SoftUI</div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-pink-50 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur border border-white/10">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}<span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button onClick={onOpenCart} className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-pink-50 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur border border-white/10">
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500 text-white shadow-lg">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight select-none">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-fuchsia-400 to-cyan-300 drop-shadow-[0_0_20px_rgba(255,0,255,0.35)]">
            Digital Store Hub
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-pink-100/80">
          Modern yet nostalgic place for game top-ups, premium apps, data packages, and PPOB services.
        </p>
        <div className="mt-6 inline-flex gap-3">
          <a href="#shop" className="px-5 py-3 rounded-2xl text-sm font-medium text-pink-50 bg-white/10 border border-white/10 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.25),_inset_-6px_-6px_12px_rgba(255,255,255,0.06)] hover:brightness-110 transition">Start Shopping</a>
          <a href="#/admin" className="px-5 py-3 rounded-2xl text-sm font-medium text-pink-50 bg-gradient-to-r from-fuchsia-600 to-cyan-500 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] hover:scale-[1.02] transition will-change-transform">Admin</a>
        </div>
      </div>
    </section>
  );
}
