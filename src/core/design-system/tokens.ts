/**
 * Tokens visuais do app.
 *
 * Visual tokens are intentionally centralized so screens remain consistent and easy to retheme.
 */
const palette = {
	primary50: '#F0F5FA',
	primary100: '#D1E0EE',
	primary500: '#2E5D91',
	primary600: '#204268',
	primary900: '#001F3F',
	accent100: '#FFEFC7',
	accent500: '#F4A300',
	accent600: '#BC7D00',
	white: '#FFFFFF',
	neutral50: '#F8FAFC',
	neutral100: '#F1F5F9',
	neutral200: '#E2E8F0',
	neutral300: '#CBD5E1',
	neutral500: '#64748B',
	neutral700: '#334155',
	neutral900: '#0F172A',
	success: '#10B981',
	warning: '#F59E0B',
	error: '#EF4444',
	info: '#3B82F6',
} as const;

const colors = {
	background: palette.neutral50,
	surface: palette.white,
	border: palette.neutral200,
	textMain: palette.neutral900,
	textMuted: palette.neutral500,
	textOnPrimary: palette.white,
	brandBlue: palette.primary900,
	brandGold: palette.accent500,
	primary: palette.primary900,
	primaryPressed: palette.primary600,
	danger: palette.error,
	success: palette.success,
	warning: palette.warning,
	info: palette.info,
} as const;

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

const radius = { sm: 6, md: 8, lg: 12, pill: 999 } as const;

const typography = {
	title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
	subtitle: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
	body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
	caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
	label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
} as const;

/** Área mínima de toque recomendada para uso em campo, com luva ou em movimento. */
const minTouchTarget = 48;

export { colors, minTouchTarget, palette, radius, spacing, typography };
