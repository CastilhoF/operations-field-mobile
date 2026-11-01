import { parseAppConfig } from './env';

describe('parseAppConfig', () => {
	it('normaliza a URL e o prefixo', () => {
		expect(parseAppConfig({ appEnv: 'hml', apiBaseUrl: 'https://api.exemplo.com/ ', apiPrefix: '/core/' })).toEqual({
			appEnv: 'hml',
			apiBaseUrl: 'https://api.exemplo.com',
			apiPrefix: 'core',
		});
	});

	it('usa development e o prefixo core quando não informados', () => {
		expect(parseAppConfig({ apiBaseUrl: 'http://10.0.2.2:4000' })).toEqual({
			appEnv: 'development',
			apiBaseUrl: 'http://10.0.2.2:4000',
			apiPrefix: 'core',
		});
	});

	it('falha cedo sem a URL da API', () => {
		expect(() => parseAppConfig({ apiBaseUrl: '  ' })).toThrow('EXPO_PUBLIC_API_BASE_URL');
	});
});
