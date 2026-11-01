import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen, spacing } from '@/core/design-system';
import { useSession } from '@/features/auth';

/**
 * Entrada do app depois do login: uma porta para cada feature.
 *
 * Hoje mostra as duas features para todo usuário. A subtarefa "Perfil, autorizações e grants" troca
 * isso pelos nós do catálogo V2 (`controle-check-list` e `controle-efetivo-diario-de-bordo`), igual ao
 * web.
 */
function HomeScreen() {
	const router = useRouter();
	const { session, signOut } = useSession();

	return (
		<Screen>
			<View style={styles.header}>
				<AppText variant="title">Olá, {session?.user.name ?? ''}</AppText>
				<AppText tone="muted">Escolha o que vai fazer agora.</AppText>
			</View>
			<Card>
				<AppText variant="subtitle">Check-list</AppText>
				<AppText tone="muted">Checklists pendentes do seu dia, da equipe e do veículo.</AppText>
				<Button label="Abrir Check-list" onPress={() => router.push('/check-list')} />
			</Card>
			<Card>
				<AppText variant="subtitle">Diário de Bordo</AppText>
				<AppText tone="muted">Registre a jornada operacional da equipe.</AppText>
				<Button label="Abrir Diário de Bordo" onPress={() => router.push('/diario-de-bordo')} />
			</Card>
			<Button label="Sair" variant="secondary" onPress={signOut} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	header: { gap: spacing.xs },
});

export { HomeScreen };
