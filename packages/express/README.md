# @velorate/express

Official **Express.js adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Express middleware
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
pnpm add @velorate/core @velorate/express express
```

```bash
npm install @velorate/core @velorate/express express
```

```bash
yarn add @velorate/core @velorate/express express
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
      limit: 5,
      window: 10_000,
    }),
  })
);

app.get("/", (_req, res) => {
  res.json({
    message: "Hello Velorate 🚀",
  });
});

app.listen(3000);
```

---

## Using Redis

Use `RedisStore` for production or when running multiple application instances.

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