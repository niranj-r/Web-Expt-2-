import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="themeToggleBtn"
      onClick={toggleTheme}
      title="Toggle Light / Dark Brutalist Theme"
      className="theme-toggle-btn"
    >
      {theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE'}
    </button>
  );
};

export default ThemeToggle;
