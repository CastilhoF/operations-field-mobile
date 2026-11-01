# Security notes

Authentication tokens are persisted only through `expo-secure-store`, which maps to platform-protected storage. They are never written to AsyncStorage, SQLite, logs, or error messages.

The API base URL is an `EXPO_PUBLIC_` build-time value. Public Expo variables must never contain secrets. Supply only an endpoint you control and keep credentials, API keys, and private service configuration on the server side.

The included login flow is a client integration example, not a hosted authentication service.
