import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen, TextField, spacing } from '@/core/design-system';
import { useSignInViewModel } from '../viewmodels/use-sign-in.view-model';

function LoginScreen() {
	const { state, setIdentifier, setPassword, submit } = useSignInViewModel();

	return (
		<Screen>
			<View style={styles.header}>
				<AppText variant="title">Operations Field</AppText>
				<AppText tone="muted">Sign in to explore a secure field-workflow client.</AppText>
			</View>
			<Card>
				<TextField
					label="Login"
					value={state.identifier}
					onChangeText={setIdentifier}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="username"
					textContentType="username"
					returnKeyType="next"
					editable={!state.submitting}
				/>
				<TextField
					label="Senha"
					value={state.password}
					onChangeText={setPassword}
					secureTextEntry
					autoComplete="password"
					textContentType="password"
					returnKeyType="done"
					onSubmitEditing={submit}
					editable={!state.submitting}
				/>
				{state.error ? (
					<AppText tone="danger" accessibilityRole="alert">
						{state.error}
					</AppText>
				) : null}
				<Button label="Entrar" onPress={submit} loading={state.submitting} />
			</Card>
		</Screen>
	);
}

const styles = StyleSheet.create({
	header: { gap: spacing.xs, paddingTop: spacing.xxl },
});

export { LoginScreen };
