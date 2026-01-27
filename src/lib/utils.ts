import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isDevelopment() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}

export const apiUrl = () => isDevelopment() ? 'http://localhost:5077/api/v1' : 'https://api.soundmap.soundlibrarian.com/api/v1'

export function stringToColorHex(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // force 32-bit
  }

  const color = (hash >>> 0).toString(16).padStart(8, "0");
  return "#" + color.slice(2, 8); // last 6 hex chars
}

export function textColorForBackground(bgHex: string): "#000000" | "#ffffff" {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) +
    0.7152 * toLinear(g) +
    0.0722 * toLinear(b);

  // WCAG threshold
  return luminance > 0.3 ? "#000000" : "#ffffff";
}
