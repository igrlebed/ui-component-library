import React, { useMemo, useState } from "react";
import { ScrollText, Copy, Check } from "lucide-react";
import type { StoryConfig } from "./storyData";

interface PromptPanelProps {
  story: StoryConfig;
  currentProps: Record<string, any>;
}

function generateCinematicNavPrompt(props: Record<string, any>): string {
  const p = props;
  return `Create a full-screen (100vh, min-height 540px) cinematic dark hero section as a single React component using TypeScript, Tailwind CSS, and raw Three.js (via a canvas ref — no @react-three/fiber, no drei). The component must be self-contained and accept all visual parameters as optional props with sensible defaults.

## 1. Overall Layout & Background
- Background: radial gradient from \`${p.bgColor}\` brightest at center (50% 60%), fading to \`#0a0a0f\` at edges.
- Warm radial glow overlay that intensifies as scroll-progress increases.

## 2. 3D Particle Sphere (WebGL via Three.js)
- **${p.particleCount} particles**, Fibonacci-distributed on sphere radius **${p.sphereRadius}** with ±5% jitter.
- Scattered origins: radius 3.5–7.5, random angle, y offset 1.5–5.0.
- GLSL uniforms: uProgress (0→1 assembly), uTime, uPixelRatio, uSize (**${p.particleSize}**), uRotationSpeed (**${p.rotationSpeed}**), uNoiseStrength (**${p.noiseStrength}**), uFloatAmplitude (**${p.floatAmplitude}**).
- Per-particle stagger: starts at aRandom * 0.35, cubic ease-in-out.
- Scattered particles float/bob at amplitude **${p.floatAmplitude}**.
- Simplex noise displacement on sphere surface: **${p.noiseStrength}**.
- Assembled sphere rotates around Y at **${p.rotationSpeed}** (scaled by progress).
- Colors: core **${p.colorCore}**, outer **${p.colorOuter}**, additive blending, no depth write.
- Smooth scroll via lerp factor **${p.assemblySmoothing}** on wheel/touch events.
- Responsive particle size: 14px <480px, 18px <768px, 22px <1024px, ${p.particleSize}px otherwise.

## 3. Floating Pill Navbar
- Max-width 720px, pill-shaped (border-radius 50px), backdrop-filter blur(16px).
- Brand: **“${p.brandName}”**, weight 600, letter-spacing 0.15em.
- Desktop links with diamond ◇ marker, underline hover animation.
- Mobile: hamburger toggling fullscreen overlay with numbered links and social pills.

## 4. Hero Content (Bottom-Anchored)
- Headline 3 lines: “${p.headlineLine1}” / “${p.headlineLine2}” / “${p.headlineLine3}”. clamp(1.8rem, 7vw, 6.5rem), weight 800.
- Bottom bar: scroll hint [${p.scrollHintLabel}] with bounce arrow, social pill links, CTA “${p.ctaText}” (soft-inversion hover), fullscreen toggle.

## 5. Props Interface
\`\`\`ts
interface HeroCinematicNavProps {
  brandName?: string;           // “${p.brandName}”
  headlineLine1?: string;       // “${p.headlineLine1}”
  headlineLine2?: string;       // “${p.headlineLine2}”
  headlineLine3?: string;       // “${p.headlineLine3}”
  ctaText?: string;             // “${p.ctaText}”
  particleCount?: number;       // ${p.particleCount}
  sphereRadius?: number;        // ${p.sphereRadius}
  particleSize?: number;        // ${p.particleSize}
  colorCore?: string;           // “${p.colorCore}”
  colorOuter?: string;          // “${p.colorOuter}”
  rotationSpeed?: number;       // ${p.rotationSpeed}
  noiseStrength?: number;       // ${p.noiseStrength}
  floatAmplitude?: number;      // ${p.floatAmplitude}
  assemblySmoothing?: number;   // ${p.assemblySmoothing}
  bgColor?: string;             // “${p.bgColor}”
  onRequestFullscreen?: () => void;
}
\`\`\`
Use font: Inter. React 18 + raw Three.js only — no @react-three/fiber or drei.`;
}

function generateGlassPillPrompt(props: Record<string, any>): string {
  const p = props;
  return `Create a floating pill-shaped glassmorphism navigation bar as a single self-contained React component using TypeScript, Tailwind CSS, and Lucide React icons.

## 1. Pill Container
- Max width: **${p.maxWidth}px**, height: **${p.height}px**, border-radius: **${p.borderRadius}px**.
- Background: \`${p.bgColor}\` at **${p.bgOpacity}** opacity with backdrop-filter blur(**${p.blurAmount}px**).
- Border: \`1px solid rgba(textColor, ${p.borderOpacity})\`.
- Sticky top with scroll shadow when \`sticky\` prop is true.

## 2. Brand & Links
- Brand: **“${p.brandName}”**, weight 700, letter-spacing 0.14em.
- Desktop links: uppercase, 0.72rem, hover animation style **“${p.animationStyle}”**:
${p.animationStyle === "underline" ? "  - Underline expands left→right (260ms cubic-bezier) in accent color." : ""}${p.animationStyle === "highlight" ? "  - Rounded highlight pill background rgba(accent, 0.1) on hover." : ""}${p.animationStyle === "slide" ? "  - Link slides up 2px + 4px accent dot appears below (scale animation)." : ""}

## 3. CTA Button
${p.showCta ? `- Text: “${p.ctaText}” → “${p.ctaHref}”, background **${p.accentColor}**, pill shape, ArrowRight icon.
- Hover: translateY(-1px) + box-shadow rgba(accent, 0.25).` : "- CTA hidden (showCta: false)."}

## 4. Mobile Menu
- Hamburger → fullscreen overlay blur(${p.blurAmount * 1.5}px).
- Links staggered entrance (60ms delay per index), numbered 01/02…

## 5. Color System
- bgColor: **${p.bgColor}** (opacity ${p.bgOpacity})
- textColor: **${p.textColor}**
- accentColor: **${p.accentColor}**

\`\`\`ts
interface NavGlassPillProps {
  brandName?: string;       // “${p.brandName}”
  bgColor?: string;         // “${p.bgColor}”
  bgOpacity?: number;       // ${p.bgOpacity}
  blurAmount?: number;      // ${p.blurAmount}
  borderOpacity?: number;   // ${p.borderOpacity}
  accentColor?: string;     // “${p.accentColor}”
  textColor?: string;       // “${p.textColor}”
  maxWidth?: number;        // ${p.maxWidth}
  height?: number;          // ${p.height}
  borderRadius?: number;    // ${p.borderRadius}
  sticky?: boolean;         // ${p.sticky}
  showCta?: boolean;        // ${p.showCta}
  animationStyle?: “underline” | “highlight” | “slide”;
}
\`\`\``;
}

