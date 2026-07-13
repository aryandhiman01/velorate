# @velorate/express

Official **Express.js adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Express middleware
- Fixed Window algorithm
- Sliding Window algorithm
- Token Bucket algorithm
- Leaky Bucket algorithm
- MemoryStore support
- RedisStore support
- Custom key generator
- Skip requests
- Custom rate limit handler
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
import { MemoryStore, FixedWindow } from "@velorate/core";
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
  res.json({ message: "Hello Velorate 🚀" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## Using Redis

Use `RedisStore` when running multiple application instances or deploying to production.

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
```

---

## Custom Key Generator

By default, Velorate uses the client's IP address as the identifier.

You can provide your own key generator.

```ts
app.use(
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 20,
      window: 60_000,
    }),

    keyGenerator(req) {
      return req.headers["x-user-id"] as string;
    },
  })
);
```

A common production approach is to use:

- Authenticated user ID
- API key
- Organization ID
- Tenant ID

---

## Skip Requests

Skip rate limiting for specific routes.

```ts
app.use(
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 10,
      window: 60_000,
    }),

    skip(req) {
      return req.path === "/health";
    },
  })
);
```

---

## Custom Handler

Customize the response when the request limit is exceeded.

```ts
app.use(
  rateLimit({
    store: new MemoryStore(),
    algorithm: new FixedWindow({
      limit: 5,
      window: 10_000,
    }),

    handler(req, res) {
      res.status(429).json({
        error: "Too many requests.",
      });
    },
  })
);
```

---

## Configuration

| Option | Type | Description |
|---------|------|-------------|
| `store` | `Store` | Storage backend used for rate limit state. |
| `algorithm` | `Algorithm` | Rate limiting algorithm instance. |
| `keyGenerator` | `(req) => string` | Generates a unique identifier for each client. |
| `skip` | `(req) => boolean` | Skips rate limiting for matching requests. |
| `handler` | `(req, res) => void` | Custom handler executed when the limit is exceeded. |
| `message` | `string` | Custom error message returned by the default handler. |

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

algorithm: new SlidingWindow({
  limit: 100,
  window: 60_000,
});
```

---

## Response Headers

The middleware automatically sets the following headers on every request.

| Header | Description |
|--------|-------------|
| `X-RateLimit-Remaining` | Number of remaining requests in the current window. |
| `Retry-After` | Number of seconds until another request is allowed (when rate limited). |

---

## Best Practices

- Use `MemoryStore` for local development.
- Use `RedisStore` in production environments.
- Skip health check endpoints when appropriate.
- Prefer authenticated user IDs or API keys over IP addresses for client identification.
- Use a shared store such as Redis when running multiple server instances.

---

## License

MIT
