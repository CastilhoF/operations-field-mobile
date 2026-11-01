import { fireEvent, render, screen } from '@testing-library/react-native';
import { failure, success } from '@/core/utils/result';
import type { AuthUseCases } from '../../auth.module';
import type { Session } from '../../domain/entities/session';
import { SessionProvider } from '../session/session-provider';
import { LoginScreen } from './login-screen';

jest.mock('react-native-safe-area-context', () => {
	const { View } = jest.requireActual('react-native');
	return { SafeAreaView: View };
});

function buildUseCases(signInResult = success({ accessToken: 'a' } as Session)): AuthUseCases {
	return {
		signIn: { execute: jest.fn().mockResolvedValue(signInResult) },
		signOut: { execute: jest.fn() },
		restoreSession: { execute: jest.fn().mockResolvedValue(null) },
	} as unknown as AuthUseCases;
}

async function renderLogin(useCases: AuthUseCases) {
	await render(
		<SessionProvider useCases={useCases}>
			<LoginScreen />
		</SessionProvider>,
	);
}

describe('LoginScreen', () => {
	it('envia login e senha digitados', async () => {
		const useCases = buildUseCases();
		await renderLogin(useCases);

		await fireEvent.changeText(screen.getByLabelText('Login'), 'maria');
		await fireEvent.changeText(screen.getByLabelText('Senha'), '12345678');
		await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

		expect(useCases.signIn.execute).toHaveBeenCalledWith({ identifier: 'maria', password: '12345678' });
	});

	it('mostra a mensagem da falha', async () => {
		await renderLogin(buildUseCases(failure({ kind: 'unauthorized', message: 'Login ou senha inválidos.' })));

		await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

		expect(await screen.findByText('Login ou senha inválidos.')).toBeTruthy();
	});
});
