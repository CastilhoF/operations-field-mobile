import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../tokens';
import { AppText } from './app-text';

type TextFieldProps = TextInputProps & {
	label: string;
	error?: string | undefined;
};

function TextField({ label, error, style, ...props }: TextFieldProps) {
	return (
		<View style={styles.container}>
			<AppText variant="label">{label}</AppText>
			<TextInput
				accessibilityLabel={label}
				placeholderTextColor={colors.textMuted}
				style={[styles.input, error ? styles.inputError : null, style]}
				{...props}
			/>
			{error ? (
				<AppText variant="caption" tone="danger">
					{error}
				</AppText>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { gap: spacing.xs },
	input: {
		...typography.body,
		minHeight: minTouchTarget,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.surface,
		color: colors.textMain,
	},
	inputError: { borderColor: colors.danger },
});

export { TextField };
export type { TextFieldProps };
