<div align="center">

# Velorate

**A fast, flexible, and production-ready rate limiting library for Node.js.**

Framework-independent core with support for multiple rate limiting algorithms, pluggable storage engines, and native adapters for popular Node.js frameworks.

[![npm version](https://img.shields.io/npm/v/%40velorate%2Fcore)](https://www.npmjs.com/package/@velorate/core)
[![npm downloads](https://img.shields.io/npm/dm/%40velorate%2Fcore)](https://www.npmjs.com/package/@velorate/core)
[![License](https://img.shields.io/npm/l/%40velorate%2Fcore)](https://www.npmjs.com/package/@velorate/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-107%20Passing-success)](https://github.com/aryandhiman01/velorate/actions)
[![Node.js](https://img.shields.io/node/v/%40velorate%2Fcore)](https://nodejs.org/)

</div>

---

## Overview

Velorate is a framework-agnostic rate limiting library for Node.js designed to provide a consistent developer experience across different frameworks. It offers interchangeable algorithms, pluggable storage backends, and lightweight framework adapters while sharing a single core implementation.

---

## Features

* Framework-independent core
* Fixed Window algorithm
* Sliding Window algorithm
* Token Bucket algorithm
* Leaky Bucket algorithm
* MemoryStore
* RedisStore
* Native framework adapters
* Custom key generators
* Skip requests
* Custom handlers
* Custom error messages
* Standard rate limit headers
* TypeScript support
* Lightweight architecture
* Production ready

---

## Why Velorate?

- Framework-independent architecture
- Multiple interchangeable algorithms
- Pluggable storage engines
- Native adapters
- First-class TypeScript support
- Lightweight and production-ready

---

## Packages

| Package | Description |
|---------|-------------|
| [`@velorate/core`](./packages/core) | Core rate limiting engine |
| [`@velorate/express`](./packages/express) | Express adapter |
| [`@velorate/fastify`](./packages/fastify) | Fastify adapter |
| [`@velorate/koa`](./packages/koa) | Koa adapter |
| [`@velorate/hono`](./packages/hono) | Hono adapter |
| [`@velorate/nestjs`](./packages/nestjs) | NestJS adapter |

---

## Installation

### Core

```bash
pnpm add @velorate/core
```

```bash
npm install @velorate/core
```

```bash
yarn add @velorate/core
```

### Framework Adapters

| Framework | Package             |
| --------- | ------------------- |
| Express   | `@velorate/express` |
| Fastify   | `@velorate/fastify` |
| Koa       | `@velorate/koa`     |
| Hono      | `@velorate/hono`    |
| NestJS    | `@velorate/nestjs`  |

Install the adapter for your framework together with `@velorate/core`.

Example:

```bash
pnpm add @velorate/core @velorate/express
```

---

## Quick Start

```ts
import express from "express";

import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/express";

const app = express();

app.use(
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 100,
      window: 60_000,
    }),
  })
);

app.get("/", (_, res) => {
  res.json({
    message: "Hello Velorate 🚀",
  });
});

app.listen(3000);
```

---


## Using Redis

Use `RedisStore` for production deployments or when running multiple application instances.

```ts
import express from "express";
import { createClient } from "redis";

import {
  RedisStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/express";

const client = createClient();

await client.connect();

const app = express();

app.use(
  rateLimit({
    store: new RedisStore({
      client,
    }),
    algorithm: new FixedWindow({
      limit: 100,
      window: 60_000,
    }),
  })
);

app.get("/", (_, res) => {
  res.json({
    message: "Hello Velorate 🚀",
  });
});

app.listen(3000);
```

---

## Supported Frameworks

| Framework | Package             | Status |
| --------- | ------------------- | :----: |
| Express   | `@velorate/express` |    ✅   |
| Fastify   | `@velorate/fastify` |    ✅   |
| Koa       | `@velorate/koa`     |    ✅   |
| Hono      | `@velorate/hono`    |    ✅   |
| NestJS    | `@velorate/nestjs`  |    ✅   |

---

## Supported Algorithms

Velorate provides multiple rate limiting strategies that can be swapped without changing application code.

| Algorithm      | Best For                                   |
| -------------- | ------------------------------------------ |
| Fixed Window   | Internal APIs and authentication endpoints |
| Sliding Window | Public APIs and SaaS platforms             |
| Token Bucket   | Burst traffic                              |
| Leaky Bucket   | Constant request processing                |

---

## Supported Storage

| Store         | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `MemoryStore` | In-memory storage for development and single-instance deployments |
| `RedisStore`  | Distributed storage for production deployments                    |

The storage layer is fully pluggable, allowing custom implementations when required.

---

---

## Basic Configuration

```ts
import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

const store = new MemoryStore();

const algorithm = new FixedWindow({
  limit: 100,
  window: 60_000,
});
```

---

## Response Headers

Velorate automatically includes standard rate limiting headers.

| Header                  | Description                           |
| ----------------------- | ------------------------------------- |
| `X-RateLimit-Limit`     | Maximum requests allowed              |
| `X-RateLimit-Remaining` | Remaining requests                    |
| `Retry-After`           | Time until another request is allowed |

---

## Feature Matrix

| Feature              | Core | Express | Fastify | Koa | Hono | NestJS |
| -------------------- | :--: | :-----: | :-----: | :-: | :--: | :----: |
| Fixed Window         |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Sliding Window       |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Token Bucket         |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Leaky Bucket         |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| MemoryStore          |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| RedisStore           |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Custom Key Generator |   —  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Skip Requests        |   —  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Custom Handler       |   —  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Custom Message       |   —  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| Response Headers     |   —  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |
| TypeScript           |   ✅  |    ✅    |    ✅    |  ✅  |   ✅  |    ✅   |

---

## Examples

Working examples are available for every supported framework.

| Framework | Directory          |
| --------- | ------------------ |
| Express   | `examples/express` |
| Fastify   | `examples/fastify` |
| Koa       | `examples/koa`     |
| Hono      | `examples/hono`    |
| NestJS    | `examples/nestjs`  |

Each example demonstrates:

* Framework integration
* MemoryStore configuration
* Rate limiting behavior
* Standard response headers

---

## Monorepo Structure

```text
velorate/
├── packages/
│   ├── core/
│   ├── express/
│   ├── fastify/
│   ├── hono/
│   ├── koa/
│   └── nestjs/
│
├── examples/
│   ├── express/
│   ├── fastify/
│   ├── hono/
│   ├── koa/
│   └── nestjs/
│
└── docs/
```

---

## Roadmap

### v1.0

* Core rate limiting engine
* Fixed Window
* Sliding Window
* Token Bucket
* Leaky Bucket
* MemoryStore
* RedisStore
* Express adapter
* Fastify adapter
* Koa adapter
* Hono adapter
* NestJS adapter

### Planned

* Documentation website
* Benchmark suite
* Additional storage engines
* Additional framework adapters
* Bun adapter
* Elysia adapter
* Nitro adapter
* Oak adapter
* WebSocket rate limiting
* Redis Cluster support

---

---

## Contributing

Contributions are welcome.

If you'd like to contribute to Velorate:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update tests when required.
5. Submit a pull request.

Please read the project's contribution guidelines before opening a pull request.

---

## License

MIT

---

<div align="center">

Built with TypeScript.

If Velorate helps your project, consider giving the repository a ⭐.

</div>
