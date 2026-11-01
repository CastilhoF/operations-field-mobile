import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Configuração do app por ambiente.
 *
 * `APP_ENV` escolhe o ambiente no momento do build (perfis do EAS ou `APP_ENV=hml npx expo start`).
 * Development and production builds use distinct package IDs so they can coexist on a device.
 *
 * A URL da API não fica aqui: ela entra como `EXPO_PUBLIC_API_BASE_URL` e é lida em `src/core/config`.
 */
type AppEnv = 'development' | 'hml' | 'production';

const APP_ENVS: readonly AppEnv[] = ['development', 'hml', 'production'];

function resolveAppEnv(value: string | undefined): AppEnv {
	return APP_ENVS.includes(value as AppEnv) ? (value as AppEnv) : 'development';
}

const VARIANTS: Record<AppEnv, { name: string; androidPackage: string }> = {
	development: { name: 'Operations Field (Dev)', androidPackage: 'com.castilhof.operationsfield.dev' },
	hml: { name: 'Operations Field (Preview)', androidPackage: 'com.castilhof.operationsfield.preview' },
	production: { name: 'Operations Field', androidPackage: 'com.castilhof.operationsfield' },
};

export default ({ config }: ConfigContext): ExpoConfig => {
	const appEnv = resolveAppEnv(process.env.APP_ENV);
	const variant = VARIANTS[appEnv];

	return {
		...config,
		name: variant.name,
		slug: 'operations-field-mobile',
		scheme: 'operationsfield',
		version: '0.1.0',
		orientation: 'portrait',
		icon: './assets/operations-icon.png',
		userInterfaceStyle: 'light',
		android: {
			package: variant.androidPackage,
			adaptiveIcon: {
				backgroundColor: '#001F3F',
				foregroundImage: './assets/operations-foreground.png',
				backgroundImage: './assets/operations-background.png',
				monochromeImage: './assets/operations-monochrome.png',
			},
			predictiveBackGestureEnabled: false,
		},
		plugins: ['expo-router', 'expo-secure-store'],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			appEnv,
		},
	};
};
