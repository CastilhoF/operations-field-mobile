import type { Session } from '../entities/session';
import type { AuthRepository } from '../repositories/auth-repository';
import { RestoreSessionUseCase } from './restore-session.use-case';

const NOW = 1_000_000;

function buildRepository(session: Session | null): jest.Mocked<AuthRepository> {
	return {
		signIn: jest.fn(),
		restore: jest.fn().mockResolvedValue(session),
		signOut: jest.fn().mockResolvedValue(undefined),
	};
}

describe('RestoreSessionUseCase', () => {
	it('devolve null quando não há sessão salva', async () => {
		await expect(new RestoreSessionUseCase(buildRepository(null), () => NOW).execute()).resolves.toBeNull();
	});

	it('mantém a sessão com refresh token válido', async () => {
		const session = { refreshTokenExpiresAt: NOW + 1 } as Session;

		await expect(new RestoreSessionUseCase(buildRepository(session), () => NOW).execute()).resolves.toBe(session);
	});

	it('descarta a sessão com refresh token vencido', async () => {
		const repository = buildRepository({ refreshTokenExpiresAt: NOW } as Session);

		await expect(new RestoreSessionUseCase(repository, () => NOW).execute()).resolves.toBeNull();
		expect(repository.signOut).toHaveBeenCalled();
	});
});
