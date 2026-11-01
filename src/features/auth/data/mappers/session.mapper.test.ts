import type { AuthTokenDto } from '../dtos/auth-token.dto';
import { toSession } from './session.mapper';

const dto: AuthTokenDto = {
	tokenType: 'Bearer',
	accessToken: 'access',
	refreshToken: 'refresh',
	accessTokenExpiresInSeconds: 900,
	refreshTokenExpiresInSeconds: 604800,
	user: { id: 'u1', tenantId: 't1', name: 'Maria', email: 'maria@exemplo.com', role: 'OPERATOR' },
};

describe('toSession', () => {
	it('converte a validade em segundos para instante absoluto', () => {
		const session = toSession(dto, 1_000);

		expect(session.accessTokenExpiresAt).toBe(1_000 + 900_000);
		expect(session.refreshTokenExpiresAt).toBe(1_000 + 604_800_000);
	});

	it('assume que não é primeiro acesso quando o backend não informa', () => {
		expect(toSession(dto, 0).user.firstAccess).toBe(false);
		expect(toSession({ ...dto, user: { ...dto.user, firstAccess: true } }, 0).user.firstAccess).toBe(true);
	});
});
