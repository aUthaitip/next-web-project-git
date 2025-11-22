"use client";
import { useEffect } from 'react';

/**
 * HideHeader: hides specific header elements (logo, nav, header-actions)
 * but keeps the `.navbar` bar visible. Restores original inline styles on unmount.
 */
export default function HideHeader() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    // Keep the .navbar and the .logo visible. Hide navigation and other actions.
    const navbar = header.querySelector('.navbar') as HTMLElement | null;
    const logo = header.querySelector('.logo') as HTMLElement | null;

    const toHide = Array.from(
      header.querySelectorAll('nav, .nav-links, .header-actions, .dropdown')
    ) as HTMLElement[];

    // Save previous inline display values so we can restore them on cleanup
    const prevDisplays = toHide.map((el) => ({ el, display: el.style.display }));
    const prevNavbarPosition = navbar ? navbar.style.position : '';

    toHide.forEach((el) => {
      el.style.display = 'none';
    });

    // Ensure navbar can position the logout button at the right
    if (navbar) {
      const computed = window.getComputedStyle(navbar).position;
      if (computed === 'static') {
        navbar.style.position = 'relative';
      }

      // Create logout link/button and place it at the far right
      const logout = document.createElement('a');
      logout.setAttribute('href', '/');
      logout.textContent = 'ออกจากระบบ';
      logout.className = 'admin-logout-btn';
      // Basic inline styles to position the button and make it look clickable
      Object.assign(logout.style, {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '8px 12px',
        background: '#e74c3c',
        color: '#fff',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: '600',
        cursor: 'pointer',
      });

      // If logo exists, ensure it's visible (sometimes inline style may hide it)
      if (logo) {
        logo.style.display = '';
      }

      navbar.appendChild(logout);

      return () => {
        // restore hidden elements' display
        prevDisplays.forEach(({ el, display }) => {
          el.style.display = display || '';
        });
        // remove injected logout
        if (logout && logout.parentElement) logout.parentElement.removeChild(logout);
        // restore navbar position
        if (navbar) navbar.style.position = prevNavbarPosition || '';
      };
    }

    // If there's no navbar, fallback restore only the hidden elements
    return () => {
      prevDisplays.forEach(({ el, display }) => {
        el.style.display = display || '';
      });
    };
  }, []);

  return null;
}
