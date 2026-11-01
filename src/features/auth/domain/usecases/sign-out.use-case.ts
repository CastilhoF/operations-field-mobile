import type { AuthRepository } from '../repositories/auth-repository';

class SignOutUseCase {
	constructor(private readonly repository: AuthRepository) {}

	execute(): Promise<void> {
		return this.repository.signOut();
	}
}

export { SignOutUseCase };
