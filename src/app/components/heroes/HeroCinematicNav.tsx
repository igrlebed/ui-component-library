import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Menu, X, ArrowDown, Maximize2 } from "lucide-react";

const heroStyles = `
  .hero-cn .nav-link-premium {
    position: relative; display: inline-flex; align-items: center; gap: 6px;
    color: rgba(255,255,255,0.4); text-decoration: none;
    transition: color 220ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .hero-cn .nav-link-premium::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: rgba(255,255,255,0.6);
    transition: width 220ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .hero-cn .nav-link-premium:hover { color: rgba(255,255,255,0.95); transform: translateY(-1px); }
  .hero-cn .nav-link-premium:hover::after { width: 100%; }
  .hero-cn .nav-link-premium .diamond {
    display: inline-block; width: 5px; height: 5px;
    border: 1px solid rgba(255,255,255,0.2); border-radius: 1px; transform: rotate(45deg);
    transition: border-color 220ms cubic-bezier(0.25, 0.1, 0.25, 1), background 220ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .hero-cn .nav-link-premium:hover .diamond { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.3); }
  .hero-cn .pill-link {
    display: inline-flex; align-items: center;
    border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.25); background: transparent; text-decoration: none;
    transition: color 200ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1), background 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .hero-cn .pill-link:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }
  .hero-cn .cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.55); background: transparent; text-decoration: none;
    transition: color 240ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 240ms cubic-bezier(0.25, 0.1, 0.25, 1), background 240ms cubic-bezier(0.25, 0.1, 0.25, 1);
    cursor: pointer;
  }
  .hero-cn .cta-btn:hover { color: #0a0a0f; border-color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.93); }
  .hero-cn .icon-btn {
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.3); background: transparent;
    transition: color 200ms ease, border-color 200ms ease, background 200ms ease; cursor: pointer;
  }
  .hero-cn .icon-btn:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
  .hero-cn .mobile-nav-link {
    position: relative; color: rgba(255,255,255,0.5); text-decoration: none;
    transition: color 200ms ease, transform 200ms ease;
  }
  .hero-cn .mobile-nav-link::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px; background: rgba(255,255,255,0.5);
    transition: width 200ms ease;
  }
  .hero-cn .mobile-nav-link:hover { color: rgba(255,255,255,0.95); transform: translateX(4px); }
  .hero-cn .mobile-nav-link:hover::after { width: 100%; }
`;

const particleVertex = /* glsl */ `
  attribute vec3 aScattered;
  attribute vec3 aSphere;
  attribute float aRandom;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uRotationSpeed;
  uniform float uNoiseStrength;
  uniform float uFloatAmplitude;
  varying float vAlpha;
  varying float vGlow;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x2_ = x_ * ns.x + ns.yyyy;
    vec4 y2_ = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x2_) - abs(y2_);
    vec4 b0 = vec4(x2_.xy, y2_.xy);
    vec4 b1 = vec4(x2_.zw, y2_.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float stagger = aRandom * 0.35;
    float p = clamp((uProgress - stagger) / (1.0 - stagger), 0.0, 1.0);
    p = p < 0.5 ? 4.0 * p * p * p : 1.0 - pow(-2.0 * p + 2.0, 3.0) / 2.0;
    vec3 sphereDir = normalize(aSphere);
    float noiseDisp = snoise(aSphere * 2.0 + uTime * 0.12) * uNoiseStrength;
    vec3 displacedSphere = aSphere + sphereDir * noiseDisp * p;
    vec3 pos = mix(aScattered, displacedSphere, p);
    float floatAmt = (1.0 - p);
    pos.y += sin(uTime * 0.4 + aRandom * 6.28) * uFloatAmplitude * floatAmt;
    pos.x += cos(uTime * 0.3 + aRandom * 3.14) * (uFloatAmplitude * 0.625) * floatAmt;
    float angle = uTime * uRotationSpeed * p;
    float cosA = cos(angle); float sinA = sin(angle);
    vec3 rotated = vec3(pos.x * cosA - pos.z * sinA, pos.y, pos.x * sinA + pos.z * cosA);
    vec4 mvPos = modelViewMatrix * vec4(rotated, 1.0);
    float scatterSize = mix(1.8, 1.0, p);
    gl_PointSize = uSize * uPixelRatio * scatterSize * (1.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
    float distFromCenter = length(aSphere);
    vGlow = smoothstep(1.6, 0.8, distFromCenter) * p;
    vAlpha = mix(0.35 + aRandom * 0.3, 0.6 + vGlow * 0.4, p);
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uColorCore;
  uniform vec3 uColorOuter;
  uniform float uProgress;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float strength = 1.0 - smoothstep(0.0, 0.5, d);
    strength = pow(strength, 1.5);
    vec3 color = mix(uColorOuter, uColorCore, vGlow);
    float glow = pow(strength, 3.0) * vGlow * 0.6;
    gl_FragColor = vec4(color * strength + vec3(1.0, 0.9, 0.7) * glow, strength * vAlpha);
  }
`;

