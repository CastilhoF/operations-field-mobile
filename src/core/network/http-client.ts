import { failure, success, type Failure, type FailureKind, type Result } from '@/core/utils/result';
import { APP_USER_AGENT } from './user-agent';

/**
 * Cliente HTTP único do app para a API do backend.
 *
 * O web não chama o backend direto: o BFF do Next guarda o token em cookie e injeta o Bearer. Aqui o
 * app faz esse papel. Toda chamada passa por este cliente, que monta a URL (`/<prefixo>/v1/...`),
 * envia o Bearer e o User-Agent fixo e converte a resposta em `Result` — nenhuma camada acima lida
 * com `fetch`, status HTTP ou corpo de erro do backend.
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
	body?: unknown;
	/** Rotas públicas (login, refresh) não enviam o Bearer. */
	authenticated?: boolean;
	version?: string;
	headers?: Record<string, string>;
};

type HttpClientOptions = {
	baseUrl: string;
	apiPrefix: string;
	getAccessToken: () => Promise<string | null>;
	fetchFn?: typeof fetch;
};

const DEFAULT_MESSAGES: Record<FailureKind, string> = {
	unauthorized: 'Sua sessão expirou. Entre novamente.',
	forbidden: 'Você não tem permissão para esta ação.',
	validation: 'Confira os dados informados.',
	network: 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
	server: 'O servidor não conseguiu processar a solicitação. Tente de novo em instantes.',
	unexpected: 'Algo deu errado. Tente de novo.',
};

function kindFromStatus(status: number): FailureKind {
	if (status === 401) return 'unauthorized';
	if (status === 403) return 'forbidden';
	if (status === 400 || status === 409 || status === 422) return 'validation';
	if (status >= 500) return 'server';
	return 'unexpected';
}

/** O backend responde `{ message }`, com `message` em lista quando o erro é de validação. */
function messageFromBody(body: unknown): string | undefined {
	if (!body || typeof body !== 'object' || !('message' in body)) return undefined;
	const { message } = body as { message: unknown };
	if (typeof message === 'string' && message.trim()) return message;
	if (Array.isArray(message)) {
		const parts = message.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
		return parts.length > 0 ? parts.join('\n') : undefined;
	}
	return undefined;
}

async function readJson(response: Response): Promise<unknown> {
	const text = await response.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return undefined;
	}
}

class HttpClient {
	private readonly fetchFn: typeof fetch;

	constructor(private readonly options: HttpClientOptions) {
		this.fetchFn = options.fetchFn ?? fetch;
	}

	get<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<Result<T>> {
		return this.request<T>('GET', path, options);
	}

	post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<Result<T>> {
		return this.request<T>('POST', path, { ...options, body });
	}

	async request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<Result<T>> {
		const { body, authenticated = true, version = 'v1', headers: extraHeaders } = options;
		const url = `${this.options.baseUrl}/${this.options.apiPrefix}/${version}/${path.replace(/^\/+/, '')}`;

		const headers: Record<string, string> = {
			accept: 'application/json',
			'user-agent': APP_USER_AGENT,
			...extraHeaders,
		};
		if (body !== undefined) headers['content-type'] = 'application/json';
		if (authenticated) {
			const token = await this.options.getAccessToken();
			if (token) headers.authorization = `Bearer ${token}`;
		}

		let response: Response;
		try {
			response = await this.fetchFn(url, {
				method,
				headers,
				...(body !== undefined ? { body: JSON.stringify(body) } : {}),
			});
		} catch {
			return failure({ kind: 'network', message: DEFAULT_MESSAGES.network });
		}

		const payload = await readJson(response);
		if (response.ok) return success(payload as T);

		const kind = kindFromStatus(response.status);
		const error: Failure = {
			kind,
			status: response.status,
			message: messageFromBody(payload) ?? DEFAULT_MESSAGES[kind],
		};
		return failure(error);
	}
}

export { HttpClient };
export type { HttpClientOptions, HttpMethod, RequestOptions };
