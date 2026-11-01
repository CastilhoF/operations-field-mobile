import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '@/features/auth';
import { createDependencies, type AppDependencies } from './dependencies';
import { createQueryClient } from './query-client';

type AppProvidersProps = {
	children: ReactNode;
	/** Injeção para testes; em produção as dependências reais são criadas uma vez. */
	dependencies?: AppDependencies;
};

function AppProviders({ children, dependencies }: AppProvidersProps) {
	const [deps] = useState(() => dependencies ?? createDependencies());
	const [queryClient] = useState(createQueryClient);

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<SessionProvider useCases={deps.auth}>{children}</SessionProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}

export { AppProviders };
