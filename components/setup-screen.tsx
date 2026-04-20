"use client";

import { useState } from "react";

interface SetupScreenProps {
  studentId: string;
  onSetup: (name: string, program: string, level: string) => void;
  onBack: () => void;
  error: string;
}

export function SetupScreen({
  studentId,
  onSetup,
  onBack,
  error,
}: SetupScreenProps) {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetup(name, program, level);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-10 shadow-[0_0_24px_rgba(0,87,255,0.35),0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl shadow-[0_0_24px_rgba(0,87,255,0.35)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary-foreground"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Set Up Your Profile
        </h2>
        <p className="text-sm text-muted-foreground mb-7">
          Student ID <span className="font-semibold text-accent">{studentId}</span>{" "}
          - we don&apos;t have a record for this ID yet. Let&apos;s get you started.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Abena Mensah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 mb-4 bg-card border border-border rounded-lg text-foreground text-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Programme / Course of Study
          </label>
          <input
            type="text"
            placeholder="e.g. BSc Computer Science"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="w-full px-4 py-3 mb-4 bg-card border border-border rounded-lg text-foreground text-sm outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Current Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 mb-6 bg-card border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] pr-10 focus:border-primary"
          >
            {["100", "200", "300", "400", "Graduate"].map((l) => (
              <option key={l} value={l} className="bg-card">
                Level {l}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 text-sm font-semibold text-muted-foreground bg-transparent border border-border rounded-lg hover:opacity-80 transition-opacity"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg transition-all hover:opacity-90"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
