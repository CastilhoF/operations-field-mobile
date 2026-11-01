import type { Session } from '../../domain/entities/session';
import type { AuthTokenDto } from '../dtos/auth-token.dto';

/** Converte a resposta do login em `Session`, trocando a validade relativa por instante absoluto. */
function toSession(dto: AuthTokenDto, now: number = Date.now()): Session {
	return {
		accessToken: dto.accessToken,
		refreshToken: dto.refreshToken,
		accessTokenExpiresAt: now + dto.accessTokenExpiresInSeconds * 1000,
		refreshTokenExpiresAt: now + dto.refreshTokenExpiresInSeconds * 1000,
		user: {
			id: dto.user.id,
			tenantId: dto.user.tenantId,
			name: dto.user.name,
			email: dto.user.email,
			role: dto.user.role,
			firstAccess: dto.user.firstAccess === true,
		},
	};
}

export { toSession };
