import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slidesDefault = [
  {
    title: 'Top-up Games Faster',
    subtitle: 'Mobile Legends, Free Fire, and more',
    color: 'from-fuchsia-500/30 via-pink-400/20 to-cyan-400/30',
  },
  {
    title: 'Premium Subscriptions',
    subtitle: 'Netflix, Spotify, Disney+ Hotstar',
    color: 'from-emerald-500/30 via-teal-400/20 to-lime-400/30',
  },
  {
    title: 'Data & PPOB',
    subtitle: 'Internet, PLN, PLN Token, and Bills',
    color: 'from-amber-500/30 via-orange-400/20 to-rose-400/30',
  },
];

export default function Carousel({ slides = slidesDefault, interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(timer.current);
  }, [slides.length, interval]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className="min-w-full h-40 sm:h-52 md:h-64 relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${s.color}`} />
            <div className="absolute inset-0 p-6 flex flex-col items-start justify-center text-white">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow">{s.title}</div>
              <div className="text-xs sm:text-sm opacity-80">{s.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      <button aria-label="Prev" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-xl bg-white/10 border border-white/15 text-white"><ChevronLeft size={16} /></button>
      <button aria-label="Next" onClick={() => setIndex((i) => (i + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-xl bg-white/10 border border-white/15 text-white"><ChevronRight size={16} /></button>
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}
