"use client";

import { useState } from "react";
import type { Semester } from "@/lib/types";
import { gradeToPoint, getGradeColor } from "@/lib/grading";

interface SemesterListProps {
  semesters: Semester[];
  onDelete: (id: number) => void;
  onAddClick: () => void;
}

function GradePill({ label }: { label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs font-bold ${getGradeColor(label)}`}>
      {label}
    </span>
  );
}

export function SemesterList({ semesters, onDelete, onAddClick }: SemesterListProps) {
  const [openSems, setOpenSems] = useState<Record<number, boolean>>({});

  const toggleSem = (id: number) => {
    setOpenSems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">
            Semester Records
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {semesters.length} semester{semesters.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
      </div>
      <div className="p-5">
        {semesters.length === 0 && (
          <div className="text-center py-10 text-muted text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 mx-auto mb-3 text-muted"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            No semesters yet. Add your first semester below.
          </div>
        )}

        {semesters.map((sem) => (
          <div
            key={sem.id}
            className="border border-border rounded-xl mb-3 overflow-hidden transition-colors hover:border-primary"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-card"
              onClick={() => toggleSem(sem.id)}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {sem.name}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {sem.courses.length} courses · {sem.credits} credits
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-lg font-bold text-accent">
                  {sem.gpa.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sem.id);
                  }}
                  className="p-1.5 text-muted rounded-md hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete semester"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-4 h-4 text-muted transition-transform ${openSems[sem.id] ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {openSems[sem.id] && (
              <div className="p-4 border-t border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] text-muted uppercase tracking-wide">
                      <th className="text-left pb-2 font-medium">Course</th>
                      <th className="text-center pb-2 font-medium">Credits</th>
                      <th className="text-center pb-2 font-medium">Grade</th>
                      <th className="text-right pb-2 font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((c, i) => (
                      <tr
                        key={i}
                        className="border-t border-border/50 last:border-b-0"
                      >
                        <td className="py-2 text-foreground">{c.name}</td>
                        <td className="py-2 text-center">{c.credit}</td>
                        <td className="py-2 text-center">
                          <GradePill label={c.grade} />
                        </td>
                        <td className="py-2 text-right font-mono text-accent text-sm">
                          {(gradeToPoint(c.grade) * c.credit).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="h-1 bg-border rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${(sem.gpa / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 w-full p-3 text-sm font-medium text-primary-light bg-primary/10 border border-dashed border-primary rounded-xl hover:bg-primary/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Semester
        </button>
      </div>
    </div>
  );
}
