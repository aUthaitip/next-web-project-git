'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Trigger check on mount in case page is already scrolled
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={`scroll-to-top${isVisible ? ' visible' : ''}`}
      onClick={scrollToTop}
      aria-label="เลื่อนขึ้นบนสุด"
      title="เลื่อนขึ้นบนสุด"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
