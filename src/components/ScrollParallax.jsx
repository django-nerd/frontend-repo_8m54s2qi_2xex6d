import { useEffect, useRef } from 'react';

// Simple scroll-based parallax wrapper. Wrap children layers with data-speed attribute (-1..1)
export default function ScrollParallax({ className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const layers = Array.from(root.querySelectorAll('[data-speed]'));

    const onScroll = () => {
      const top = root.getBoundingClientRect().top;
      layers.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0');
        const y = -top * speed;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
