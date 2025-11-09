import { Home } from 'lucide-react';

const TITLE_MAP = {
  category: 'Category',
  sub: 'Subcategory',
  product: 'Product',
  admin: 'Admin',
  users: 'Users',
  salary: 'Salary',
  settings: 'Settings',
};

function cap(s) {
  if (!s) return '';
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function Breadcrumbs({ route }) {
  // route like '#/category/game/mobile%20legends'
  const parts = (route.replace(/^#\//, '') || '').split('/').filter(Boolean);

  const crumbs = [];
  let href = '#/';
  if (parts.length === 0) {
    crumbs.push({ label: 'Home', href: '#/' });
  } else {
    crumbs.push({ label: 'Home', href: '#/' });
    parts.forEach((p, idx) => {
      href += (idx === 0 ? '' : '/') + p;
      const label = TITLE_MAP[p] || cap(decodeURIComponent(p));
      crumbs.push({ label, href: `#/${parts.slice(0, idx + 1).join('/')}` });
    });
  }

  return (
    <nav className="w-full bg-white/5 border-y border-white/10 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-pink-100/80 overflow-x-auto no-scrollbar">
        <a href="#/" className="inline-flex items-center gap-1 shrink-0 hover:text-white transition"><Home size={14} /><span>Home</span></a>
        {crumbs.slice(1).map((c, i) => (
          <span key={c.href} className="inline-flex items-center gap-2 shrink-0">
            <span className="opacity-50">/</span>
            <a href={c.href} className={`hover:text-white transition ${i === crumbs.length - 2 ? 'text-white font-medium' : ''}`}>{c.label}</a>
          </span>
        ))}
      </div>
    </nav>
  );
}
