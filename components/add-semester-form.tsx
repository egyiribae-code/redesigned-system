"use client";

import { useState } from "react";
import { GRADE_SCALE, SEMESTER_NAMES } from "@/lib/grading";

interface CourseInput {
  id: number;
  name: string;
  credit: string;
  grade: string;
}

interface AddSemesterFormProps {
  onSubmit: (name: string, courses: Array<{ name: string; credit: number; grade: string }>) => void;
  onCancel: () => void;
  error: string;
}

export function AddSemesterForm({ onSubmit, onCancel, error }: AddSemesterFormProps) {
  const [semName, setSemName] = useState("");
  const [customName, setCustomName] = useState("");
  const [courses, setCourses] = useState<CourseInput[]>([
    { id: 1, name: "", credit: "", grade: "" },
    { id: 2, name: "", credit: "", grade: "" },
    { id: 3, name: "", credit: "", grade: "" },
  ]);

  const addCourseRow = () => {
    setCourses((prev) => [...prev, { id: Date.now(), name: "", credit: "", grade: "" }]);
  };

  const removeCourseRow = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: number, field: keyof CourseInput, value: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = semName === "custom" ? customName : semName;
    const validCourses = courses
      .filter((c) => c.name.trim() && c.credit && c.grade)
      .map((c) => ({
        name: c.name.trim(),
        credit: parseFloat(c.credit),
        grade: c.grade,
      }));
    onSubmit(finalName, validCourses);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mt-3">
      <h4 className="text-sm font-semibold text-foreground mb-4">New Semester</h4>

      {error && (
        <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-2">
          Semester Name
        </label>
        <select
          value={semName}
          onChange={(e) => setSemName(e.target.value)}
          className="w-full px-3 py-2.5 mb-3 bg-surface border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8 focus:border-primary"
        >
          <option value="">- Select semester -</option>
          {SEMESTER_NAMES.map((n) => (
            <option key={n} value={n} className="bg-surface">
              {n}
            </option>
          ))}
          <option value="custom" className="bg-surface">
            Custom...
          </option>
        </select>

        {semName === "custom" && (
          <input
            type="text"
            placeholder="e.g. Resit Semester"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-3 py-2.5 mb-3 bg-surface border border-border rounded-lg text-foreground text-sm outline-none placeholder:text-muted focus:border-primary"
          />
        )}

        <div className="grid grid-cols-[2fr_80px_80px_32px] gap-2 mb-1 text-[10px] text-muted uppercase tracking-wider">
          <span>Course Name</span>
          <span className="text-center">Credits</span>
          <span className="text-center">Grade</span>
          <span />
        </div>

        {courses.map((c) => (
          <div key={c.id} className="grid grid-cols-[2fr_80px_80px_32px] gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="e.g. MATH 201"
              value={c.name}
              onChange={(e) => updateCourse(c.id, "name", e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm outline-none placeholder:text-muted focus:border-primary"
            />
            <input
              type="number"
              placeholder="3"
              min="1"
              max="6"
              value={c.credit}
              onChange={(e) => updateCourse(c.id, "credit", e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm outline-none placeholder:text-muted focus:border-primary text-center"
            />
            <select
              value={c.grade}
              onChange={(e) => updateCourse(c.id, "grade", e.target.value)}
              className="w-full px-2 py-2 bg-surface border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%235B7BAE%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center] pr-6 focus:border-primary"
            >
              <option value="">-</option>
              {GRADE_SCALE.map((g) => (
                <option key={g.label} value={g.label} className="bg-surface">
                  {g.label} ({g.point.toFixed(1)})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeCourseRow(c.id)}
              className="p-1.5 text-muted rounded-md hover:text-destructive hover:bg-destructive/10 transition-colors"
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
          </div>
        ))}

        <button
          type="button"
          onClick={addCourseRow}
          className="mt-1 px-3 py-1.5 text-xs font-medium text-primary-light bg-primary/10 border border-border rounded-lg hover:bg-primary/20 transition-colors"
        >
          + Add course
        </button>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground bg-transparent border border-border rounded-lg hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Semester
          </button>
        </div>
      </form>
    </div>
  );
}
