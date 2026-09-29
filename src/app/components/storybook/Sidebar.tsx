import React from "react";
import { BookOpen, ChevronDown, ChevronRight, Layout, Search } from "lucide-react";

export interface StoryEntry {
  id: string;
  name: string;
  category: string;
}

interface SidebarProps {
  stories: StoryEntry[];
  activeStory: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Sidebar({ stories, activeStory, onSelect, searchQuery, onSearchChange }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({ Heroes: true, Navigation: true });

  const filteredStories = stories.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(filteredStories.map((s) => s.category))];

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className="w-64 h-full border-r border-slate-200 bg-white flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }} className="text-slate-900">Hero Library</div>
            <div style={{ fontSize: "0.7rem" }} className="text-slate-400">v1.0.0</div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            style={{ fontSize: "0.8rem" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((cat) => {
          const isExpanded = expandedCategories[cat] !== false;
          const catStories = filteredStories.filter((s) => s.category === cat);
          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-1.5 px-4 py-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {cat}
              </button>
              {isExpanded &&
                catStories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => onSelect(story.id)}
                    className={`w-full flex items-center gap-2 pl-8 pr-4 py-1.5 transition-colors cursor-pointer ${
                      activeStory === story.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    style={{ fontSize: "0.825rem" }}
                  >
                    <Layout className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    {story.name}
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
