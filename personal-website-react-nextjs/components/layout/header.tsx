import ThemeSwitcher from '../ui/theme-switcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex">
      <h1 className="text-2xl font-bold">header</h1>
      <ThemeSwitcher />
    </header>
  );
}
