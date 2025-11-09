import { useMemo } from 'react';
import { X } from 'lucide-react';

export default function CartDrawer({ open, onClose, items, onRemove }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#17162a] text-pink-50 border-l border-white/10 shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="font-semibold">Your Cart</div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-xl bg-white/10 border border-white/15"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 && (
            <div className="text-sm text-pink-100/70">Cart is empty. Add some products.</div>
          )}
          {items.map((item)=> (
            <div key={item.id+item.meta} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <img src={item.logo} alt={item.name} className="w-8 h-8" />
                <div className="flex-1">
                  <div className="font-medium leading-tight">{item.name}</div>
                  <div className="text-xs text-pink-100/70">{item.meta}</div>
                </div>
                <div className="text-sm">x{item.qty}</div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="text-pink-100/80">Rp {(item.price*item.qty).toLocaleString('id-ID')}</div>
                <button onClick={()=>onRemove(item)} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-pink-100/80">Total</div>
            <div className="font-semibold">Rp {total.toLocaleString('id-ID')}</div>
          </div>
          <a href="#/checkout" onClick={onClose} className="mt-4 block text-center w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-medium shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.05)] hover:scale-[1.01] transition">Checkout</a>
        </div>
      </aside>
    </div>
  );
}
