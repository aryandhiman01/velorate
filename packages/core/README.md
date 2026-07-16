<div align="center">

# @velorate/core

A fast, flexible, and production-ready rate limiting engine for Node.js.

Framework-independent core with multiple algorithms, pluggable storage backends, and TypeScript support.

[![npm version](https://img.shields.io/npm/v/%40velorate%2Fcore)](https://www.npmjs.com/package/@velorate/core)
[![npm downloads](https://img.shields.io/npm/dm/%40velorate%2Fcore)](https://www.npmjs.com/package/@velorate/core)
[![License](https://img.shields.io/npm/l/%40velorate%2Fcore)](https://github.com/aryandhiman01/velorate/blob/main/LICENSE.md)
[![Node.js](https://img.shields.io/node/v/%40velorate%2Fcore)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)](https://www.typescriptlang.org/)

</div>

---

## Overview

`@velorate/core` is the framework-agnostic engine that powers Velorate.

It provides multiple rate limiting algorithms and interchangeable storage backends while remaining independent of any web framework. Use it directly or with one of the official Velorate adapters.

Supported adapters:

- Express
- Fastify
- Koa
- Hono
- NestJS

---

## Features

- Framework-independent core
- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket
- MemoryStore
- RedisStore
- TypeScript support
- ESM support
- Lightweight
- Production ready

---

## Installation

```bash
pnpm add @velorate/core
```

```bash
npm install @velorate/core
```

```bash
yarn add @velorate/core
```

---

## Quick Start

```ts
import {
  MemoryStore,
  FixedWindow,
  RateLimiter,
} from "@velorate/core";

const limiter = new RateLimiter({
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 100,
    window: 60_000,
  }),
});

const result = await limiter.consume("user-123");

console.log(result);
```

---

## Using Redis

Use `RedisStore` for production deployments or distributed applications.

```ts
import Redis from "ioredis";

import {
  RedisStore,
  FixedWindow,
  RateLimiter,
} from "@velorate/core";

const client = new Redis();

const limiter = new RateLimiter({
  store: new RedisStore({
    client,
  }),
  algorithm: new FixedWindow({
    limit: 100,
    window: 60_000,
  }),
});
```

---

## Supported Algorithms

| Algorithm | Best For |
|-----------|----------|
| Fixed Window | Internal APIs |
| Sliding Window | Public APIs |
| Token Bucket | Burst traffic |
| Leaky Bucket | Constant throughput |

---

## Supported Storage

| Store | Description |
|--------|-------------|
| `MemoryStore` | In-memory storage for development and single-instance deployments |
| `RedisStore` | Distributed storage for production deployments |

---

## Response

```ts
const result = await limiter.consume("user-123");
```

Example:

```ts
{
  success: true,
  remaining: 99,
  reset: 1710000000000
}
```

---

## API

### `RateLimiter`

```ts
new RateLimiter(options)
```

#### Methods

| Method | Description |
|--------|-------------|
| `consume(key)` | Consumes a request for the given key. |
| `get(key)` | Returns the current rate limit state. |
| `reset(key)` | Resets the stored state for the given key. |

---

## Exports

```ts
import {
  RateLimiter,

  MemoryStore,
  RedisStore,

  FixedWindow,
  SlidingWindow,
  TokenBucket,
  LeakyBucket,
} from "@velorate/core";
```

---

## Related Packages

| Package | Description |
|---------|-------------|
| `@velorate/express` | Express adapter |
| `@velorate/fastify` | Fastify adapter |
| `@velorate/koa` | Koa adapter |
| `@velorate/hono` | Hono adapter |
| `@velorate/nestjs` | NestJS adapter |

---

## Documentation

See the main repository for complete documentation and examples.

https://github.com/aryandhiman01/velorate

---

## License

MIT