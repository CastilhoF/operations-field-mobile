/**
 * API pública da feature de autenticação. Outras features e a composição raiz só importam daqui.
 */
export { createAuthModule, createSessionStore } from './auth.module';
export type { AuthUseCases, SessionStore } from './auth.module';
export type { Session, SessionUser } from './domain/entities/session';
export { LoginScreen } from './presentation/screens/login-screen';
export { SessionProvider, useSession } from './presentation/session/session-provider';
export type { SessionStatus } from './presentation/session/session-provider';
