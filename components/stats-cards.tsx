"use client";

import type { Student, Classification } from "@/lib/types";

interface StatsCardsProps {
  cgpa: number;
  classification: Classification;
  student: Student;
  totalCredits: number;
}

export function StatsCards({
  cgpa,
  classification,
  student,
  totalCredits,
}: StatsCardsProps) {
  const lastSemGpa = student.semesters.length
    ? student.semesters[student.semesters.length - 1].gpa
    : null;

  const gpaDiff =
    student.semesters.length > 1
      ? lastSemGpa! - student.semesters[student.semesters.length - 2].gpa
      : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="relative bg-surface border border-border rounded-xl p-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
        <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
          Cumulative GPA
        </p>
        <p className="font-mono text-3xl font-bold text-accent leading-none">
          {cgpa.toFixed(2)}
        </p>
        <span
          className="inline-block mt-2 px-2 py-0.5 text-[11px] font-medium rounded-full"
          style={{
            backgroundColor: `${classification.color}20`,
            color: classification.color,
          }}
        >
          {classification.label}
        </span>
      </div>

      <div className="relative bg-surface border border-border rounded-xl p-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
        <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
          Semesters Completed
        </p>
        <p className="font-mono text-3xl font-bold text-primary-light leading-none">
          {student.semesters.length}
        </p>
        <p className="text-xs text-muted mt-1">{student.program}</p>
      </div>

      <div className="relative bg-surface border border-border rounded-xl p-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
        <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
          Credits Earned
        </p>
        <p className="font-mono text-3xl font-bold text-foreground leading-none">
          {totalCredits}
        </p>
        <p className="text-xs text-muted mt-1">credit hours</p>
      </div>

      <div className="relative bg-surface border border-border rounded-xl p-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
        <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
          Last Semester GPA
        </p>
        <p
          className={`font-mono text-3xl font-bold leading-none ${lastSemGpa !== null ? "text-foreground" : "text-muted"}`}
        >
          {lastSemGpa !== null ? lastSemGpa.toFixed(2) : "-"}
        </p>
        {gpaDiff !== null && (
          <p
            className={`text-xs mt-1 ${gpaDiff >= 0 ? "text-accent" : "text-destructive"}`}
          >
            {gpaDiff >= 0 ? "▲" : "▼"} {Math.abs(gpaDiff).toFixed(2)} from last
            sem
          </p>
        )}
      </div>
    </div>
  );
}
