import { createElement, type ElementType } from "react";

export default function SplitText({
  text,
  as = "h2",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const parts = text.split(/(\*[^*]+\*)/);
  return createElement(
    as,
    { className, "data-split": "" },
    parts.map((p, i) =>
      p.startsWith("*") && p.endsWith("*") ? (
        <span key={i} className="highlight">
          {p.slice(1, -1)}
        </span>
      ) : (
        p
      ),
    ),
  );
}
