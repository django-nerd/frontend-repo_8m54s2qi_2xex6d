export default function FooterRetro() {
  return (
    <footer className="relative mt-16">
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/30 via-pink-500/20 to-cyan-500/30 blur-2xl" />
      <div className="relative max-w-6xl mx-auto px-6 py-10 text-pink-100/85">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-white font-bold text-lg">Digital Store Hub</div>
            <p className="text-sm mt-2 opacity-80">A modern yet nostalgic store for all your digital needs. Game top-ups, premium subscriptions, data packages, and PPOB services.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <ul className="text-sm mt-2 space-y-1 opacity-80">
              <li>Email: support@digitalhub.store</li>
              <li>WhatsApp: +62 812-3456-7890</li>
              <li>Instagram: @digitalhub.store</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white">Payments</div>
            <p className="text-sm mt-2 opacity-80">QRIS, GoPay, OVO, DANA, ShopeePay, Bank Transfer, Virtual Account</p>
          </div>
        </div>
        <div className="mt-8 text-xs opacity-70">© {new Date().getFullYear()} Digital Store Hub. All rights reserved.</div>
      </div>
    </footer>
  );
}
