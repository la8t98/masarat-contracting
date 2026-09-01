import { Globe2, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { company, navigation, siteCopy, type Language } from "../data/siteContent";
import { BrandMark } from "./BrandMark";

type HeaderProps = {
  language: Language;
  onLanguageChange: () => void;
};

export function Header({ language, onLanguageChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const copy = siteCopy[language];

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 18);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const navigate = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}${open ? " site-header--open" : ""}`}>
      <div className="site-header__inner container">
        <BrandMark language={language} inverse={!scrolled} />
        <nav className="desktop-nav" aria-label={copy.menu}>
          {navigation.map((item) => (
            <button type="button" key={item.id} onClick={() => navigate(item.id)}>
              {item[language]}
            </button>
          ))}
        </nav>
        <div className="site-header__actions">
          <button className="language-toggle" type="button" onClick={onLanguageChange} aria-label={`Switch language to ${copy.languageSwitch}`}>
            <Globe2 size={16} strokeWidth={1.7} />
            <span>{copy.languageSwitch}</span>
          </button>
          <a className="header-whatsapp" href={company.whatsappUrl} target="_blank" rel="noreferrer" aria-label={copy.openWhatsapp}>
            <MessageCircle size={17} strokeWidth={1.8} />
            <span>{copy.whatsappCta}</span>
          </a>
          <button className="mobile-menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={copy.menu}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label={copy.menu}>
        {navigation.map((item, index) => (
          <button type="button" key={item.id} onClick={() => navigate(item.id)} style={{ transitionDelay: `${index * 35}ms` }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item[language]}
          </button>
        ))}
        <a href={company.whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> {copy.whatsappCta}
        </a>
      </nav>
    </header>
  );
}
