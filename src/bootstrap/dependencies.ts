import { getAppConfig } from '@/core/config/env';
import { HttpClient } from '@/core/network/http-client';
import { expoSecureStorage } from '@/core/storage/secure-storage';
import { createAuthModule, createSessionStore, type AuthUseCases } from '@/features/auth';

/**
 * Composição raiz: o único lugar que instancia implementações concretas e liga as features à
 * infraestrutura. Equivale ao `app/di` da arquitetura de referência. Telas e use cases recebem o que
 * precisam pronto; testes trocam qualquer peça montando o próprio `AppDependencies`.
 */
type AppDependencies = {
	http: HttpClient;
	auth: AuthUseCases;
};

function createDependencies(): AppDependencies {
	const config = getAppConfig();
	const sessionStore = createSessionStore(expoSecureStorage);
	const http = new HttpClient({
		baseUrl: config.apiBaseUrl,
		apiPrefix: config.apiPrefix,
		getAccessToken: sessionStore.getAccessToken,
	});

	return {
		http,
		auth: createAuthModule(http, sessionStore),
	};
}

export { createDependencies };
export type { AppDependencies };
