import type { Grade, Course, Semester, Classification } from "./types";

export const GRADE_SCALE: Grade[] = [
  { label: "A", min: 80, max: 100, point: 4.0 },
  { label: "B+", min: 75, max: 79, point: 3.5 },
  { label: "B", min: 70, max: 74, point: 3.0 },
  { label: "C+", min: 65, max: 69, point: 2.5 },
  { label: "C", min: 60, max: 64, point: 2.0 },
  { label: "D+", min: 55, max: 59, point: 1.5 },
  { label: "D", min: 50, max: 54, point: 1.0 },
  { label: "F", min: 0, max: 49, point: 0.0 },
];

export const SEMESTER_NAMES = [
  "Year 1 - Semester 1",
  "Year 1 - Semester 2",
  "Year 2 - Semester 1",
  "Year 2 - Semester 2",
  "Year 3 - Semester 1",
  "Year 3 - Semester 2",
  "Year 4 - Semester 1",
  "Year 4 - Semester 2",
];

export function scoreToGrade(score: number): Grade | null {
  if (isNaN(score)) return null;
  return (
    GRADE_SCALE.find((g) => score >= g.min && score <= g.max) ||
    GRADE_SCALE[GRADE_SCALE.length - 1]
  );
}

export function gradeToPoint(label: string): number {
  const grade = GRADE_SCALE.find((g) => g.label === label);
  return grade ? grade.point : 0;
}

export function calcGPA(courses: Course[]): number {
  const valid = courses.filter((c) => c.credit > 0 && c.grade !== "");
  if (!valid.length) return 0;
  const totalPoints = valid.reduce(
    (sum, c) => sum + gradeToPoint(c.grade) * c.credit,
    0
  );
  const totalCredits = valid.reduce((sum, c) => sum + c.credit, 0);
  return totalCredits ? totalPoints / totalCredits : 0;
}

export function calcCGPA(semesters: Semester[]): number {
  const allCourses = semesters.flatMap((s) => s.courses);
  return calcGPA(allCourses);
}

export function getClassification(cgpa: number): Classification {
  if (cgpa >= 3.6) return { label: "First Class", color: "#00C4B4" };
  if (cgpa >= 3.0) return { label: "Second Class Upper", color: "#3380FF" };
  if (cgpa >= 2.0) return { label: "Second Class Lower", color: "#8AAAD4" };
  if (cgpa >= 1.5) return { label: "Third Class", color: "#FFB74D" };
  return { label: "Fail / Referral", color: "#EF9A9A" };
}

export function getGradeColor(label: string): string {
  if (label?.startsWith("A")) return "bg-accent/20 text-accent";
  if (label?.startsWith("B")) return "bg-primary/20 text-primary-light";
  if (label?.startsWith("C")) return "bg-muted/20 text-muted-foreground";
  if (label?.startsWith("D")) return "bg-warning/20 text-warning";
  return "bg-destructive/20 text-destructive";
}
