import { HttpClient } from './http-client';
import { APP_USER_AGENT } from './user-agent';

function jsonResponse(status: number, body?: unknown): Response {
	return new Response(body === undefined ? '' : JSON.stringify(body), { status });
}

function buildClient(fetchFn: jest.Mock, token: string | null = 'token-123') {
	return new HttpClient({
		baseUrl: 'https://api.exemplo.com',
		apiPrefix: 'core',
		getAccessToken: async () => token,
		fetchFn,
	});
}

describe('HttpClient', () => {
	it('monta a URL versionada e envia Bearer e User-Agent fixo', async () => {
		const fetchFn = jest.fn().mockResolvedValue(jsonResponse(200, { id: 1 }));

		const result = await buildClient(fetchFn).get<{ id: number }>('/auth/me');

		expect(result).toEqual({ ok: true, value: { id: 1 } });
		const [url, init] = fetchFn.mock.calls[0];
		expect(url).toBe('https://api.exemplo.com/core/v1/auth/me');
		expect(init.headers.authorization).toBe('Bearer token-123');
		expect(init.headers['user-agent']).toBe(APP_USER_AGENT);
	});

	it('não envia Bearer em rota pública e serializa o corpo', async () => {
		const fetchFn = jest.fn().mockResolvedValue(jsonResponse(201, { ok: true }));

		await buildClient(fetchFn).post('auth/login/password', { identifier: 'joao' }, { authenticated: false });

		const [, init] = fetchFn.mock.calls[0];
		expect(init.headers.authorization).toBeUndefined();
		expect(init.headers['content-type']).toBe('application/json');
		expect(init.body).toBe(JSON.stringify({ identifier: 'joao' }));
	});

	it('converte falha de rede em Failure do tipo network', async () => {
		const fetchFn = jest.fn().mockRejectedValue(new TypeError('Network request failed'));

		const result = await buildClient(fetchFn).get('auth/me');

		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.failure.kind).toBe('network');
	});

	it.each([
		[401, 'unauthorized'],
		[403, 'forbidden'],
		[422, 'validation'],
		[503, 'server'],
		[404, 'unexpected'],
	])('mapeia o status %i para %s', async (status, kind) => {
		const fetchFn = jest.fn().mockResolvedValue(jsonResponse(status));

		const result = await buildClient(fetchFn).get('qualquer');

		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.failure).toMatchObject({ kind, status });
	});

	it('usa a mensagem do backend, juntando a lista de validação', async () => {
		const fetchFn = jest.fn().mockResolvedValue(jsonResponse(400, { message: ['senha curta', 'login vazio'], status: 400 }));

		const result = await buildClient(fetchFn).post('auth/login/password', {});

		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.failure.message).toBe('senha curta\nlogin vazio');
	});
});
