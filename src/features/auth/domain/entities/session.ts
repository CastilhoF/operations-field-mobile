/** Usuário autenticado, no recorte que o app usa. */
type SessionUser = {
	id: string;
	tenantId: string;
	name: string;
	email: string;
	role: string;
	/** Primeiro acesso: o backend exige troca de senha antes de liberar o uso. */
	firstAccess: boolean;
};

type Session = {
	accessToken: string;
	refreshToken: string;
	/** Instante (epoch ms) em que o access token expira. */
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	user: SessionUser;
};

type Credentials = {
	identifier: string;
	password: string;
};

export type { Credentials, Session, SessionUser };
