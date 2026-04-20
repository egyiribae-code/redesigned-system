export interface Grade {
  label: string;
  min: number;
  max: number;
  point: number;
}

export interface Course {
  name: string;
  credit: number;
  grade: string;
}

export interface Semester {
  id: number;
  name: string;
  courses: Course[];
  gpa: number;
  credits: number;
}

export interface Student {
  id: string;
  name: string;
  program: string;
  level: string;
  semesters: Semester[];
}

export interface Classification {
  label: string;
  color: string;
}
