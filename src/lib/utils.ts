import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize URL to avoid double slashes
 * @param baseUrl - Base URL (e.g., "https://api.example.com" or "https://api.example.com/")
 * @param path - Path to append (e.g., "/auth/login" or "auth/login")
 * @returns Normalized URL
 */
export function normalizeUrl(baseUrl: string | undefined, path: string): string {
  if (!baseUrl) return path;
  
  // Remove trailing slash from baseUrl
  const cleanBase = baseUrl.replace(/\/+$/, '');
  // Remove leading slash from path
  const cleanPath = path.replace(/^\/+/, '');
  
  return `${cleanBase}/${cleanPath}`;
}
