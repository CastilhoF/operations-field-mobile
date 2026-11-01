import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Result } from '@/core/utils/result';
import type { AuthUseCases } from '../../auth.module';
import type { Credentials, Session } from '../../domain/entities/session';

/**
 * Estado global de autenticação, consumido pelo guard de rotas (`src/app/_layout.tsx`) e pelas telas.
 *
 * `restoring` existe para o app não piscar a tela de login enquanto lê a sessão do Keystore.
 */
type SessionStatus = 'restoring' | 'signed-out' | 'signed-in';

type SessionContextValue = {
	status: SessionStatus;
	session: Session | null;
	signIn(credentials: Credentials): Promise<Result<Session>>;
	signOut(): Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = {
	useCases: AuthUseCases;
	children: ReactNode;
};

function SessionProvider({ useCases, children }: SessionProviderProps) {
	const [status, setStatus] = useState<SessionStatus>('restoring');
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		let active = true;
		useCases.restoreSession
			.execute()
			.catch(() => null)
			.then((restored) => {
				if (!active) return;
				setSession(restored);
				setStatus(restored ? 'signed-in' : 'signed-out');
			});
		return () => {
			active = false;
		};
	}, [useCases]);

	const signIn = useCallback(
		async (credentials: Credentials) => {
			const result = await useCases.signIn.execute(credentials);
			if (result.ok) {
				setSession(result.value);
				setStatus('signed-in');
			}
			return result;
		},
		[useCases],
	);

	const signOut = useCallback(async () => {
		await useCases.signOut.execute();
		setSession(null);
		setStatus('signed-out');
	}, [useCases]);

	const value = useMemo(() => ({ status, session, signIn, signOut }), [status, session, signIn, signOut]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

function useSession(): SessionContextValue {
	const context = useContext(SessionContext);
	if (!context) throw new Error('useSession precisa estar dentro de <SessionProvider>.');
	return context;
}

export { SessionProvider, useSession };
export type { SessionContextValue, SessionStatus };
