import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging class names with Tailwind CSS
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a timestamp into a terminal-style string.
 * @param date The date to format.
 * @returns A formatted timestamp string.
 */
export function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

/**
 * Generates a random string of characters for the matrix background.
 * @param length The length of the string to generate.
 * @returns A random string of characters.
 */
export function generateMatrixCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Returns a color class based on the threat level.
 * @param level The threat level.
 * @returns A Tailwind CSS color class.
 */
export function threatLevelColor(level: 'low' | 'medium' | 'high' | 'critical' | 'classified'): string {
  const colors = {
    low: 'text-intelligence-secure',
    medium: 'text-intelligence-warning',
    high: 'text-intelligence-threat',
    critical: 'text-intelligence-threat',
    classified: 'text-intelligence-classified',
  };
  return colors[level] || 'text-intelligence-unknown';
}
