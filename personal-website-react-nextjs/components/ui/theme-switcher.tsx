'use client';
import { useTheme } from 'next-themes';

const themes = ['system', 'light', 'dark'];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      id="theme-switcher-select"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
