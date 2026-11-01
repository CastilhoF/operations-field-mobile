// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/*
 * As regras de camada da arquitetura (ia-context/ARCHITECTURE.md) viram erro de lint, e não só
 * convenção: o domínio não conhece React, React Native, Expo nem as camadas de fora; a apresentação
 * não fala com datasource nem com o cliente HTTP; e uma feature só entra em outra pelo `index.ts`.
 */
const FEATURE_INTERNALS = ['@/features/*/data/*', '@/features/*/domain/*', '@/features/*/presentation/*'];

module.exports = defineConfig([
	expoConfig,
	{
		ignores: ['dist/*', 'coverage/*', '.expo/*'],
	},
	{
		files: ['src/features/*/domain/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{ group: ['react', 'react-native', 'expo', 'expo-*', '@tanstack/*'], message: 'O domínio é TypeScript puro.' },
						{ group: ['**/data/*', '**/presentation/*', '@/core/network/*', '@/core/storage/*'], message: 'O domínio não depende de camadas externas.' },
					],
				},
			],
		},
	},
	{
		files: ['src/features/*/presentation/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{ group: ['**/data/datasources/*', '@/core/network/*', '@/core/storage/*'], message: 'A apresentação chama use cases; não fala com datasource, HTTP ou storage.' },
					],
				},
			],
		},
	},
	{
		files: ['src/app/**/*.{ts,tsx}', 'src/core/**/*.{ts,tsx}', 'src/shared/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [{ group: FEATURE_INTERNALS, message: 'Importe a feature pelo index.ts dela (@/features/<nome>).' }],
				},
			],
		},
	},
]);
