# Installation

This guide explains how to install Velorate for your preferred Node.js framework.

---

# Requirements

Before installing Velorate, ensure your environment meets the following requirements.

| Requirement | Version |
|-------------|---------|
| Node.js | 18 or later |
| TypeScript | Recommended |
| Package Manager | npm, pnpm, or yarn |

---

# Choosing a Package

Velorate consists of a framework-independent core package and framework-specific adapters.

Install the core package together with the adapter for your framework.

| Framework | Package |
|-----------|---------|
| Express | `@velorate/core` + `@velorate/express` |
| Fastify | `@velorate/core` + `@velorate/fastify` |
| Koa | `@velorate/core` + `@velorate/koa` |
| Hono | `@velorate/core` + `@velorate/hono` |
| NestJS | `@velorate/core` + `@velorate/nestjs` |

---

# Express

## npm

```bash
npm install @velorate/core @velorate/express
```

## pnpm

```bash
pnpm add @velorate/core @velorate/express
```

## yarn

```bash
yarn add @velorate/core @velorate/express
```

---

# Fastify

## npm

```bash
npm install @velorate/core @velorate/fastify
```

## pnpm

```bash
pnpm add @velorate/core @velorate/fastify
```

## yarn

```bash
yarn add @velorate/core @velorate/fastify
```

---

# Koa

## npm

```bash
npm install @velorate/core @velorate/koa
```

## pnpm

```bash
pnpm add @velorate/core @velorate/koa
```

## yarn

```bash
yarn add @velorate/core @velorate/koa
```

---

# Hono

## npm

```bash
npm install @velorate/core @velorate/hono
```

## pnpm

```bash
pnpm add @velorate/core @velorate/hono
```

## yarn

```bash
yarn add @velorate/core @velorate/hono
```

---

# NestJS

## npm

```bash
npm install @velorate/core @velorate/nestjs
```

## pnpm

```bash
pnpm add @velorate/core @velorate/nestjs
```

## yarn

```bash
yarn add @velorate/core @velorate/nestjs
```

---

# Verify Installation

Create a simple application using the adapter for your framework.

Example (Express):

```ts
import express from "express";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/express";

const app = express();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 5,

            window: 60_000

        })

    })

);

app.get("/", (_, res) => {

    res.send("Velorate is working.");

});

app.listen(3000);
```

Start the application.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

After exceeding the configured limit, the server should respond with:

```http
HTTP/1.1 429 Too Many Requests
```

---

# Package Managers

Velorate works with all major package managers.

| Package Manager | Supported |
|----------------|-----------|
| npm | ✅ |
| pnpm | ✅ |
| yarn | ✅ |

---

# ESM Support

Velorate is published as an ECMAScript Module (ESM).

Example:

```ts
import {

    FixedWindow,

    MemoryStore

} from "@velorate/core";
```

When using TypeScript, enable ESM support in your project configuration if it is not already enabled.

---

# Monorepo Development

If you are contributing to Velorate itself:

Install all workspace dependencies.

```bash
pnpm install
```

Build every package.

```bash
pnpm build
```

Run the complete test suite.

```bash
pnpm test
```

---

# Troubleshooting

## Cannot find module

Make sure both the core package and the framework adapter are installed.

Example:

```bash
pnpm add @velorate/core @velorate/express
```

---

## TypeScript import errors

Verify that your project is configured for ESM and that your TypeScript version is up to date.

---

## Redis connection issues

Ensure that your Redis server is running and accessible before using `RedisStore`.

---

# Next Steps

After installation, continue with:

- Algorithms
- Stores
- Framework Guides
- API Reference