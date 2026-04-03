class LocalStorageService {
  getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  setItem<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }

  exists(key: string): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) !== null;
  }
}

export const localStorageService = new LocalStorageService();
