"use client";

import { useState, useEffect } from "react";
import type { Student } from "@/lib/types";
import { useStorage } from "@/lib/use-storage";
import { Header } from "./header";
import { LoginScreen } from "./login-screen";
import { SetupScreen } from "./setup-screen";
import { Dashboard } from "./dashboard";

type Screen = "login" | "setup" | "dash";

export function GPACalculator() {
  const [screen, setScreen] = useState<Screen>("login");
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { saveStudent, loadStudent, isClient } = useStorage();

  // Hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (inputId: string) => {
    const id = inputId.trim().toUpperCase();
    if (!id) {
      setError("Please enter your Student ID.");
      return;
    }
    if (id.length < 4) {
      setError("Student ID must be at least 4 characters.");
      return;
    }

    setLoading(true);
    const data = await loadStudent(id);
    setLoading(false);

    setStudentId(id);
    setError("");

    if (data) {
      setStudent(data);
      setScreen("dash");
    } else {
      setScreen("setup");
    }
  };

  const handleSetup = async (name: string, program: string, level: string) => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!program.trim()) {
      setError("Please enter your programme.");
      return;
    }

    const newStudent: Student = {
      id: studentId,
      name: name.trim(),
      program: program.trim(),
      level,
      semesters: [],
    };

    await saveStudent(newStudent);
    setStudent(newStudent);
    setScreen("dash");
    setError("");
  };

  const handleLogout = () => {
    setScreen("login");
    setStudentId("");
    setStudent(null);
    setError("");
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudent(updatedStudent);
    await saveStudent(updatedStudent);
  };

  if (!mounted || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {screen === "dash" && student && (
        <Header student={student} onLogout={handleLogout} />
      )}

      {screen === "login" && (
        <LoginScreen onLogin={handleLogin} loading={loading} error={error} />
      )}

      {screen === "setup" && (
        <SetupScreen
          studentId={studentId}
          onSetup={handleSetup}
          onBack={() => {
            setScreen("login");
            setError("");
          }}
          error={error}
        />
      )}

      {screen === "dash" && student && (
        <Dashboard student={student} onUpdate={handleUpdateStudent} />
      )}
    </div>
  );
}
