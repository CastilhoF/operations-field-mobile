import type { HttpClient } from '@/core/network/http-client';
import type { Result } from '@/core/utils/result';
import type { AuthTokenDto, LoginRequestDto } from '../dtos/auth-token.dto';

/** Endpoints de autenticação do backend (`AuthController`, `/core/v1/auth`). */
class AuthRemoteDataSource {
	constructor(private readonly http: HttpClient) {}

	login(input: LoginRequestDto): Promise<Result<AuthTokenDto>> {
		return this.http.post<AuthTokenDto>('auth/login/password', input, { authenticated: false });
	}

	logout(): Promise<Result<unknown>> {
		return this.http.post('auth/logout');
	}
}

export { AuthRemoteDataSource };
