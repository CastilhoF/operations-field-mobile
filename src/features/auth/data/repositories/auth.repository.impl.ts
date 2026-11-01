import { success, type Result } from '@/core/utils/result';
import type { Credentials, Session } from '../../domain/entities/session';
import type { AuthRepository } from '../../domain/repositories/auth-repository';
import type { AuthLocalDataSource } from '../datasources/auth-local.datasource';
import type { AuthRemoteDataSource } from '../datasources/auth-remote.datasource';
import { toSession } from '../mappers/session.mapper';

class AuthRepositoryImpl implements AuthRepository {
	constructor(
		private readonly remote: AuthRemoteDataSource,
		private readonly local: AuthLocalDataSource,
	) {}

	async signIn(credentials: Credentials): Promise<Result<Session>> {
		const response = await this.remote.login(credentials);
		if (!response.ok) return response;
		const session = toSession(response.value);
		await this.local.save(session);
		return success(session);
	}

	restore(): Promise<Session | null> {
		return this.local.load();
	}

	/**
	 * Sair limpa o aparelho mesmo sem rede: avisar o backend é cortesia (revoga a sessão lá), mas não
	 * pode prender o usuário logado num aparelho compartilhado.
	 */
	async signOut(): Promise<void> {
		const session = await this.local.load();
		if (session) await this.remote.logout();
		await this.local.clear();
	}
}

export { AuthRepositoryImpl };
