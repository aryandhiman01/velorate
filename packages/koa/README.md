# @velorate/koa

Official **Koa adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Native Koa middleware
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
pnpm add @velorate/core @velorate/koa
```

```bash
npm install @velorate/core @velorate/koa
```

```bash
yarn add @velorate/core @velorate/koa
```

---

## Quick Start

```ts
import Koa from "koa";

import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/koa";

const app = new Koa();

app.use(
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 5,
      window: 10_000,
    }),
  })
);

app.use(async (ctx) => {
  ctx.body = {
    message: "Hello Velorate 🚀",
  };
});

app.listen(3000);
```

---

## Using Redis

Use `RedisStore` for production or when running multiple application instances.

```ts
import Koa from "koa";
import { createClient } from "redis";

import {
  RedisStore,
  FixedWindow,
} from "@velorate/core";

import { rateLimit } from "@velorate/koa";

const client = createClient();

await client.connect();

const app = new Koa();

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

app.listen(3000);
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