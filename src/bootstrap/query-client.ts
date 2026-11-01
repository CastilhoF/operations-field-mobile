import { QueryClient } from '@tanstack/react-query';

/**
 * Cache de dados do servidor (mesma biblioteca do web, para os hooks de consulta serem portáveis).
 *
 * Os repositórios devolvem `Result` em vez de lançar, então a falha esperada (4xx, sem rede) não
 * passa pelo retry do React Query; uma nova tentativa só cobre o erro inesperado.
 */
function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: { staleTime: 30_000, retry: 1 },
		},
	});
}

export { createQueryClient };
