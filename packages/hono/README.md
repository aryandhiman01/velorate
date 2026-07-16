# @velorate/hono

Official **Hono adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Native Hono middleware
- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket
- MemoryStore
- RedisStore
- Custom key generator
- Skip requests
- Custom handler
- TypeScript support

---

## Installation

```bash
pnpm add @velorate/core @velorate/hono
```

```bash
npm install @velorate/core @velorate/hono
```

```bash
yarn add @velorate/core @velorate/hono
```

---

## Quick Start

```ts
import { Hono } from "hono";

import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/hono";

const app = new Hono();

app.use(
  "*",
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 5,
      window: 10_000,
    }),
  })
);

app.get("/", (c) => {
  return c.json({
    message: "Hello Velorate 🚀",
  });
});

export default app;
```

---

## Using Redis

Use `RedisStore` for production or when running multiple application instances.

```ts
import { Hono } from "hono";
import { createClient } from "redis";

import {
  RedisStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/hono";

const client = createClient();

await client.connect();

const app = new Hono();

app.use(
  "*",
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

export default app;
```

---

## Supported Algorithms

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

---

## Supported Stores

- MemoryStore
- RedisStore

---

## Configuration

| Option | Description |
|---------|-------------|
| `store` | Storage implementation |
| `algorithm` | Rate limiting algorithm |
| `keyGenerator` | Generate a custom identifier |
| `skip` | Skip rate limiting |
| `message` | Custom error message |
| `handler` | Custom blocked request handler |

---

## Response Headers

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Time until the next request is allowed |

---

## License

MIT