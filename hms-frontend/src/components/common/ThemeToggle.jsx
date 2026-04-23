import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button 
      className="theme-toggle-btn"
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <MdLightMode size={22} className="text-warning" /> : <MdDarkMode size={22} className="text-accent" />}
      
      <style>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .theme-toggle-btn:hover {
          background: var(--color-bg-card-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </button>
  );
}
