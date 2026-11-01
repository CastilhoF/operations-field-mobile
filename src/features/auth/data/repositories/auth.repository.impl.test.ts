import { HttpClient } from '@/core/network/http-client';
import type { SecureStorage } from '@/core/storage/secure-storage';
import { AuthLocalDataSource, SESSION_KEY } from '../datasources/auth-local.datasource';
import { AuthRemoteDataSource } from '../datasources/auth-remote.datasource';
import { AuthRepositoryImpl } from './auth.repository.impl';

function memoryStorage(): SecureStorage & { data: Map<string, string> } {
	const data = new Map<string, string>();
	return {
		data,
		get: async (key) => data.get(key) ?? null,
		set: async (key, value) => {
			data.set(key, value);
		},
		remove: async (key) => {
			data.delete(key);
		},
	};
}

const loginBody = {
	tokenType: 'Bearer',
	accessToken: 'access',
	refreshToken: 'refresh',
	accessTokenExpiresInSeconds: 900,
	refreshTokenExpiresInSeconds: 3600,
	user: { id: 'u1', tenantId: 't1', name: 'Maria', email: 'maria@exemplo.com', role: 'OPERATOR' },
};

function build(fetchFn: jest.Mock) {
	const storage = memoryStorage();
	const local = new AuthLocalDataSource(storage);
	const http = new HttpClient({
		baseUrl: 'https://api.exemplo.com',
		apiPrefix: 'core',
		getAccessToken: async () => (await local.load())?.accessToken ?? null,
		fetchFn,
	});
	return { storage, repository: new AuthRepositoryImpl(new AuthRemoteDataSource(http), local) };
}

describe('AuthRepositoryImpl', () => {
	it('salva a sessão no Keystore após o login', async () => {
		const fetchFn = jest.fn().mockResolvedValue(new Response(JSON.stringify(loginBody), { status: 201 }));
		const { storage, repository } = build(fetchFn);

		const result = await repository.signIn({ identifier: 'maria', password: '12345678' });

		expect(result.ok).toBe(true);
		expect(JSON.parse(storage.data.get(SESSION_KEY) ?? '{}').accessToken).toBe('access');
	});

	it('não salva nada quando o login falha', async () => {
		const fetchFn = jest.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'invalid credentials' }), { status: 401 }));
		const { storage, repository } = build(fetchFn);

		const result = await repository.signIn({ identifier: 'maria', password: '12345678' });

		expect(result).toMatchObject({ ok: false, failure: { kind: 'unauthorized', message: 'invalid credentials' } });
		expect(storage.data.size).toBe(0);
	});

	it('limpa a sessão local mesmo sem rede no logout', async () => {
		const fetchFn = jest
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify(loginBody), { status: 201 }))
			.mockRejectedValueOnce(new TypeError('Network request failed'));
		const { storage, repository } = build(fetchFn);
		await repository.signIn({ identifier: 'maria', password: '12345678' });

		await repository.signOut();

		expect(storage.data.size).toBe(0);
		await expect(repository.restore()).resolves.toBeNull();
	});
});
