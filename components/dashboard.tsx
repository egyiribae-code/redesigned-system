"use client";

import { useState } from "react";
import type { Student } from "@/lib/types";
import { calcGPA, calcCGPA, getClassification } from "@/lib/grading";
import { StatsCards } from "./stats-cards";
import { GPAChart } from "./gpa-chart";
import { SemesterList } from "./semester-list";
import { AddSemesterForm } from "./add-semester-form";
import { TargetGPA } from "./target-gpa";
import { GradeReference } from "./grade-reference";

interface DashboardProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

export function Dashboard({ student, onUpdate }: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");

  const cgpa = calcCGPA(student.semesters);
  const classification = getClassification(cgpa);
  const totalCredits = student.semesters.reduce(
    (s, sem) => s + (sem.credits || 0),
    0
  );

  const chartData = student.semesters.map((sem, i) => {
    const runningCourses = student.semesters
      .slice(0, i + 1)
      .flatMap((s) => s.courses);
    return {
      name: sem.name.replace("Year ", "Y").replace(" - Semester ", "S"),
      "Semester GPA": parseFloat(sem.gpa.toFixed(2)),
      CGPA: parseFloat(calcGPA(runningCourses).toFixed(2)),
    };
  });

  const handleAddSemester = (
    name: string,
    courses: Array<{ name: string; credit: number; grade: string }>
  ) => {
    if (!name.trim()) {
      setFormError("Please enter a semester name.");
      return;
    }
    if (!courses.length) {
      setFormError("Add at least one course with name, credit, and grade.");
      return;
    }

    const gpa = calcGPA(courses);
    const credits = courses.reduce((s, c) => s + c.credit, 0);

    const newSem = {
      id: Date.now(),
      name: name.trim(),
      courses,
      gpa,
      credits,
    };

    const updated = {
      ...student,
      semesters: [...student.semesters, newSem],
    };

    onUpdate(updated);
    setShowAddForm(false);
    setFormError("");
  };

  const handleDeleteSemester = (semId: number) => {
    const updated = {
      ...student,
      semesters: student.semesters.filter((s) => s.id !== semId),
    };
    onUpdate(updated);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-7">
      <StatsCards
        cgpa={cgpa}
        classification={classification}
        student={student}
        totalCredits={totalCredits}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <div className="flex flex-col gap-5">
          <GPAChart data={chartData} />

          <SemesterList
            semesters={student.semesters}
            onDelete={handleDeleteSemester}
            onAddClick={() => setShowAddForm(true)}
          />

          {showAddForm && (
            <AddSemesterForm
              onSubmit={handleAddSemester}
              onCancel={() => {
                setShowAddForm(false);
                setFormError("");
              }}
              error={formError}
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          <TargetGPA currentCGPA={cgpa} totalCreditsEarned={totalCredits} />
          <GradeReference />
        </div>
      </div>
    </div>
  );
}
