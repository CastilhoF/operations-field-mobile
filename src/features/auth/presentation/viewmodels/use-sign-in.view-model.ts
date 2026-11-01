import { useCallback, useState } from 'react';
import { useSession } from '../session/session-provider';

/**
 * ViewModel da tela de login: guarda o formulário e o estado do envio. A tela só lê `state` e chama
 * as ações; a regra (validação, chamada, persistência) fica no use case.
 */
type SignInState = {
	identifier: string;
	password: string;
	submitting: boolean;
	error: string | null;
};

const INITIAL_STATE: SignInState = { identifier: '', password: '', submitting: false, error: null };

function useSignInViewModel() {
	const { signIn } = useSession();
	const [state, setState] = useState<SignInState>(INITIAL_STATE);

	const setIdentifier = useCallback((identifier: string) => setState((current) => ({ ...current, identifier, error: null })), []);
	const setPassword = useCallback((password: string) => setState((current) => ({ ...current, password, error: null })), []);

	const submit = useCallback(async () => {
		setState((current) => ({ ...current, submitting: true, error: null }));
		const result = await signIn({ identifier: state.identifier, password: state.password });
		// No sucesso a tela é desmontada pelo guard de rotas; só a falha volta para o formulário.
		if (!result.ok) {
			setState((current) => ({ ...current, submitting: false, error: result.failure.message }));
		}
	}, [signIn, state.identifier, state.password]);

	return { state, setIdentifier, setPassword, submit };
}

export { useSignInViewModel };
export type { SignInState };
