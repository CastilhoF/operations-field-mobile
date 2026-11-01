import Constants from 'expo-constants';

/**
 * Configuração de ambiente lida uma única vez.
 *
 * `EXPO_PUBLIC_*` é embutido no bundle pelo Metro no momento do build; por isso a leitura precisa ser
 * literal (`process.env.EXPO_PUBLIC_X`) e não dinâmica. Faltar a URL da API é erro de build, não de
 * uso: o app falha cedo e com mensagem clara em vez de chamar `undefined/core/v1/...`.
 */
type AppEnv = 'development' | 'hml' | 'production';

type AppConfig = {
	appEnv: AppEnv;
	apiBaseUrl: string;
	apiPrefix: string;
};

type RawConfig = {
	appEnv?: unknown;
	apiBaseUrl?: string | undefined;
	apiPrefix?: string | undefined;
};

const APP_ENVS: readonly AppEnv[] = ['development', 'hml', 'production'];

function parseAppConfig(raw: RawConfig): AppConfig {
	const apiBaseUrl = raw.apiBaseUrl?.trim().replace(/\/+$/, '');
	if (!apiBaseUrl) {
		throw new Error('EXPO_PUBLIC_API_BASE_URL não definido. Veja o .env.example.');
	}
	const appEnv = APP_ENVS.includes(raw.appEnv as AppEnv) ? (raw.appEnv as AppEnv) : 'development';
	const apiPrefix = raw.apiPrefix?.trim().replace(/^\/+|\/+$/g, '') || 'core';
	return { appEnv, apiBaseUrl, apiPrefix };
}

let cached: AppConfig | undefined;

function getAppConfig(): AppConfig {
	cached ??= parseAppConfig({
		appEnv: Constants.expoConfig?.extra?.appEnv,
		apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
		apiPrefix: process.env.EXPO_PUBLIC_API_PREFIX,
	});
	return cached;
}

export { getAppConfig, parseAppConfig };
export type { AppConfig, AppEnv };
