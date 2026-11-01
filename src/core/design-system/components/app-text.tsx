import { Text, type TextProps } from 'react-native';
import { colors, typography } from '../tokens';

type AppTextVariant = keyof typeof typography;

type AppTextProps = TextProps & {
	variant?: AppTextVariant;
	tone?: 'main' | 'muted' | 'danger' | 'onPrimary';
};

const TONES = {
	main: colors.textMain,
	muted: colors.textMuted,
	danger: colors.danger,
	onPrimary: colors.textOnPrimary,
} as const;

function AppText({ variant = 'body', tone = 'main', style, ...props }: AppTextProps) {
	return <Text {...props} style={[typography[variant], { color: TONES[tone] }, style]} />;
}

export { AppText };
export type { AppTextProps, AppTextVariant };
