import { fireEvent, render, screen } from '@testing-library/react-native';
import { useSession } from '@/features/auth';
import { HomeScreen } from './home-screen';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('react-native-safe-area-context', () => {
	const { View } = jest.requireActual('react-native');
	return { SafeAreaView: View };
});
jest.mock('@/features/auth', () => ({ useSession: jest.fn() }));

const signOut = jest.fn();

describe('HomeScreen', () => {
	beforeEach(() => {
		jest.mocked(useSession).mockReturnValue({
			status: 'signed-in',
			session: { user: { name: 'Maria' } },
			signIn: jest.fn(),
			signOut,
		} as unknown as ReturnType<typeof useSession>);
	});

	it('cumprimenta o usuário e abre cada feature', async () => {
		await render(<HomeScreen />);

		expect(screen.getByText('Olá, Maria')).toBeTruthy();
		await fireEvent.press(screen.getByRole('button', { name: 'Abrir Check-list' }));
		await fireEvent.press(screen.getByRole('button', { name: 'Abrir Diário de Bordo' }));

		expect(mockPush).toHaveBeenNthCalledWith(1, '/check-list');
		expect(mockPush).toHaveBeenNthCalledWith(2, '/diario-de-bordo');
	});

	it('sai da conta', async () => {
		await render(<HomeScreen />);

		await fireEvent.press(screen.getByRole('button', { name: 'Sair' }));

		expect(signOut).toHaveBeenCalled();
	});
});
