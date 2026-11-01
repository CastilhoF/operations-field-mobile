# Operations Field Mobile

A React Native and Expo portfolio app that demonstrates a clean, testable mobile client architecture for secure field-operation workflows.

This is a sanitized portfolio example. It has no production endpoints, client records, credentials, or proprietary workflows. Configure your own API before signing in.

## Highlights

- Expo Router navigation and environment-specific application configuration
- Feature-first, layered architecture: presentation, domain, and data
- Typed HTTP client with centralized error handling
- Session persistence using the platform secure store
- Reusable design-system primitives and accessibility-aware controls
- Jest test suite, TypeScript type checks, ESLint, and GitHub Actions CI

## Run locally

Requires Node 24 and npm 11.

```bash
npm ci
cp .env.example .env
npm start
```

Use Expo Go or an Android emulator. `EXPO_PUBLIC_API_BASE_URL` must point to an API you own; `https://api.example.com` is intentionally non-functional.

## Checks

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
```

To validate an Android bundle with a safe placeholder configuration:

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.example.com npx expo export --platform android
```

## Structure

- `src/app`: Expo Router screens and navigation shells
- `src/features`: authentication and workflow features
- `src/core`: networking, secure storage, configuration, and UI primitives
- `src/bootstrap`: composition root and application providers

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for layer boundaries and [docs/SECURITY.md](docs/SECURITY.md) for the client-side security model.

## License

MIT
