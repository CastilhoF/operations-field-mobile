/**
 * Resultado de uma operação que pode falhar de forma esperada.
 *
 * Use cases e repositórios devolvem `Result` em vez de lançar: a falha de negócio (senha errada,
 * sem rede) é um caminho normal da tela, não uma exceção. Exceção fica para o que é bug.
 */
type FailureKind = 'unauthorized' | 'forbidden' | 'validation' | 'network' | 'server' | 'unexpected';

type Failure = {
	kind: FailureKind;
	message: string;
	status?: number;
};

type Result<T> = { ok: true; value: T } | { ok: false; failure: Failure };

const success = <T>(value: T): Result<T> => ({ ok: true, value });

const failure = <T = never>(value: Failure): Result<T> => ({ ok: false, failure: value });

export { failure, success };
export type { Failure, FailureKind, Result };