interface SceneConfig {
  particleCount: number; sphereRadius: number; particleSize: number;
  colorCore: string; colorOuter: string; rotationSpeed: number;
  noiseStrength: number; floatAmplitude: number; assemblySmoothing: number;
}

function createParticleScene(config: SceneConfig) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 4.5);
  const N = config.particleCount;
  const scattered = new Float32Array(N * 3);
  const sphere = new Float32Array(N * 3);
  const randoms = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / N);
    const r = config.sphereRadius * (0.95 + Math.random() * 0.1);
    sphere[i3] = r * Math.sin(phi) * Math.cos(theta);
    sphere[i3 + 1] = r * Math.cos(phi);
    sphere[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const scatterRadius = 3.5 + Math.random() * 4.0;
    const scatterAngle = Math.random() * Math.PI * 2;
    scattered[i3] = Math.cos(scatterAngle) * scatterRadius * (0.5 + Math.random());
    scattered[i3 + 1] = 1.5 + Math.random() * 3.5;
    scattered[i3 + 2] = Math.sin(scatterAngle) * scatterRadius * (0.3 + Math.random() * 0.7) - 1.0;
    randoms[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("aScattered", new THREE.BufferAttribute(scattered, 3));
  geometry.setAttribute("aSphere", new THREE.BufferAttribute(sphere, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
  geometry.setAttribute("position", new THREE.BufferAttribute(sphere.slice(), 3));
  const uniforms = {
    uProgress: { value: 0 }, uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
    uSize: { value: config.particleSize },
    uRotationSpeed: { value: config.rotationSpeed },
    uNoiseStrength: { value: config.noiseStrength },
    uFloatAmplitude: { value: config.floatAmplitude },
    uColorCore: { value: new THREE.Color(config.colorCore) },
    uColorOuter: { value: new THREE.Color(config.colorOuter) },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertex, fragmentShader: particleFragment,
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.position.set(0, -0.1, 0);
  scene.add(points);
  return { scene, camera, points, uniforms };
}

export interface HeroCinematicNavProps {
  brandName?: string; navItems?: string[];
  headlineLine1?: string; headlineLine2?: string; headlineLine3?: string;
  descriptorText?: string; ctaText?: string; scrollHintLabel?: string;
  socialLinks?: { label: string; href: string }[];
  onRequestFullscreen?: () => void;
  particleCount?: number; sphereRadius?: number; particleSize?: number;
  colorCore?: string; colorOuter?: string; rotationSpeed?: number;
  noiseStrength?: number; floatAmplitude?: number; assemblySmoothing?: number;
  bgColor?: string;
}

const defaultSocialLinks = [{ label: "TELEGRAM", href: "#" }, { label: "DPROFILE", href: "#" }];

export function HeroCinematicNav({
  brandName = "AETHON.STUDIO", navItems = ["Program", "Price", "Contacts"],
  headlineLine1 = "DESIGN", headlineLine2 = "BEYOND THE", headlineLine3 = "SURFACE",
  descriptorText = "WE BUILD DIGITAL PRODUCTS\nOF ANY COMPLEXITY —\nFROM CONCEPT TO LAUNCH",
  ctaText = "START PROJECT", scrollHintLabel = "SCROLL",
  socialLinks = defaultSocialLinks, onRequestFullscreen,
  particleCount, sphereRadius, particleSize, colorCore, colorOuter,
  rotationSpeed, noiseStrength, floatAmplitude, assemblySmoothing, bgColor,
}: HeroCinematicNavProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const targetProgress = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const uniformsRef = useRef<ReturnType<typeof createParticleScene>["uniforms"] | null>(null);
  const assemblySmoothingRef = useRef(assemblySmoothing ?? 0.05);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); e.stopPropagation();
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + e.deltaY * 0.0008));
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 0.003;
      touchStartY = e.touches[0].clientY;
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) { console.warn("WebGL not available:", e); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    const sceneConfig: SceneConfig = {
      particleCount: particleCount ?? 18000, sphereRadius: sphereRadius ?? 1.35,
      particleSize: particleSize ?? 28.0, colorCore: colorCore ?? "#ff8800",
      colorOuter: colorOuter ?? "#cc3300", rotationSpeed: rotationSpeed ?? 0.08,
      noiseStrength: noiseStrength ?? 0.18, floatAmplitude: floatAmplitude ?? 0.08,
      assemblySmoothing: assemblySmoothing ?? 0.05,
    };
    const { scene, camera, uniforms } = createParticleScene(sceneConfig);
    uniformsRef.current = uniforms;
    const clock = new THREE.Clock();
    const resize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
      if (w < 480) { uniforms.uSize.value = 14.0; camera.position.z = 5.5; }
      else if (w < 768) { uniforms.uSize.value = 18.0; camera.position.z = 5.0; }
      else if (w < 1024) { uniforms.uSize.value = 22.0; camera.position.z = 4.8; }
      else { uniforms.uSize.value = 28.0; camera.position.z = 4.5; }
    };
    resize();
    window.addEventListener("resize", resize);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      if (containerRef.current) ro.observe(containerRef.current);
    }
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      scrollProgress.current += (targetProgress.current - scrollProgress.current) * assemblySmoothingRef.current;
      uniforms.uProgress.value = scrollProgress.current;
      setDisplayProgress(Math.round(scrollProgress.current * 100) / 100);
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      if (ro) ro.disconnect();
      renderer.dispose();
    };
  }, [particleCount, sphereRadius]);

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    if (colorCore != null) u.uColorCore.value.set(colorCore);
    if (colorOuter != null) u.uColorOuter.value.set(colorOuter);
    if (rotationSpeed != null) u.uRotationSpeed.value = rotationSpeed;
    if (noiseStrength != null) u.uNoiseStrength.value = noiseStrength;
    if (floatAmplitude != null) u.uFloatAmplitude.value = floatAmplitude;
    if (particleSize != null) u.uSize.value = particleSize;
  }, [colorCore, colorOuter, rotationSpeed, noiseStrength, floatAmplitude, particleSize]);

  useEffect(() => { assemblySmoothingRef.current = assemblySmoothing ?? 0.05; }, [assemblySmoothing]);

  const showScrollHint = displayProgress < 0.15;
  const baseBg = bgColor ?? "#2a0800";
  const bgGradient = `radial-gradient(ellipse at 50% 60%, ${baseBg} 0%, color-mix(in srgb, ${baseBg} 50%, #000) 40%, #0a0a0f 75%)`;

  return (
    <section ref={containerRef} className="hero-cn relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: 540, background: bgGradient, fontFamily: "'Inter', sans-serif" }}>
      <style>{heroStyles}</style>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" style={{ display: "block" }} />
      <div className="absolute z-[1] pointer-events-none"
        style={{ width: "70vw", height: "70vw", maxWidth: 1000, maxHeight: 1000, left: "50%", top: "45%", transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(200,80,0,0.12) 0%, rgba(180,50,0,0.04) 35%, transparent 60%)", opacity: 0.5 + displayProgress * 0.5 }} />

      <nav className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-3 sm:pt-4 md:pt-5 px-3 sm:px-4">
        <div className="flex items-center justify-between w-full gap-3 sm:gap-6 px-4 sm:px-5 md:px-7 py-2.5 sm:py-3"
          style={{ maxWidth: 720, background: "rgba(15, 15, 22, 0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 50, border: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="#" className="text-white shrink-0 select-none"
            style={{ fontSize: "clamp(0.6rem, 1.6vw, 0.72rem)", fontWeight: 600, letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
            {brandName}
          </a>
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link-premium"
                style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                <span className="diamond" />{item}
              </a>
            ))}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/40 hover:text-white transition-colors duration-200 cursor-pointer p-1" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col md:hidden" style={{ background: bgGradient }}>
          <div className="flex justify-end p-4 sm:p-5">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer p-1" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-start justify-center px-8 sm:px-12 gap-5 sm:gap-6">
            {navItems.map((item, idx) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link flex items-center gap-3"
                style={{ fontSize: "clamp(1.3rem, 5vw, 2rem)", fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <span className="text-white/15" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.1em" }}>0{idx + 1}</span>
                {item}
              </a>
            ))}
          </div>
          <div className="px-8 sm:px-12 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="pill-link px-3.5 py-1.5 rounded-full"
                  style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.08em" }}>{link.label}</a>
              ))}
            </div>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="cta-btn px-5 py-2"
              style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{ctaText}</a>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12 pb-5 sm:pb-7 md:pb-9">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 lg:gap-12 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-white select-none shrink-0">
            {[headlineLine1, headlineLine2, headlineLine3].map((line, i) => (
              <span key={i} className="block"
                style={{ fontSize: "clamp(1.8rem, 7vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-white/[0.18] hidden lg:block max-w-[260px] text-right shrink-0"
            style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", lineHeight: 1.7, textTransform: "uppercase", whiteSpace: "pre-line" }}>
            {descriptorText}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 text-white/[0.18]" style={{ opacity: showScrollHint ? 1 : 0.3, transition: "opacity 400ms ease" }}>
            <span style={{ fontSize: "clamp(0.5rem, 1.2vw, 0.6rem)", fontWeight: 500, letterSpacing: "0.14em" }}>[{scrollHintLabel}]</span>
            <ArrowDown className="w-3 h-3 animate-bounce" style={{ animationDuration: "2s" }} />
          </div>
          <div className="hidden sm:flex items-center gap-3 md:gap-4 pointer-events-auto">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="pill-link px-3 py-1 rounded-full"
                style={{ fontSize: "clamp(0.5rem, 1vw, 0.58rem)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <a href="#contact" className="cta-btn px-4 sm:px-6 py-2 sm:py-2.5"
              style={{ fontSize: "clamp(0.52rem, 1.1vw, 0.62rem)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {ctaText}
            </a>
            {onRequestFullscreen && (
              <button onClick={onRequestFullscreen} className="icon-btn w-8 h-8 sm:w-9 sm:h-9" style={{ borderRadius: 0 }} aria-label="Fullscreen">
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ opacity: 0.15 }}>
        <div className="w-px bg-white/20 relative" style={{ height: 60 }}>
          <div className="absolute top-0 left-0 w-px bg-white/60 transition-all" style={{ height: `${displayProgress * 100}%`, transitionDuration: "100ms" }} />
        </div>
      </div>
    </section>
  );
}
