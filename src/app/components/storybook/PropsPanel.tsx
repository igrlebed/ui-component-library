import React from "react";
import { Settings2 } from "lucide-react";

export interface PropDef {
  name: string;
  type: "string" | "boolean" | "select" | "number" | "color";
  defaultValue: any;
  options?: string[];
  description?: string;
}

interface PropsPanelProps {
  propDefs: PropDef[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onReset: () => void;
}

export function PropsPanel({ propDefs, values, onChange, onReset }: PropsPanelProps) {
  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-700">
          <Settings2 className="w-4 h-4" />
          <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>Controls</span>
        </div>
        <button
          onClick={onReset}
          className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
          style={{ fontSize: "0.75rem", fontWeight: 500 }}
        >
          Reset
        </button>
      </div>

      <div className="max-h-[280px] overflow-y-auto">
        <table className="w-full" style={{ fontSize: "0.8rem" }}>
          <thead>
            <tr className="border-b border-slate-100 text-slate-400" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-4 py-2">Prop</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-left px-4 py-2 w-56">Value</th>
            </tr>
          </thead>
          <tbody>
            {propDefs.map((prop) => (
              <tr key={prop.name} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-2.5">
                  <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded" style={{ fontSize: "0.75rem" }}>
                    {prop.name}
                  </code>
                </td>
                <td className="px-4 py-2.5 text-slate-400" style={{ fontSize: "0.75rem" }}>
                  {prop.description || prop.type}
                </td>
                <td className="px-4 py-2.5">
                  {prop.type === "boolean" && (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values[prop.name] ?? prop.defaultValue}
                        onChange={(e) => onChange(prop.name, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  )}
                  {prop.type === "string" && (
                    <input
                      type="text"
                      value={values[prop.name] ?? prop.defaultValue}
                      onChange={(e) => onChange(prop.name, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                      style={{ fontSize: "0.78rem" }}
                    />
                  )}
                  {prop.type === "color" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={values[prop.name] ?? prop.defaultValue}
                        onChange={(e) => onChange(prop.name, e.target.value)}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <code className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                        {values[prop.name] ?? prop.defaultValue}
                      </code>
                    </div>
                  )}
                  {prop.type === "select" && (
                    <select
                      value={values[prop.name] ?? prop.defaultValue}
                      onChange={(e) => onChange(prop.name, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {prop.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {prop.type === "number" && (
                    <input
                      type="number"
                      value={values[prop.name] ?? prop.defaultValue}
                      onChange={(e) => onChange(prop.name, Number(e.target.value))}
                      step={Number.isInteger(prop.defaultValue) ? 1 : 0.01}
                      className="w-32 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                      style={{ fontSize: "0.78rem" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
