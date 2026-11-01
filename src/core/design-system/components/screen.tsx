import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../tokens';

type ScreenProps = {
	children: ReactNode;
};

/** Contêiner padrão de tela: área segura, fundo da marca e rolagem quando o teclado aparece. */
function Screen({ children }: ScreenProps) {
	return (
		<SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
			<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
				{children}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: colors.background },
	content: { padding: spacing.lg, gap: spacing.lg },
});

export { Screen };
