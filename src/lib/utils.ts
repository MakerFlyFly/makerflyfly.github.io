import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function normalizeDate(value: string) {
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

export function getFileExtension(file: File) {
  const byName = file.name.split(".").pop();

  if (byName) {
    return byName.toLowerCase();
  }

  return file.type.split("/").pop() || "bin";
}
