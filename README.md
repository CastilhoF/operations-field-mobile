# Operations Field Mobile

[![CI](https://github.com/CastilhoF/operations-field-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/CastilhoF/operations-field-mobile/actions/workflows/ci.yml)

A React Native and Expo portfolio app that demonstrates a clean, testable mobile client architecture for secure field-operation workflows.

The application is a sanitized demonstration: it includes no production endpoint, customer data, credential, proprietary workflow, or third-party brand asset. The API URL is deliberately a placeholder until you configure a service you control.

## What it demonstrates

- Expo Router navigation and environment-specific app configuration
- Feature-first modules with explicit presentation, domain, and data boundaries
- Typed HTTP client with centralized error mapping
- Secure session persistence through `expo-secure-store`
- Reusable design-system primitives and accessible form controls
- Unit and integration-style Jest tests, TypeScript checks, ESLint, Android bundle export, and CI

## Product walkthrough

The current portfolio scope focuses on architecture rather than hosting a backend:

1. A user reaches the login screen and enters credentials for an API they control.
2. The authentication feature validates input through a domain use case.
3. The data layer exchanges credentials for a session and persists it in platform-protected storage.
4. The authenticated shell exposes example Field Checklist and Activity Journal destinations.

The two workflow screens are intentionally placeholders. They show how independent field modules fit into the navigation and design system without claiming to implement a real company's operations.

## Architecture

```
src/
├── app/          Expo Router routes and navigation shells
├── bootstrap/    Composition root and application providers
├── core/         Configuration, networking, storage, UI primitives, utilities
├── features/     Feature modules
│   └── auth/
│       ├── presentation/  React screens, view models, session provider
│       ├── domain/        Entities, use cases, repository contracts
│       └── data/          DTOs, mappers, repositories, data sources
└── shared/       Reusable non-feature UI
```

Dependency direction is deliberate:

```
presentation ──► domain ◄── data
                    ▲
                    │
                 core services
```

Screens depend on use cases, not HTTP or storage. Domain code has no Expo or React dependency. Data implements domain contracts and maps transport data into domain entities. This makes UI behavior straightforward to test with fakes and makes infrastructure choices replaceable.

For additional detail, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Requirements

- Node.js 24
- npm 11
- Expo Go on a device or an Android emulator (for interactive use)

## Run locally

```bash
git clone https://github.com/CastilhoF/operations-field-mobile.git
cd operations-field-mobile

npm ci
cp .env.example .env
npm start
```

Then open the project in Expo Go or press `a` to target a running Android emulator.

### Configure an API

The checked-in configuration uses `https://api.example.com`, which is intentionally non-functional. Replace it with an API endpoint you own:

```dotenv
APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
EXPO_PUBLIC_API_PREFIX=api
```

Only `EXPO_PUBLIC_*` values are bundled into the client. They must never contain passwords, API keys, tokens, or any other secret.

## Environment behavior

| `APP_ENV` | App name | Android package |
| --- | --- | --- |
| `development` | Operations Field (Dev) | `com.castilhof.operationsfield.dev` |
| `hml` | Operations Field (Preview) | `com.castilhof.operationsfield.preview` |
| `production` | Operations Field | `com.castilhof.operationsfield` |

The package IDs let preview and production builds coexist on the same Android device.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Open the app on Android through Expo. |
| `npm run lint` | Run ESLint with zero warnings allowed. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm test -- --runInBand` | Run the Jest suite serially. |
| `npm run test:coverage` | Run tests with coverage thresholds. |
| `npm run doctor` | Check Expo dependency compatibility. |

## Validate an Android bundle

This command produces an Android export without requiring a live API:

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.example.com \
  npx expo export --platform android
```

## Authentication and security

The authentication module demonstrates the client side of a token-based session:

- Credentials are validated before an API request is made.
- The HTTP client attaches an access token only to authenticated calls.
- Tokens are persisted exclusively through `expo-secure-store`.
- Tokens are never intentionally written to AsyncStorage, SQLite, logs, or user-visible errors.
- A malformed persisted session is treated as signed out rather than crashing the app.

Read [docs/SECURITY.md](docs/SECURITY.md) for the security model and deployment cautions.

## Testing strategy

The Jest suite covers:

- configuration parsing and URL normalization;
- HTTP request construction and error mapping;
- session DTO mapping and secure local persistence;
- sign-in and restore-session use cases;
- repository behavior; and
- critical screen and design-system component interactions.

GitHub Actions runs linting, type checking, and the test suite for every push and pull request.

## Scope and limitations

This repository is a technical portfolio sample, not a hosted field-management product. It does not provide an API, account provisioning, push notifications, production analytics, real workflow data, or store-release credentials. The example workflow screens intentionally remain generic placeholders.

## License

Released under the [MIT License](LICENSE).
