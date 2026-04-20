"use client";

import type { Student } from "@/lib/types";

interface HeaderProps {
  student: Student;
  onLogout: () => void;
}

export function Header({ student, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 bg-gradient-to-r from-surface to-[#061535] border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent font-bold text-sm text-primary-foreground">
          GPA
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            GPA Tracker
          </h1>
          <p className="text-xs text-muted-foreground">
            Ghana University Academic Portal
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-muted-foreground">
          {student.name}
        </span>
        <span className="px-3 py-1 text-xs font-mono text-accent bg-accent/10 border border-accent/25 rounded-full">
          {student.id}
        </span>
        <button
          onClick={onLogout}
          className="px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-lg hover:border-muted hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
