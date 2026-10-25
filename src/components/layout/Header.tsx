import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PLAYER } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { BrandMark } from "../ui/BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { copy } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const navigation = [
    { href: "#perfil", label: copy.nav.player },
    { href: "#trayectoria", label: copy.nav.career },
    { href: "#media", label: copy.nav.media },
    { href: "#seguimiento", label: copy.nav.news },
  ];
  return (
    <header className="header">
      <a
        href="#inicio"
        aria-label={copy.accessibility.home}
        className="brand"
        onClick={closeMenu}
      >
        <BrandMark />
        <span>
          {PLAYER.firstName.toUpperCase()}
          <br />
          <strong>{PLAYER.lastName.toUpperCase()}</strong>
        </span>
      </a>
      <nav
        id="mobile-navigation"
        aria-label={copy.accessibility.navigation}
        className={menuOpen ? "nav is-open" : "nav"}
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href="#contacto" className="mobile-contact" onClick={closeMenu}>
          {copy.nav.contact}
        </a>
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <a className="header-contact" href="#contacto">
          {copy.nav.talk}
          <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-button icon-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? copy.accessibility.closeMenu
              : copy.accessibility.openMenu
          }
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
