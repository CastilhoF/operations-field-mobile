import type { Session } from '../entities/session';
import type { AuthRepository } from '../repositories/auth-repository';

/**
 * Recupera a sessão salva ao abrir o app.
 *
 * Refresh token vencido é sessão morta: descarta e manda para o login. Access token vencido com
 * refresh válido continua valendo — a renovação é feita pela subtarefa de autenticação.
 */
class RestoreSessionUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly now: () => number = Date.now,
	) {}

	async execute(): Promise<Session | null> {
		const session = await this.repository.restore();
		if (!session) return null;
		if (session.refreshTokenExpiresAt <= this.now()) {
			await this.repository.signOut();
			return null;
		}
		return session;
	}
}

export { RestoreSessionUseCase };
