'use client';

import { useEffect } from 'react';

/**
 * Applies the saved or system-preferred theme before hydration.
 * Rendered inline in <head> via dangerouslySetInnerHTML in the root layout
 * to avoid flash-of-wrong-theme. This component exists only to re-subscribe
 * to storage events so cross-tab toggles stay in sync.
 */
export function ThemeScript() {
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = stored === 'dark' || (stored === null && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return null;
}

/**
 * Inline script that runs before React hydrates to set the theme class.
 * Injected via dangerouslySetInnerHTML in the root <html> layout.
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (stored === null && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`.trim();
