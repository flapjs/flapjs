/**
 * A wrapper for a more intuitive use of LocalStorage.
 */
export class LocalStorage {
    static setItem(key, value) {
        if (typeof value !== 'string') {
            throw new Error('LocalStorage item value must be a string.');
        }
        if (!this.isSupported()) return;

        // Don't save anything if hidden...
        if (document.hidden) return;

        if (value) {
            localStorage.setItem(key, value);
        }
        else {
            localStorage.removeItem(key);
        }
    }

    static getItem(key, defaultValue = null) {
        if (!this.isSupported()) return defaultValue;
        return localStorage.getItem(key) || defaultValue;
    }

    static clear() {
        if (!this.isSupported()) return;
        localStorage.clear();
    }

    static isSupported() {
        return typeof localStorage !== 'undefined';
    }
}
