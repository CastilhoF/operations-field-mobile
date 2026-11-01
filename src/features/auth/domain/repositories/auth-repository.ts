import type { Result } from '@/core/utils/result';
import type { Credentials, Session } from '../entities/session';

/** Contrato de autenticação. A implementação (HTTP + Keystore) fica em `data/`. */
interface AuthRepository {
	signIn(credentials: Credentials): Promise<Result<Session>>;
	/** Sessão salva no aparelho, ou `null` se não houver. */
	restore(): Promise<Session | null>;
	signOut(): Promise<void>;
}

export type { AuthRepository };
