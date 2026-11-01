// expo-secure-store fala com o Keystore do Android; nos testes ele vira um mapa em memória.
jest.mock('expo-secure-store', () => {
	const store = new Map<string, string>();
	return {
		getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
		setItemAsync: jest.fn(async (key: string, value: string) => {
			store.set(key, value);
		}),
		deleteItemAsync: jest.fn(async (key: string) => {
			store.delete(key);
		}),
	};
});
