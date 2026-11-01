import { failure, type Result } from '@/core/utils/result';
import type { Credentials, Session } from '../entities/session';
import type { AuthRepository } from '../repositories/auth-repository';

/** Mesmo limite do backend (`LoginWithPasswordInput`): validar aqui evita a ida ao servidor. */
const MIN_PASSWORD_LENGTH = 8;

class SignInUseCase {
	constructor(private readonly repository: AuthRepository) {}

	async execute(credentials: Credentials): Promise<Result<Session>> {
		const identifier = credentials.identifier.trim();
		if (!identifier) {
			return failure({ kind: 'validation', message: 'Informe seu login.' });
		}
		if (credentials.password.length < MIN_PASSWORD_LENGTH) {
			return failure({ kind: 'validation', message: `A senha tem pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` });
		}
		return this.repository.signIn({ identifier, password: credentials.password });
	}
}

export { MIN_PASSWORD_LENGTH, SignInUseCase };
