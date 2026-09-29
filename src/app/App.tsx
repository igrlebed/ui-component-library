import React, { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { Eye, Code2, Maximize2, Minimize2, Monitor, Tablet, Smartphone, PanelLeftClose, PanelLeft } from "lucide-react";
import { Sidebar } from "./components/storybook/Sidebar";
import { PropsPanel } from "./components/storybook/PropsPanel";
import { CodeView } from "./components/storybook/CodeView";
import { ErrorBoundary } from "./components/storybook/ErrorBoundary";
import { stories } from "./components/storybook/storyData";
import { generateCode } from "./components/storybook/generateCode";
import { PromptPanel } from "./components/storybook/PromptPanel";

const HeroCinematicNav = lazy(() =>
  import("./components/heroes/HeroCinematicNav").then((m) => ({ default: m.HeroCinematicNav }))
);

const NavGlassPill = lazy(() =>
  import("./components/navs/NavGlassPill").then((m) => ({ default: m.NavGlassPill }))
);

const NavBrutalistHybrid = lazy(() =>
  import("./components/navs/NavBrutalistHybrid").then((m) => ({ default: m.NavBrutalistHybrid }))
);

const componentMap: Record<string, React.LazyExoticComponent<React.FC<any>>> = {
  HeroCinematicNav,
  NavGlassPill,
  NavBrutalistHybrid,
};

type ViewportSize = "desktop" | "tablet" | "mobile";
type Tab = "canvas" | "code";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-900 min-h-[300px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
        <span className="text-slate-400" style={{ fontSize: "0.78rem" }}>Loading component…</span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeStoryId, setActiveStoryId] = useState("hero-cinematic-nav");
  const [searchQuery, setSearchQuery] = useState("");
  const [propsOverrides, setPropsOverrides] = useState<Record<string, Record<string, any>>>({});
  const [tab, setTab] = useState<Tab>("canvas");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0];
  const currentProps = { ...activeStory.defaultProps, ...propsOverrides[activeStoryId] };

  const Component = componentMap[activeStory.component];
  const code = useMemo(() => generateCode(activeStory, currentProps), [activeStory, currentProps]);

  const handlePropChange = (name: string, value: any) => {
    setPropsOverrides((prev) => ({
      ...prev,
      [activeStoryId]: { ...prev[activeStoryId], [name]: value },
    }));
  };

  const handleReset = () => {
    setPropsOverrides((prev) => {
      const next = { ...prev };
      delete next[activeStoryId];
      return next;
    });
  };

  const enterFullscreen = useCallback(() => setIsFullscreen(true), []);
  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  const viewportStyles: Record<ViewportSize, { width: string; height: string }> = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "812px" },
  };
  const vp = viewportStyles[viewport];

  const storyEntries = stories.map((s) => ({ id: s.id, name: s.name, category: s.category }));

  if (isFullscreen) {
    return (
      <div className="h-screen w-screen relative bg-black">
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-all duration-200 cursor-pointer backdrop-blur-sm border border-white/10"
          aria-label="Exit fullscreen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        <div
          className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-black/60 text-white/40 backdrop-blur-sm border border-white/10 select-none"
          style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Fullscreen — scroll to animate
        </div>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Component {...currentProps} onRequestFullscreen={undefined} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-slate-100 overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          stories={storyEntries}
          activeStory={activeStoryId}
          onSelect={setActiveStoryId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline" style={{ fontSize: "0.8rem" }}>
              {activeStory.category} /
            </span>
            <span className="text-slate-800" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              {activeStory.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
              {([
                { key: "desktop", icon: Monitor },
                { key: "tablet", icon: Tablet },
                { key: "mobile", icon: Smartphone },
              ] as const).map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewport(key)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewport === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setTab("canvas")}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  tab === "canvas" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
                style={{ fontSize: "0.78rem", fontWeight: 500 }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Canvas</span>
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  tab === "code" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
                style={{ fontSize: "0.78rem", fontWeight: 500 }}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code</span>
              </button>
            </div>

            <button
              onClick={enterFullscreen}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Open fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto relative">
            {tab === "canvas" ? (
              <div className="h-full flex items-start justify-center p-2 sm:p-4 md:p-6">
                <div
                  className={`rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 relative ${
                    activeStory.category === "Navigation" ? "bg-slate-900" : "bg-white"
                  }`}
                  style={{
                    width: vp.width,
                    height: viewport === "desktop" ? (activeStory.category === "Navigation" ? "320px" : "auto") : vp.height,
                    maxWidth: "100%",
                    maxHeight: viewport === "desktop" ? "none" : "100%",
                  }}
                >
                  <ErrorBoundary key={activeStoryId}>
                    <Suspense fallback={<LoadingFallback />}>
                      <Component {...currentProps} onRequestFullscreen={enterFullscreen} />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <CodeView code={code} />
            )}
          </div>

          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-t border-slate-200">
            <p className="text-slate-500" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
              {activeStory.description}
            </p>
          </div>

          <PropsPanel
            propDefs={activeStory.propDefs}
            values={currentProps}
            onChange={handlePropChange}
            onReset={handleReset}
          />

          <PromptPanel
            story={activeStory}
            currentProps={currentProps}
          />
        </div>
      </div>
    </div>
  );
}
