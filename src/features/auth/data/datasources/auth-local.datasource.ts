import type { SecureStorage } from '@/core/storage/secure-storage';
import type { Session } from '../../domain/entities/session';

const SESSION_KEY = 'operations-field.session';

/**
 * Sessão guardada no Keystore, com cópia em memória.
 *
 * O cliente HTTP pede o token a cada requisição; ler o Keystore toda vez seria lento, então a leitura
 * do disco acontece uma vez e as seguintes saem da memória.
 */
class AuthLocalDataSource {
	private cached: Session | null | undefined;

	constructor(private readonly storage: SecureStorage) {}

	async load(): Promise<Session | null> {
		if (this.cached !== undefined) return this.cached;
		const raw = await this.storage.get(SESSION_KEY);
		this.cached = raw ? this.parse(raw) : null;
		return this.cached;
	}

	/** Usado pelo cliente HTTP para montar o Bearer. */
	readonly getAccessToken = async (): Promise<string | null> => (await this.load())?.accessToken ?? null;

	async save(session: Session): Promise<void> {
		await this.storage.set(SESSION_KEY, JSON.stringify(session));
		this.cached = session;
	}

	async clear(): Promise<void> {
		await this.storage.remove(SESSION_KEY);
		this.cached = null;
	}

	/** Conteúdo corrompido não derruba o app: vira "sem sessão" e o usuário entra de novo. */
	private parse(raw: string): Session | null {
		try {
			return JSON.parse(raw) as Session;
		} catch {
			return null;
		}
	}
}

export { AuthLocalDataSource, SESSION_KEY };
