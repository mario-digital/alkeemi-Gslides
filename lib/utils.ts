import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoid(length = 8): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function ptToPixels(pt: number, dpi = 96): number {
  return (pt * dpi) / 72;
}

export function pixelsToPt(pixels: number, dpi = 96): number {
  return (pixels * 72) / dpi;
}

export function emuToPt(emu: number): number {
  return emu / 12700;
}

export function ptToEmu(pt: number): number {
  return pt * 12700;
}
