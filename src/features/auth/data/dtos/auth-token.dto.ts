/**
 * Resposta de `POST /core/v1/auth/login/password` (`LoginWithPasswordOutputDto` do backend), no
 * recorte que o app lê. Campos a mais do backend são ignorados de propósito.
 */
type AuthenticatedUserDto = {
	id: string;
	tenantId: string;
	name: string;
	email: string;
	role: string;
	firstAccess?: boolean;
};

type AuthTokenDto = {
	tokenType: 'Bearer';
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresInSeconds: number;
	refreshTokenExpiresInSeconds: number;
	user: AuthenticatedUserDto;
};

type LoginRequestDto = {
	identifier: string;
	password: string;
};

export type { AuthenticatedUserDto, AuthTokenDto, LoginRequestDto };
