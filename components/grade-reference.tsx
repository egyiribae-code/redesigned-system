"use client";

import { GRADE_SCALE, getGradeColor } from "@/lib/grading";

export function GradeReference() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-[15px] font-semibold text-foreground">
          Ghana Grade Scale
        </h3>
        <p className="text-xs text-muted mt-0.5">Letter grades & points</p>
      </div>
      <div className="p-4">
        {GRADE_SCALE.map((g) => (
          <div
            key={g.label}
            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-foreground/5"
          >
            <span
              className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs font-bold ${getGradeColor(g.label)}`}
            >
              {g.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {g.min} - {g.max}%
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{
                color:
                  g.point >= 3
                    ? "var(--color-accent)"
                    : g.point >= 2
                      ? "var(--color-primary-light)"
                      : g.point >= 1
                        ? "var(--color-warning)"
                        : "var(--color-destructive)",
              }}
            >
              {g.point.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
