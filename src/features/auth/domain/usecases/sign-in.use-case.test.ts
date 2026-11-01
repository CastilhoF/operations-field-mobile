import { success } from '@/core/utils/result';
import type { Session } from '../entities/session';
import type { AuthRepository } from '../repositories/auth-repository';
import { SignInUseCase } from './sign-in.use-case';

const session = { accessToken: 'a' } as Session;

function buildRepository(): jest.Mocked<AuthRepository> {
	return {
		signIn: jest.fn().mockResolvedValue(success(session)),
		restore: jest.fn(),
		signOut: jest.fn(),
	};
}

describe('SignInUseCase', () => {
	it('recusa login vazio sem chamar o servidor', async () => {
		const repository = buildRepository();

		const result = await new SignInUseCase(repository).execute({ identifier: '  ', password: '12345678' });

		expect(result).toEqual({ ok: false, failure: { kind: 'validation', message: 'Informe seu login.' } });
		expect(repository.signIn).not.toHaveBeenCalled();
	});

	it('recusa senha menor que o mínimo do backend', async () => {
		const repository = buildRepository();

		const result = await new SignInUseCase(repository).execute({ identifier: 'joao', password: '123' });

		expect(result.ok).toBe(false);
		expect(repository.signIn).not.toHaveBeenCalled();
	});

	it('envia o login sem espaços nas pontas', async () => {
		const repository = buildRepository();

		const result = await new SignInUseCase(repository).execute({ identifier: ' joao ', password: '12345678' });

		expect(result).toEqual(success(session));
		expect(repository.signIn).toHaveBeenCalledWith({ identifier: 'joao', password: '12345678' });
	});
});