function generateBrutalistHybridPrompt(props: Record<string, any>): string {
  const p = props;
  return `Create a minimal brutalist navigation bar for a dark editorial landing page as a single self-contained React component using TypeScript and Tailwind CSS.

## 1. Top Bar — Centered Pill Card
- Max width: **${p.pillMaxWidth}px**, height: **${p.barHeight}px**, radius: **${p.pillRadius}px**.
- Background: rgba(pillBg, 0.55) → 0.70 on scroll → 0.75 when menu open. backdrop-filter blur(14px).
- Logo${p.brandIcon ? " with 3-dot triangle SVG icon" : ""}: **“${p.brandName}”**, 0.7rem, weight 500, letter-spacing 0.13em.
- Desktop primary links: monospace font (JetBrains Mono), 0.65rem, gap **${p.linkSpacing}px**.
${p.showBullets ? "  - ◇ diamond bullet prefix (opacity 0.4)." : ""}
- **Text Scramble Effect**: on hover, characters cycle through glyphs at **${p.scrambleSpeed}ms**/tick, resolve left-to-right.
- Hover underline style: **“${p.hoverStyle}”**.
- Hamburger → X morph via CSS transforms (280ms cubic-bezier).

## 2. Dropdown Panel (Not Fullscreen)
- Expands via \`grid-template-rows: 0fr → 1fr\` (420ms). Background visible around panel.
- All links centered, font clamp(${Math.round(p.overlayTextSize * 0.75)}px, 2.2vw, ${p.overlayTextSize}px), monospace.
${p.showBullets ? "  - ◦ bullet prefix (opacity 0.3)." : ""}
- Same scramble animation at **${p.scrambleSpeed}ms**.
- Staggered entrance: delay 60ms + idx × 40ms.
- Footer: social/contact lines, 0.6rem, opacity 0.3.

## 3. Color System
- pillBg: **${p.pillBg}** | textColor: **${p.textColor}** | overlayBg: **${p.overlayBg}**

\`\`\`ts
interface NavBrutalistHybridProps {
  brandName?: string;       // “${p.brandName}”
  brandIcon?: boolean;      // ${p.brandIcon}
  showBullets?: boolean;    // ${p.showBullets}
  pillBg?: string;          // “${p.pillBg}”
  textColor?: string;       // “${p.textColor}”
  textOpacity?: number;     // ${p.textOpacity}
  barHeight?: number;       // ${p.barHeight}
  pillMaxWidth?: number;    // ${p.pillMaxWidth}
  pillRadius?: number;      // ${p.pillRadius}
  overlayTextSize?: number; // ${p.overlayTextSize}
  linkSpacing?: number;     // ${p.linkSpacing}
  hoverStyle?: “underline-left” | “underline-center” | “opacity”;
  scrambleSpeed?: number;   // ${p.scrambleSpeed}
}
\`\`\``;
}

const promptGenerators: Record<string, (props: Record<string, any>) => string> = {
  HeroCinematicNav: generateCinematicNavPrompt,
  NavGlassPill: generateGlassPillPrompt,
  NavBrutalistHybrid: generateBrutalistHybridPrompt,
};

export function PromptPanel({ story, currentProps }: PromptPanelProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const prompt = useMemo(() => {
    const gen = promptGenerators[story.component];
    if (!gen) return `// No prompt generator for ${story.component}`;
    return gen(currentProps);
  }, [story.component, currentProps]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-900 transition-colors"
        >
          <ScrollText className="w-4 h-4" />
          <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>Prompt</span>
          <span className="text-slate-400 transition-transform duration-200"
            style={{ display: "inline-block", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", fontSize: "0.7rem" }}>
            ▼
          </span>
        </button>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            copied ? "bg-emerald-50 text-emerald-600" : "text-indigo-600 hover:bg-indigo-50"
          }`}
          style={{ fontSize: "0.75rem", fontWeight: 500 }}
        >
          {copied ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy Prompt</>}
        </button>
      </div>
      {!collapsed && (
        <div className="max-h-[400px] overflow-y-auto">
          <pre className="px-4 py-3 text-slate-700 whitespace-pre-wrap break-words select-all"
            style={{ fontSize: "0.78rem", lineHeight: 1.65, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
