import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export interface NavGlassPillProps {
  brandName?: string;
  navItems?: string[];
  ctaText?: string;
  ctaHref?: string;
  bgColor?: string;
  bgOpacity?: number;
  blurAmount?: number;
  borderOpacity?: number;
  accentColor?: string;
  textColor?: string;
  maxWidth?: number;
  height?: number;
  borderRadius?: number;
  sticky?: boolean;
  showCta?: boolean;
  animationStyle?: "underline" | "highlight" | "slide";
}

const navStyles = `
  .nav-gp .nav-item {
    position: relative;
    text-decoration: none;
    transition: color 220ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .nav-gp[data-anim="underline"] .nav-item::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1.5px;
    border-radius: 1px;
    background: var(--nav-accent);
    transition: width 260ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .nav-gp[data-anim="underline"] .nav-item:hover::after { width: 100%; }
  .nav-gp[data-anim="highlight"] .nav-item {
    padding: 4px 10px; border-radius: 6px;
    transition: color 220ms ease, background 220ms ease;
  }
  .nav-gp[data-anim="highlight"] .nav-item:hover { background: var(--nav-accent-10); }
  .nav-gp[data-anim="slide"] .nav-item { transition: color 220ms ease, transform 220ms ease; }
  .nav-gp[data-anim="slide"] .nav-item:hover { transform: translateY(-2px); }
  .nav-gp[data-anim="slide"] .nav-item::after {
    content: ''; position: absolute;
    bottom: -3px; left: 50%;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--nav-accent);
    transform: translateX(-50%) scale(0);
    transition: transform 260ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .nav-gp[data-anim="slide"] .nav-item:hover::after { transform: translateX(-50%) scale(1); }
  .nav-gp .nav-cta {
    display: inline-flex; align-items: center; gap: 6px;
    text-decoration: none; border-radius: 50px;
    transition: background 240ms ease, color 240ms ease, transform 200ms ease, box-shadow 240ms ease;
  }
  .nav-gp .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px var(--nav-accent-25); }
  .nav-gp .mobile-overlay { animation: navGpFadeIn 300ms ease forwards; }
  @keyframes navGpFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .nav-gp .mobile-link {
    opacity: 0; transform: translateY(12px);
    animation: navGpSlideUp 400ms ease forwards;
  }
  @keyframes navGpSlideUp { to { opacity: 1; transform: translateY(0); } }
`;

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function NavGlassPill({
  brandName = "STUDIO",
  navItems = ["Work", "Services", "About", "Contact"],
  ctaText = "Get Started",
  ctaHref = "#contact",
  bgColor = "#0f0f16",
  bgOpacity = 0.65,
  blurAmount = 20,
  borderOpacity = 0.08,
  accentColor = "#6366f1",
  textColor = "#ffffff",
  maxWidth = 860,
  height = 52,
  borderRadius = 50,
  sticky = true,
  showCta = true,
  animationStyle = "underline",
}: NavGlassPillProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  const bgRgb = hexToRgb(bgColor);
  const accentRgb = hexToRgb(accentColor);
  const textRgb = hexToRgb(textColor);

  const cssVars = {
    "--nav-accent": accentColor,
    "--nav-accent-10": `rgba(${accentRgb}, 0.1)`,
    "--nav-accent-25": `rgba(${accentRgb}, 0.25)`,
  } as React.CSSProperties;

  return (
    <nav
      ref={navRef}
      className="nav-gp w-full flex justify-center px-3 sm:px-4 py-3 sm:py-4 z-50"
      data-anim={animationStyle}
      style={{ ...cssVars, position: sticky ? "sticky" : "relative", top: 0, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{navStyles}</style>
      <div
        className="flex items-center justify-between w-full gap-3 px-4 sm:px-5 md:px-7"
        style={{
          maxWidth, height,
          background: `rgba(${bgRgb}, ${bgOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          borderRadius,
          border: `1px solid rgba(${textRgb}, ${borderOpacity})`,
          boxShadow: scrolled ? `0 8px 32px rgba(0,0,0,0.25)` : `0 2px 12px rgba(0,0,0,0.08)`,
          transition: "box-shadow 300ms ease",
        }}
      >
        <a href="#" className="shrink-0 select-none"
          style={{ color: textColor, fontSize: "clamp(0.65rem, 1.6vw, 0.78rem)", fontWeight: 700, letterSpacing: "0.14em", textDecoration: "none", whiteSpace: "nowrap" }}>
          {brandName}
        </a>
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="nav-item"
              style={{ color: `rgba(${textRgb}, 0.5)`, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 0.95)`)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 0.5)`)}
            >{item}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {showCta && (
            <a href={ctaHref} className="nav-cta"
              style={{ background: accentColor, color: "#fff", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 18px" }}>
              {ctaText}<ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden cursor-pointer p-1 transition-colors duration-200"
          style={{ color: `rgba(${textRgb}, 0.5)` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 0.9)`)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 0.5)`)}
          aria-label="Toggle menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-overlay fixed inset-0 z-40 flex flex-col md:hidden"
          style={{ background: `rgba(${bgRgb}, 0.97)`, backdropFilter: `blur(${blurAmount * 1.5}px)`, WebkitBackdropFilter: `blur(${blurAmount * 1.5}px)` }}>
          <div className="flex justify-end p-5">
            <button onClick={() => setMobileOpen(false)} className="cursor-pointer p-1" style={{ color: `rgba(${textRgb}, 0.4)` }} aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-start justify-center px-10 gap-6">
            {navItems.map((item, idx) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="mobile-link flex items-center gap-4"
                style={{ color: `rgba(${textRgb}, 0.6)`, fontSize: "clamp(1.4rem, 5vw, 2.2rem)", fontWeight: 300, letterSpacing: "0.05em", textTransform: "uppercase", textDecoration: "none", animationDelay: `${idx * 60}ms` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 1)`)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `rgba(${textRgb}, 0.6)`)}>
                <span style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", color: `rgba(${textRgb}, 0.15)` }}>0{idx + 1}</span>
                {item}
              </a>
            ))}
          </div>
          {showCta && (
            <div className="px-10 pb-10">
              <a href={ctaHref} onClick={() => setMobileOpen(false)} className="nav-cta inline-flex"
                style={{ background: accentColor, color: "#fff", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 24px" }}>
                {ctaText}<ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
