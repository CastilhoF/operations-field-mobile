# Architecture

The app uses feature-first modules with explicit dependency direction:

```
presentation -> domain <- data
                 ^
                 |
              core services
```

Presentation owns React components and view models. Domain contains entities, repository contracts, and use cases without React, Expo, or HTTP dependencies. Data implements repository contracts and translates remote DTOs into domain entities. Core provides cross-cutting details such as the HTTP client, configuration, secure storage, and design-system components.

The bootstrap layer composes concrete services once and passes use cases to the feature modules. This keeps screens independent of transport and storage choices, and lets the test suite provide small fakes.
