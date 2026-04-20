"use client";

import { useState } from "react";

interface LoginScreenProps {
  onLogin: (id: string) => void;
  loading: boolean;
  error: string;
}

export function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [inputId, setInputId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(inputId);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-5 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,87,255,0.15)_0%,transparent_70%)]">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-10 shadow-[0_0_24px_rgba(0,87,255,0.35),0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl shadow-[0_0_24px_rgba(0,87,255,0.35)]">
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
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Enter your Student ID to access your GPA dashboard and academic
          performance tracker.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Student ID
          </label>
          <input
            type="text"
            placeholder="e.g. UG/20/0123"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="w-full px-4 py-3 mb-4 bg-card border border-border rounded-lg text-foreground font-mono text-sm outline-none transition-all placeholder:text-muted placeholder:font-sans focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Access Dashboard"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          New students will be prompted to set up their profile on first login.
        </p>
      </div>
    </div>
  );
}
