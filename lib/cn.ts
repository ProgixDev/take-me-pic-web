import clsx, { type ClassValue } from "clsx";

/** Tiny class combiner. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
