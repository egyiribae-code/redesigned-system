"use client";

import { useState, useEffect, useCallback } from "react";
import type { Student } from "./types";

const STORAGE_KEY_PREFIX = "gpa-calculator:student:";

export function useStorage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const saveStudent = useCallback(
    async (data: Student): Promise<void> => {
      if (!isClient) return;
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${data.id}`,
          JSON.stringify(data)
        );
      } catch (e) {
        console.error("Failed to save student data:", e);
      }
    },
    [isClient]
  );

  const loadStudent = useCallback(
    async (id: string): Promise<Student | null> => {
      if (!isClient) return null;
      try {
        const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    },
    [isClient]
  );

  const deleteStudent = useCallback(
    async (id: string): Promise<void> => {
      if (!isClient) return;
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      } catch (e) {
        console.error("Failed to delete student data:", e);
      }
    },
    [isClient]
  );

  return { saveStudent, loadStudent, deleteStudent, isClient };
}
