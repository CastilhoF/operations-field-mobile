import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { colors, minTouchTarget, radius, spacing } from '../tokens';
import { AppText } from './app-text';

type ButtonProps = Omit<PressableProps, 'children'> & {
	label: string;
	variant?: 'primary' | 'secondary';
	loading?: boolean;
};

function Button({ label, variant = 'primary', loading = false, disabled, style, ...props }: ButtonProps) {
	const isDisabled = disabled === true || loading;
	const isPrimary = variant === 'primary';

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled: isDisabled, busy: loading }}
			disabled={isDisabled}
			style={(state) => [
				styles.base,
				isPrimary ? styles.primary : styles.secondary,
				state.pressed && isPrimary && styles.primaryPressed,
				isDisabled && styles.disabled,
				typeof style === 'function' ? style(state) : style,
			]}
			{...props}
		>
			{loading ? (
				<ActivityIndicator color={isPrimary ? colors.textOnPrimary : colors.primary} />
			) : (
				<AppText variant="label" tone={isPrimary ? 'onPrimary' : 'main'}>
					{label}
				</AppText>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		minHeight: minTouchTarget,
		borderRadius: radius.md,
		paddingHorizontal: spacing.lg,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primary: { backgroundColor: colors.primary },
	primaryPressed: { backgroundColor: colors.primaryPressed },
	secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
	disabled: { opacity: 0.5 },
});

export { Button };
export type { ButtonProps };
