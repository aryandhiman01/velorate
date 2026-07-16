# Hono

This guide explains how to integrate Velorate with Hono applications.

---

# Prerequisites

Before continuing, make sure you have completed the installation.

```bash
npm install @velorate/core @velorate/hono
```

See the **Installation** guide for more details.

---

# Basic Usage

```ts
import { Hono } from "hono";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/hono";

const app = new Hono();

app.use(

    "*",

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    })

);

app.get(

    "/",

    (c) => {

        return c.json({

            message: "Hello Velorate"

        });

    }

);
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

app.use(

    "*",

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 50,

            window: 60_000

        })

    })

);
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

    "*",

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

By default, Velorate identifies clients using the forwarded IP address.

```ts
rateLimit({

    store,

    algorithm,

    keyGenerator(c) {

        return (

            c.req.header(

                "x-api-key"

            ) ?? "anonymous"

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

    skip(c) {

        return (

            c.req.path === "/health"

        );

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

    handler(c) {

        return c.json(

            {

                success: false,

                error: "Rate limit exceeded."

            },

            429

        );

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
import { Hono } from "hono";

import {

    MemoryStore,

    SlidingWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/hono";

const app = new Hono();

app.use(

    "*",

    rateLimit({

        store: new MemoryStore(),

        algorithm: new SlidingWindow({

            limit: 100,

            window: 60_000

        }),

        message: "Too many requests."

    })

);

app.get(

    "/",

    (c) => {

        return c.json({

            success: true

        });

    }

);
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

If every request generates the same key, all clients will share the same rate limit.

---

## Redis counters are not shared

Ensure every application instance connects to the same Redis server.

---

# Next Steps

Continue with:

- NestJS
- Custom Storage
- Custom Algorithm
- API Reference