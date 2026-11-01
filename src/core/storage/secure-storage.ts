import * as SecureStore from 'expo-secure-store';

/**
 * Armazenamento de segredos (tokens) no Keystore do Android.
 *
 * Nunca guarde token em AsyncStorage ou SQLite: lá ele fica legível em backup e em aparelho com root.
 */
type SecureStorage = {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<void>;
	remove(key: string): Promise<void>;
};

const expoSecureStorage: SecureStorage = {
	get: (key) => SecureStore.getItemAsync(key),
	set: (key, value) => SecureStore.setItemAsync(key, value),
	remove: (key) => SecureStore.deleteItemAsync(key),
};

export { expoSecureStorage };
export type { SecureStorage };
