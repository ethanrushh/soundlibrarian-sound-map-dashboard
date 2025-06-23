import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isDevelopment() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}

export const apiUrl = () => isDevelopment() ? 'http://localhost:5077/api/v1' : 'https://server.ehvbfwjsdhuifsayaas.com/api/v1'
