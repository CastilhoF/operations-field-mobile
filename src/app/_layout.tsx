import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/bootstrap/app-providers';
import { colors } from '@/core/design-system';
import { useSession } from '@/features/auth';

/**
 * Raiz da navegação. As rotas em `src/app/` só compõem telas das features; nenhuma regra mora aqui.
 *
 * O guard usa `Stack.Protected`: sem sessão só o login existe; com sessão só o grupo `(app)`. Ao
 * sair, o histórico do grupo protegido é descartado pelo próprio router.
 */
function RootNavigator() {
	const { status } = useSession();

	// Enquanto lê a sessão do Keystore não desenha nada, para não piscar a tela de login.
	if (status === 'restoring') return null;

	const signedIn = status === 'signed-in';
	return (
		<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
			<Stack.Protected guard={!signedIn}>
				<Stack.Screen name="login" />
			</Stack.Protected>
			<Stack.Protected guard={signedIn}>
				<Stack.Screen name="(app)" />
			</Stack.Protected>
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<AppProviders>
			<StatusBar style="dark" />
			<RootNavigator />
		</AppProviders>
	);
}
