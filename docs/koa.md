# Koa

This guide explains how to integrate Velorate with Koa applications.

---

# Prerequisites

Before continuing, make sure you have completed the installation.

```bash
npm install @velorate/core @velorate/koa
```

See the **Installation** guide for more details.

---

# Basic Usage

```ts
import Koa from "koa";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/koa";

const app = new Koa();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    })

);

app.use(

    async (ctx) => {

        ctx.body = {

            message: "Hello Velorate"

        };

    }

);

app.listen(3000);
```

The middleware now limits each client to **100 requests per minute**.

---

# Configuration

```ts
rateLimit({

    store: new MemoryStore(),

    algorithm: new FixedWindow({

        limit: 100,

        window: 60_000

    })

});
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

rateLimit({

    store: new MemoryStore(),

    algorithm: new FixedWindow({

        limit: 50,

        window: 60_000

    })

});
```

Recommended for:

- Development
- Testing
- Single-instance deployments

---

# Using RedisStore

```ts
import Redis from "ioredis";

import {

    RedisStore,

    FixedWindow

} from "@velorate/core";

const redis = new Redis();

app.use(

    rateLimit({

        store: new RedisStore(

            redis

        ),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    })

);
```

Recommended for production deployments.

---

# Custom Key Generator

By default, Velorate identifies clients using their IP address.

You can generate keys from any request property.

```ts
rateLimit({

    store,

    algorithm,

    keyGenerator(ctx) {

        return String(

            ctx.headers["x-api-key"]

        );

    }

});
```

Common examples:

- User ID
- API Key
- Session ID
- Organization ID

---

# Skip Requests

```ts
rateLimit({

    store,

    algorithm,

    skip(ctx) {

        return ctx.path === "/health";

    }

});
```

Typical use cases:

- Health checks
- Metrics endpoints
- Internal services

---

# Custom Error Message

```ts
rateLimit({

    store,

    algorithm,

    message: "Rate limit exceeded."

});
```

Default message:

```text
Too Many Requests
```

---

# Custom Handler

```ts
rateLimit({

    store,

    algorithm,

    handler(ctx) {

        ctx.status = 429;

        ctx.body = {

            success: false,

            error: "Rate limit exceeded."

        };

    }

});
```

---

# Response Headers

Velorate automatically includes:

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Time until another request is allowed |

---

# Complete Example

```ts
import Koa from "koa";

import {

    MemoryStore,

    SlidingWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/koa";

const app = new Koa();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new SlidingWindow({

            limit: 100,

            window: 60_000

        }),

        message: "Too many requests."

    })

);

app.use(

    async (ctx) => {

        ctx.body = {

            success: true

        };

    }

);

app.listen(3000);
```

---

# Best Practices

- Use **RedisStore** in production.
- Prefer **SlidingWindow** for public APIs.
- Generate keys using authenticated user IDs or API keys.
- Exclude health check endpoints using `skip`.
- Keep rate limit configuration consistent across related routes.

---

# Troubleshooting

## Requests are never blocked

Verify:

- The middleware is registered.
- The selected algorithm is configured correctly.
- The storage implementation is working.

---

## Every request returns 429

Verify your key generator.

If every request produces the same key, all clients will share the same rate limit.

---

## Redis counters are not shared

Ensure every application instance connects to the same Redis server.

---

# Next Steps

Continue with:

- Hono
- NestJS
- Custom Storage
- API Reference