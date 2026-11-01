import type { HttpClient } from '@/core/network/http-client';
import type { SecureStorage } from '@/core/storage/secure-storage';
import { AuthLocalDataSource } from './data/datasources/auth-local.datasource';
import { AuthRemoteDataSource } from './data/datasources/auth-remote.datasource';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { RestoreSessionUseCase } from './domain/usecases/restore-session.use-case';
import { SignInUseCase } from './domain/usecases/sign-in.use-case';
import { SignOutUseCase } from './domain/usecases/sign-out.use-case';

/**
 * Montagem da feature: liga datasources, repositório e use cases.
 *
 * A sessão nasce antes do cliente HTTP porque é ela que fornece o Bearer; por isso são duas
 * funções. Quem chama as duas, na ordem, é a composição raiz (`src/bootstrap/dependencies.ts`).
 */
type SessionStore = AuthLocalDataSource;

type AuthUseCases = {
	signIn: SignInUseCase;
	signOut: SignOutUseCase;
	restoreSession: RestoreSessionUseCase;
};

function createSessionStore(storage: SecureStorage): SessionStore {
	return new AuthLocalDataSource(storage);
}

function createAuthModule(http: HttpClient, sessionStore: SessionStore): AuthUseCases {
	const repository = new AuthRepositoryImpl(new AuthRemoteDataSource(http), sessionStore);
	return {
		signIn: new SignInUseCase(repository),
		signOut: new SignOutUseCase(repository),
		restoreSession: new RestoreSessionUseCase(repository),
	};
}

export { createAuthModule, createSessionStore };
export type { AuthUseCases, SessionStore };
