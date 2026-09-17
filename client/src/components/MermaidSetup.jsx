import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .trim();

  if (!clean) return "";

  const lines = clean.split("\n");
  const firstLine = lines[0].trim();

  const hasValidHeader = /^(graph|flowchart)\s+(TD|TB|BT|LR|RL)\b/i.test(
    firstLine
  );

  if (hasValidHeader) {
    return lines.join("\n");
  }

  const looksLikeHeader = /^(graph|flowchart)\b/i.test(firstLine);
  const body = looksLikeHeader ? lines.slice(1) : lines;

  return `graph TD\n${body.join("\n")}`;
};

const autoFixBadNodes = (diagram) => {
  if (!diagram) return "";

  const lines = diagram.split("\n");

  const existingIds = new Set();
  const idPattern = /\b([A-Za-z_][A-Za-z0-9_]*)\s*(\[|\(|\{|-{1,3}>|$)/g;
  for (const line of lines) {
    let match;
    while ((match = idPattern.exec(line)) !== null) {
      existingIds.add(match[1]);
    }
  }

  const labelToId = new Map();
  let counter = 1;

  const nextId = () => {
    let id;
    do {
      id = `AF${counter++}`;
    } while (existingIds.has(id));
    return id;
  };

  const getIdForLabel = (label) => {
    const key = label.trim();
    if (!labelToId.has(key)) {
      labelToId.set(key, nextId());
    }
    return labelToId.get(key);
  };

  return lines
    .map((line, i) => {
      if (i === 0 && /^(graph|flowchart)\s+/i.test(line.trim())) {
        return line;
      }

      return line.replace(
        /([A-Za-z_][A-Za-z0-9_]*)?\[([^\]]+)\]/g,
        (fullMatch, existingId, label) => {
          if (existingId && existingIds.has(existingId)) {
            return fullMatch;
          }
          const id = getIdForLabel(label);
          return `${id}[${label.trim()}]`;
        }
      );
    })
    .join("\n");
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);
  const mermaidIdRef = useRef(
    `mermaid-${Math.random().toString(36).substring(2, 9)}`
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    let cancelled = false;
    setError(null);

    const tryRender = async (chart) => {
      const { svg } = await mermaid.render(mermaidIdRef.current, chart);
      return svg;
    };

    const renderDiagram = async () => {
      containerRef.current.innerHTML = "";

      const cleaned = cleanMermaidChart(diagram);
      if (!cleaned.trim()) return;

      try {
        const svg = await tryRender(cleaned);
        if (!cancelled) containerRef.current.innerHTML = svg;
        return;
      } catch (firstError) {
        console.warn("Initial Mermaid render failed:", firstError);
      }

      try {
        const fixed = autoFixBadNodes(cleaned);
        console.log("Auto-fixed Mermaid source:", fixed);
        const svg = await tryRender(fixed);
        if (!cancelled) containerRef.current.innerHTML = svg;
      } catch (secondError) {
        console.error("Mermaid render failed after auto-fix:", secondError);
        if (!cancelled) {
          setError("Mermaid render failed.");
          containerRef.current.innerHTML = `
            <div class="text-red-500 p-3">
              Mermaid render failed.
            </div>
          `;
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  return (
    <div className="bg-white border rounded-lg overflow-x-auto p-4">
      <div ref={containerRef} />
      {error && (
        <p className="text-xs text-red-400 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default MermaidSetup;