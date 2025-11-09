import { useEffect, useRef } from 'react';
import { Sun, Moon, ShoppingCart } from 'lucide-react';
import Spline from '@splinetool/react-spline';

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
    <section className="relative min-h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Spline 3D background as full-width cover */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/S4k-6fqjuV5AuVZe/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft UI retro overlays (non-blocking) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(255,255,255,0.04), transparent 60%), radial-gradient(ellipse at bottom, rgba(0,0,0,0.35), transparent 60%)',
        }}
      />

      {/* Neon glow horizon (non-blocking) */}
      <Layer speed={0.01} className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-orange-500/25 via-pink-400/10 to-transparent blur-2xl" />

      {/* Pixel skyline silhouette (non-blocking) */}
      <Layer speed={0.015} className="pointer-events-none absolute bottom-0 inset-x-0 h-40 opacity-60">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200">
          <rect x="0" y="120" width="80" height="80" fill="#2e2b3f" />
          <rect x="90" y="100" width="60" height="100" fill="#3a3552" />
          <rect x="170" y="140" width="90" height="60" fill="#2b2745" />
          <rect x="280" y="90" width="70" height="110" fill="#433a6b" />
          <rect x="360" y="130" width="120" height="70" fill="#2b2745" />
          <rect x="500" y="110" width="90" height="90" fill="#3a3552" />
          <rect x="610" y="140" width="120" height="60" fill="#2e2b3f" />
          <rect x="750" y="100" width="70" height="100" fill="#433a6b" />
          <rect x="830" y="120" width="90" height="80" fill="#2b2745" />
          <rect x="930" y="130" width="120" height="70" fill="#3a3552" />
          <rect x="1070" y="100" width="80" height="100" fill="#2e2b3f" />
        </svg>
      </Layer>

      {/* Glow orbs (non-blocking) */}
      <Layer speed={0.03} className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-orange-400/25 blur-3xl" />
      <Layer speed={0.04} className="pointer-events-none absolute top-20 -right-10 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl" />

      {/* Header actions */}
      <div className="relative z-10 w-full top-4 left-0 right-0 px-6 flex items-center justify-between">
        <div className="text-emerald-300/90 font-semibold tracking-widest uppercase text-xs drop-shadow">Retro • SoftUI</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-emerald-50 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur border border-white/10"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}<span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-emerald-50 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur border border-white/10"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-lg">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight select-none">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-200 via-emerald-300 to-cyan-200 drop-shadow-[0_0_20px_rgba(0,255,170,0.35)]">
            Digital Store Hub
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-emerald-100/85">
          Soft UI + retro workstation vibe for top-ups, data packs, and digital goods.
        </p>
        <div className="mt-6 inline-flex gap-3">
          <a
            href="#shop"
            className="px-5 py-3 rounded-2xl text-sm font-medium text-emerald-50 bg-white/10 border border-white/10 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.25),_inset_-6px_-6px_12px_rgba(255,255,255,0.06)] hover:brightness-110 transition"
          >
            Start Shopping
          </a>
          <a
            href="#/admin"
            className="px-5 py-3 rounded-2xl text-sm font-medium text-emerald-50 bg-gradient-to-r from-orange-500 to-emerald-500 shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] hover:scale-[1.02] transition will-change-transform"
          >
            Admin
          </a>
        </div>
      </div>
    </section>
  );
}
