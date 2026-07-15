# @velorate/fastify

Official **Fastify adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Native Fastify plugin
- Fixed Window algorithm
- Sliding Window algorithm
- Token Bucket algorithm
- Leaky Bucket algorithm
- MemoryStore support
- RedisStore support
- Custom key generator
- Skip requests
- Custom error messages
- Custom rate limit handler
- TypeScript support

---

## Installation

```bash
pnpm add @velorate/core @velorate/fastify
```

```bash
npm install @velorate/core @velorate/fastify
```

```bash
yarn add @velorate/core @velorate/fastify
```

---

## Quick Start

```ts
import Fastify from "fastify";

import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/fastify";

const app = Fastify();

await app.register(rateLimit, {
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 5,
    window: 10_000,
  }),
});

app.get("/", async () => {
  return {
    message: "Hello Velorate 🚀",
  };
});

await app.listen({
  port: 3000,
});
```

---

## Using Redis

Use `RedisStore` when deploying multiple Fastify instances or running in production.

```ts
import Fastify from "fastify";
import { createClient } from "redis";

import {
  RedisStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/fastify";

const client = createClient();

await client.connect();

const app = Fastify();

await app.register(rateLimit, {
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

## Custom Key Generator

By default, Velorate identifies clients using their IP address.

You can provide a custom key generator to rate limit based on authenticated users, API keys, or any custom identifier.

```ts
await app.register(rateLimit, {
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 20,
    window: 60_000,
  }),

  keyGenerator(request) {
    return request.headers["x-user-id"] as string;
  },
});
```

---

## Skip Requests

Skip rate limiting for specific routes.

```ts
await app.register(rateLimit, {
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 10,
    window: 60_000,
  }),

  skip(request) {
    return request.url === "/health";
  },
});
```

---

## Custom Handler

Customize the response when a request exceeds the configured limit.

```ts
await app.register(rateLimit, {
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 5,
    window: 10_000,
  }),

  handler(request, reply) {
    reply.status(429).send({
      error: "Too many requests.",
    });
  },
});
```

---

## Configuration

| Option | Description |
|---------|-------------|
| `store` | Storage backend used to persist rate limit data. |
| `algorithm` | Rate limiting algorithm instance. |
| `keyGenerator` | Generates a unique identifier for each client. |
| `skip` | Skips rate limiting for matching requests. |
| `message` | Custom error message returned by the default handler. |
| `handler` | Custom handler executed when the rate limit is exceeded. |

---

## Supported Algorithms

Velorate supports multiple rate limiting strategies.

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

Example:

```ts
import { SlidingWindow } from "@velorate/core";

await app.register(rateLimit, {
  store: new MemoryStore(),
  algorithm: new SlidingWindow({
    limit: 100,
    window: 60_000,
  }),
});
```

---

## Response Headers

The plugin automatically includes the following headers.

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum number of requests allowed. |
| `X-RateLimit-Remaining` | Remaining requests in the current window. |
| `Retry-After` | Time in seconds until another request is allowed when rate limited. |

---

## Best Practices

- Use `MemoryStore` for local development and testing.
- Use `RedisStore` in production environments.
- Skip health-check endpoints when appropriate.
- Prefer authenticated user IDs or API keys over IP addresses for client identification.
- Use a shared store such as Redis when running multiple Fastify instances.

---

## License

MIT