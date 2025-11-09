import { Gamepad2, Diamond, Smartphone, Zap } from 'lucide-react';

const categories = [
  { id: 'game', name: 'Game Top-up', icon: Gamepad2, color: 'from-fuchsia-400 to-pink-400' },
  { id: 'apps', name: 'Premium Apps', icon: Diamond, color: 'from-cyan-400 to-sky-400' },
  { id: 'data', name: 'Internet Packages', icon: Smartphone, color: 'from-emerald-400 to-lime-400' },
  { id: 'ppob', name: 'PPOB Services', icon: Zap, color: 'from-amber-400 to-orange-400' },
];

export default function CategoryGrid({ onSelect }) {
  return (
    <section id="shop" className="relative py-14 sm:py-16 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-50 drop-shadow mb-6">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="group relative p-5 rounded-3xl text-left bg-white/5 border border-white/10 text-pink-50 shadow-[10px_10px_20px_rgba(0,0,0,0.35),_-10px_-10px_20px_rgba(255,255,255,0.06)] hover:translate-y-[-2px] transition"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg mb-4`}>
                  <Icon size={22} />
                </div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-pink-100/70 mt-1">Tap to view products</div>
                <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/6 to-transparent" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
