import React, { useState, useEffect, useRef, useCallback } from "react";

export interface NavBrutalistHybridProps {
  brandName?: string;
  brandIcon?: boolean;
  primaryLinks?: string[];
  allLinks?: string[];
  overlayFooterLines?: string[];
  pillBg?: string;
  textColor?: string;
  textOpacity?: number;
  showBullets?: boolean;
  barHeight?: number;
  overlayBg?: string;
  overlayTextSize?: number;
  pillMaxWidth?: number;
  pillRadius?: number;
  linkSpacing?: number;
  hoverStyle?: "underline-left" | "underline-center" | "opacity";
  scrambleSpeed?: number;
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";

function useTextScramble(original: string, speed: number = 40) {
  const [display, setDisplay] = useState(original);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    if (!isHovering.current) setDisplay(original);
  }, [original]);

  const scramble = useCallback(() => {
    isHovering.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const target = original.toUpperCase();
    let iteration = 0;
    const totalLen = target.length;
    intervalRef.current = setInterval(() => {
      const resolved = Math.floor(iteration);
      const result = target.split("").map((char, i) => {
        if (char === " " || char === ".") return char;
        if (i < resolved) return target[i];
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join("");
      setDisplay(result);
      if (resolved >= totalLen) {
        setDisplay(target);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 0.8;
    }, speed);
  }, [original, speed]);

  const reset = useCallback(() => {
    isHovering.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(original.toUpperCase());
  }, [original]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return { display, scramble, reset };
}

function ScrambleLink({ text, href, speed, bullet, className, style, hoverColor, restColor, onClick }: {
  text: string; href: string; speed: number; bullet?: React.ReactNode;
  className?: string; style?: React.CSSProperties;
  hoverColor: string; restColor: string; onClick?: () => void;
}) {
  const { display, scramble, reset } = useTextScramble(text, speed);
  return (
    <a href={href} className={className} style={{ ...style, color: restColor }} onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; scramble(); }}
      onMouseLeave={(e) => { e.currentTarget.style.color = restColor; reset(); }}>
      {bullet}
      <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace" }}>{display}</span>
    </a>
  );
}

const injectStyles = `
  .nav-bh .topbar-link { position: relative; text-decoration: none; transition: opacity 220ms ease; }
  .nav-bh[data-hover="underline-left"] .topbar-link::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px; background: currentColor;
    transition: width 240ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .nav-bh[data-hover="underline-left"] .topbar-link:hover::after { width: 100%; }
  .nav-bh[data-hover="underline-center"] .topbar-link::after {
    content: ''; position: absolute; bottom: -2px; left: 50%;
    width: 0; height: 1px; background: currentColor;
    transition: width 240ms cubic-bezier(0.25, 0.1, 0.25, 1), left 240ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .nav-bh[data-hover="underline-center"] .topbar-link:hover::after { width: 100%; left: 0; }
  .nav-bh .burger-line {
    display: block; width: 18px; height: 1.5px; background: currentColor;
    transition: transform 280ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 200ms ease;
    transform-origin: center;
  }
  .nav-bh .burger-open .burger-line:nth-child(1) { transform: translateY(5.75px) rotate(45deg); }
  .nav-bh .burger-open .burger-line:nth-child(2) { opacity: 0; }
  .nav-bh .burger-open .burger-line:nth-child(3) { transform: translateY(-5.75px) rotate(-45deg); }
  .nav-bh .menu-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 420ms cubic-bezier(0.25, 0.1, 0.25, 1); }
  .nav-bh .menu-body.open { grid-template-rows: 1fr; }
  .nav-bh .menu-body-inner { overflow: hidden; }
  .nav-bh .overlay-link { opacity: 0; transform: translateY(8px); transition: opacity 300ms ease, transform 300ms ease; }
  .nav-bh .menu-body.open .overlay-link { opacity: 1; transform: translateY(0); }
`;

export function NavBrutalistHybrid({
  brandName = "IZUM.STUDY",
  brandIcon = true,
  primaryLinks = ["Program", "Price", "Contacts"],
  allLinks = ["Taptop", "Program", "Price", "Result", "Who We Are", "Reviews", "FAQ", "Contacts"],
  overlayFooterLines = ["Channel: @izum_study", "For questions: @dzimitry1"],
  pillBg = "#1a1a1f",
  textColor = "#ffffff",
  textOpacity = 0.75,
  showBullets = true,
  barHeight = 48,
  overlayBg = "#1a1a1f",
  overlayTextSize = 20,
  pillMaxWidth = 620,
  pillRadius = 8,
  linkSpacing = 24,
  hoverStyle = "underline-left",
  scrambleSpeed = 35,
}: NavBrutalistHybridProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scrollParent: HTMLElement | Window = window;
    let el: HTMLElement | null = container.parentElement;
    while (el) {
      const style = getComputedStyle(el);
      if (/(auto|scroll)/.test(style.overflow + style.overflowY)) { scrollParent = el; break; }
      el = el.parentElement;
    }
    const onScroll = () => {
      const st = scrollParent instanceof Window ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
      setScrolled(st > 30);
    };
    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = useCallback(() => setMenuOpen(false), []);
  const textRgb = hexToRgb(textColor);

  const BrandIcon = () => (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <circle cx="9" cy="3" r="2.5" fill={textColor} opacity="0.9" />
      <circle cx="4" cy="12" r="2.5" fill={textColor} opacity="0.9" />
      <circle cx="14" cy="12" r="2.5" fill={textColor} opacity="0.9" />
    </svg>
  );

  const bulletTop = showBullets ? <span style={{ fontSize: "0.55rem", opacity: 0.4, flexShrink: 0 }}>◇</span> : null;
  const bulletOverlay = showBullets ? <span style={{ fontSize: "0.6rem", opacity: 0.3, lineHeight: 1, flexShrink: 0 }}>◦</span> : null;

  return (
    <div ref={containerRef} className="nav-bh relative w-full" data-hover={hoverStyle} style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{injectStyles}</style>

      {menuOpen && (
        <div className="absolute inset-0" style={{ zIndex: 19, minHeight: "100vh" }} onClick={() => setMenuOpen(false)} />
      )}

      <div className="sticky top-0 left-0 right-0 flex justify-center" style={{ paddingTop: 10, paddingLeft: 16, paddingRight: 16, zIndex: 20 }}>
        <div className="w-full transition-all duration-300" style={{
          maxWidth: pillMaxWidth,
          background: `rgba(${hexToRgb(menuOpen ? overlayBg : pillBg)}, ${menuOpen ? 0.75 : scrolled ? 0.7 : 0.55})`,
          borderRadius: pillRadius,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid rgba(${textRgb}, 0.06)`,
        }}>
          <div className="flex items-center justify-between" style={{ height: barHeight, paddingLeft: 16, paddingRight: 12 }}>
            <a href="#" className="flex items-center gap-2 select-none" style={{ textDecoration: "none" }}>
              {brandIcon && <BrandIcon />}
              <span style={{ color: textColor, fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.13em", textTransform: "uppercase" as const }}>
                {brandName}
              </span>
            </a>

            <div className="flex items-center" style={{ gap: linkSpacing }}>
              {!menuOpen && (
                <div className="hidden md:flex items-center" style={{ gap: linkSpacing }}>
                  {primaryLinks.map((link) => (
                    <ScrambleLink key={link} text={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      speed={scrambleSpeed} bullet={bulletTop}
                      className="topbar-link flex items-center gap-1.5"
                      style={{ fontSize: "0.65rem", fontWeight: 450, letterSpacing: "0.12em", textTransform: "uppercase" as const, textDecoration: "none" }}
                      restColor={`rgba(${textRgb}, ${textOpacity})`}
                      hoverColor={`rgba(${textRgb}, 1)`}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={`cursor-pointer flex flex-col justify-center items-center gap-[4px] p-2 transition-colors ${menuOpen ? "burger-open" : ""}`}
                style={{ color: `rgba(${textRgb}, ${menuOpen ? 1 : textOpacity})`, background: "none", border: "none" }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onMouseEnter={(e) => { e.currentTarget.style.color = `rgba(${textRgb}, 1)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = `rgba(${textRgb}, ${menuOpen ? 1 : textOpacity})`; }}
              >
                <span className="burger-line" />
                <span className="burger-line" />
                <span className="burger-line" />
              </button>
            </div>
          </div>

          <div className={`menu-body ${menuOpen ? "open" : ""}`}>
            <div className="menu-body-inner">
              <div style={{ height: 1, background: `rgba(${textRgb}, 0.06)`, marginLeft: 16, marginRight: 16 }} />
              <div className="flex flex-col items-center justify-center" style={{ padding: "clamp(28px, 5vh, 48px) 24px" }}>
                <div className="flex flex-col items-center" style={{ gap: "clamp(10px, 2vh, 18px)" }}>
                  {allLinks.map((link, idx) => (
                    <ScrambleLink key={link} text={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      speed={scrambleSpeed} bullet={bulletOverlay}
                      className="overlay-link flex items-center gap-2.5"
                      style={{
                        fontSize: `clamp(${overlayTextSize * 0.75}px, 2.2vw, ${overlayTextSize}px)`,
                        fontWeight: 450, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                        textDecoration: "none", lineHeight: 1.3,
                        transitionDelay: menuOpen ? `${60 + idx * 40}ms` : "0ms",
                      }}
                      restColor={`rgba(${textRgb}, 0.85)`}
                      hoverColor={`rgba(${textRgb}, 1)`}
                      onClick={handleLinkClick}
                    />
                  ))}
                </div>
              </div>
              {overlayFooterLines.length > 0 && (
                <div className="flex flex-col items-center gap-1"
                  style={{ padding: "clamp(16px, 3vh, 28px) 24px", borderTop: `1px solid rgba(${textRgb}, 0.05)` }}>
                  {overlayFooterLines.map((line, idx) => (
                    <span key={idx} style={{ color: `rgba(${textRgb}, 0.3)`, fontSize: "0.6rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
