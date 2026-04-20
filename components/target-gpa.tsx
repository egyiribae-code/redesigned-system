"use client";

import { useState } from "react";
import { getClassification } from "@/lib/grading";

interface TargetGPAProps {
  currentCGPA: number;
  totalCreditsEarned: number;
}

export function TargetGPA({ currentCGPA, totalCreditsEarned }: TargetGPAProps) {
  const [targetGPA, setTargetGPA] = useState("3.5");
  const [totalSemesters, setTotalSemesters] = useState("8");
  const [creditsPerSem, setCreditsPerSem] = useState("18");

  const totalCreditsNeeded =
    parseFloat(totalSemesters) * parseFloat(creditsPerSem) || 0;
  const remainingCredits = Math.max(
    totalCreditsNeeded - totalCreditsEarned,
    0
  );
  const targetPoints = parseFloat(targetGPA) * totalCreditsNeeded;
  const currentPoints = currentCGPA * totalCreditsEarned;
  const neededPoints = targetPoints - currentPoints;
  const requiredGPA =
    remainingCredits > 0 ? neededPoints / remainingCredits : null;

  const color =
    requiredGPA === null
      ? "var(--color-muted)"
      : requiredGPA <= 3.0
        ? "var(--color-accent)"
        : requiredGPA <= 3.8
          ? "var(--color-warning)"
          : "var(--color-destructive)";

  const feasText =
    requiredGPA === null
      ? "Enter parameters"
      : requiredGPA <= 4.0
        ? requiredGPA <= 3.0
          ? "Very achievable"
          : requiredGPA <= 3.8
            ? "Challenging but possible"
            : "Very challenging"
        : "Not achievable - consider adjusting your target";

  const feasCls =
    requiredGPA === null
      ? "text-muted"
      : requiredGPA <= 3.0
        ? "text-accent"
        : requiredGPA <= 3.8
          ? "text-warning"
          : "text-destructive";

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-[15px] font-semibold text-foreground">
          Target GPA Planner
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Find your required semester GPA
        </p>
      </div>
      <div className="p-5">
        <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-2">
          Desired CGPA at Graduation
        </label>
        <select
          value={targetGPA}
          onChange={(e) => setTargetGPA(e.target.value)}
          className="w-full px-3 py-2.5 mb-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8 focus:border-primary"
        >
          {[4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.0, 2.5, 2.0].map((v) => (
            <option key={v} value={v} className="bg-card">
              {v.toFixed(1)} - {getClassification(v).label}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-2">
              Total Semesters
            </label>
            <select
              value={totalSemesters}
              onChange={(e) => setTotalSemesters(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8 focus:border-primary"
            >
              {[6, 7, 8, 9, 10, 12].map((v) => (
                <option key={v} value={v} className="bg-card">
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-2">
              Credits / Sem
            </label>
            <select
              value={creditsPerSem}
              onChange={(e) => setCreditsPerSem(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8 focus:border-primary"
            >
              {[15, 16, 17, 18, 19, 20, 21, 22, 24].map((v) => (
                <option key={v} value={v} className="bg-card">
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-accent/25 rounded-xl text-center">
          <p
            className="font-mono text-4xl font-bold leading-none"
            style={{ color }}
          >
            {requiredGPA !== null && remainingCredits > 0
              ? requiredGPA.toFixed(2)
              : remainingCredits === 0
                ? "Done!"
                : "-"}
          </p>
          <p className="text-xs text-muted mt-1">
            Required GPA per remaining semester
          </p>
          <p className={`text-xs font-semibold mt-2 ${feasCls}`}>{feasText}</p>
          {remainingCredits === 0 && (
            <p className="text-xs text-accent mt-1">
              You have completed all credits!
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-muted">
          Credits earned:{" "}
          <strong className="text-muted-foreground">{totalCreditsEarned}</strong>{" "}
          · Remaining:{" "}
          <strong className="text-muted-foreground">
            {Math.round(remainingCredits)}
          </strong>
        </p>
      </div>
    </div>
  );
}
