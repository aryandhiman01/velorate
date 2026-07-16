# Fastify

This guide explains how to integrate Velorate with Fastify applications.

---

# Prerequisites

Before continuing, make sure you have completed the installation.

```bash
npm install @velorate/core @velorate/fastify
```

See the **Installation** guide for more details.

---

# Basic Usage

```ts
import Fastify from "fastify";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/fastify";

const app = Fastify();

await app.register(

    rateLimit,

    {

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    }

);

await app.listen({

    port: 3000

});
```

The plugin now limits each client to **100 requests per minute**.

---

# Configuration

```ts
await app.register(

    rateLimit,

    {

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    }

);
```

Both `store` and `algorithm` are required.

---

# Options

| Option | Description |
|---------|-------------|
| `store` | Storage implementation |
| `algorithm` | Rate limiting algorithm |
| `keyGenerator` | Generate a custom identifier |
| `skip` | Skip selected requests |
| `message` | Custom error message |
| `handler` | Custom block handler |

---

# Using MemoryStore

```ts
import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

await app.register(

    rateLimit,

    {

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 50,

            window: 60_000

        })

    }

);
```

Recommended for:

- Development
- Testing
- Single-instance applications

---

# Using RedisStore

```ts
import Redis from "ioredis";

import {

    RedisStore,

    FixedWindow

} from "@velorate/core";

const redis = new Redis();

await app.register(

    rateLimit,

    {

        store: new RedisStore(

            redis

        ),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    }

);
```

Recommended for production deployments.

---

# Custom Key Generator

By default, Velorate uses the client IP address.

```ts
await app.register(

    rateLimit,

    {

        store,

        algorithm,

        keyGenerator(request) {

            return request.headers["x-api-key"] as string;

        }

    }

);
```

Common examples:

- User ID
- API Key
- Session ID
- Organization ID

---

# Skip Requests

```ts
await app.register(

    rateLimit,

    {

        store,

        algorithm,

        skip(request) {

            return request.url === "/health";

        }

    }

);
```

---

# Custom Error Message

```ts
await app.register(

    rateLimit,

    {

        store,

        algorithm,

        message: "Rate limit exceeded."

    }

);
```

Default message:

```text
Too Many Requests
```

---

# Custom Handler

```ts
await app.register(

    rateLimit,

    {

        store,

        algorithm,

        handler(request, reply) {

            reply.status(429).send({

                success: false,

                error: "Rate limit exceeded."

            });

        }

    }

);
```

---

# Response Headers

Velorate automatically includes:

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Seconds until retry |

---

# Complete Example

```ts
import Fastify from "fastify";

import {

    MemoryStore,

    SlidingWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/fastify";

const app = Fastify();

await app.register(

    rateLimit,

    {

        store: new MemoryStore(),

        algorithm: new SlidingWindow({

            limit: 100,

            window: 60_000

        }),

        message: "Too many requests."

    }

);

app.get(

    "/",

    async () => {

        return {

            success: true

        };

    }

);

await app.listen({

    port: 3000

});
```

---

# Best Practices

- Use **RedisStore** in production.
- Prefer **SlidingWindow** for public APIs.
- Generate keys using authenticated user IDs or API keys.
- Exclude health check endpoints with `skip`.
- Keep rate limit configuration consistent across related routes.

---

# Troubleshooting

## Requests are never blocked

Verify:

- The plugin is registered.
- The algorithm is configured correctly.
- The storage implementation is functioning.

---

## Every request returns 429

Verify your custom key generator.

If all requests produce the same key, every client shares the same limit.

---

## Redis counters are not shared

Ensure all application instances connect to the same Redis server.

---

# Next Steps

Continue with:

- Koa
- Hono
- NestJS
- Custom Storage
- API Reference