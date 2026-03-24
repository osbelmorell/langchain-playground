# Fastify + Mercurius GraphQL Service

This folder contains a developer-friendly GraphQL service scaffold using:

- Fastify 5
- Mercurius 16
- GraphQL 16
- TypeScript 5 in strict mode
- ESLint flat config
- Vitest for API tests

## Why this setup

- Fast startup and low overhead with Fastify.
- Mercurius is registered as a plugin, which fits Fastify's preferred architecture.
- TypeScript uses strict compiler settings, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- Development logs are pretty-printed locally while production logs remain structured.
- `buildApp()` is separated from `server.ts`, which keeps the app testable with `fastify.inject()`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run codegen
npm run codegen:watch
npm run typecheck
npm run lint
npm run test
```

## GraphQL code generation

Resolver typings are generated from the schema using GraphQL Code Generator.

- Config: `codegen.yml`
- Output: `src/graphql/resolvers/generated/resolvers-types.ts`

Generate once:

```bash
npm run codegen
```

Watch mode:

```bash
npm run codegen:watch
```

## Environment

Copy `.env.example` into `.env` if you want local overrides.

Available variables:

- `NODE_ENV`: `development`, `test`, or `production`
- `HOST`: bind host, default `127.0.0.1`
- `PORT`: server port, default `4000`
- `GRAPHQL_PATH`: GraphQL endpoint path, default `/graphql`
- `GRAPHQL_IDE`: enables GraphiQL when `true`
- `APOLLO_UI_ENABLED`: enables the Apollo Sandbox page when `true`
- `APOLLO_UI_PATH`: path for the Apollo Sandbox page, default `/apollo`
- `LOG_LEVEL`: Fastify log level

## Endpoints

- `GET /health`
- `POST /graphql`
- `GET /graphiql` when `GRAPHQL_IDE=true`
- `GET /apollo` when `APOLLO_UI_ENABLED=true`

## GraphQL modules

Schema and resolvers are composed automatically from the plugin folders:

- `src/graphql/schema/**/*.graphql`
- `src/graphql/resolvers/**/*.ts`

Each schema file can define part of the SDL, and each resolver file can export a partial resolver object as its default export. Files are merged automatically at startup, so developers can add one schema file or one resolver file at a time without editing a central registry.

## Apollo UI

This project now exposes an Apollo Sandbox page that points at the local GraphQL endpoint.

- Default route: `/apollo`
- Default endpoint target: `http://127.0.0.1:4000/graphql`
- Apollo Sandbox is hosted by Apollo, so the embedded page requires browser access to Apollo's Studio domain unless it has already been cached locally.

Example query:

```graphql
query {
  hello(name: "Copilot")
  status {
    service
    uptimeSeconds
    timestamp
  }
}
```