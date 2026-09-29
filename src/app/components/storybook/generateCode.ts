import type { StoryConfig } from "./storyData";

const importPaths: Record<string, string> = {
  Heroes: "heroes",
  Navigation: "navs",
};

export function generateCode(story: StoryConfig, props: Record<string, any>): string {
  const changedProps = Object.entries(props).filter(
    ([key, val]) => val !== story.defaultProps[key]
  );

  const propsString = changedProps
    .map(([key, val]) => {
      if (typeof val === "boolean") return val ? `  ${key}` : `  ${key}={false}`;
      if (typeof val === "number") return `  ${key}={${val}}`;
      return `  ${key}="${val}"`;
    })
    .join("\n");

  const folder = importPaths[story.category] || "components";
  const tag = story.component;
  if (propsString) {
    return `import { ${tag} } from "@/components/${folder}/${tag}";\n\nexport default function Page() {\n  return (\n    <${tag}\n${propsString}\n    />\n  );\n}`;
  }
  return `import { ${tag} } from "@/components/${folder}/${tag}";\n\nexport default function Page() {\n  return <${tag} />;\n}`;
}
