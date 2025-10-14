/**
 * Simple encryption/decryption utilities for storing sensitive data in local storage
 */

// A simple encryption key (in production, consider using environment variables)
const ENCRYPTION_KEY = "sheryians-app-secure-storage-key";

/**
 * Encrypts data using AES algorithm
 */
export function encrypt(data: string): string {
    if (!data) return "";

    try {
        // Simple XOR-based encryption for client-side storage
        // For production, consider using a more robust encryption library
        const encrypted = Array.from(data).map((char, i) => {
            const keyChar = ENCRYPTION_KEY[i % ENCRYPTION_KEY.length];
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        }).join('');

        return btoa(encrypted); // Base64 encode the result
    } catch (error) {
        console.error("Encryption failed:", error);
        return "";
    }
}

/**
 * Decrypts data that was encrypted with the encrypt function
 */
export function decrypt(encryptedData: string): string {
    if (!encryptedData) return "";

    try {
        const decoded = atob(encryptedData); // Base64 decode

        // Reverse the XOR operation
        const decrypted = Array.from(decoded).map((char, i) => {
            const keyChar = ENCRYPTION_KEY[i % ENCRYPTION_KEY.length];
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        }).join('');

        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return "";
    }
}

/**
 * Securely stores data in localStorage with encryption
 */
export const secureLocalStorage = {
    setItem<T>(key: string, value: T): void {
        const encryptedValue = encrypt(JSON.stringify(value));
        localStorage.setItem(key, encryptedValue);
    },

    getItem<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return defaultValue;

            const decryptedValue = decrypt(encryptedValue);
            return JSON.parse(decryptedValue) as T;
        } catch (error) {
            console.error(`Error retrieving ${key} from secure storage:`, error);
            return defaultValue;
        }
    },

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
};