# Express

This guide explains how to integrate Velorate with Express applications.

---

# Prerequisites

Before continuing, make sure you have completed the installation.

```bash
npm install @velorate/core @velorate/express
```

See the **Installation** guide for more details.

---

# Basic Usage

```ts
import express from "express";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/express";

const app = express();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 100,

            window: 60_000

        })

    })

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

rateLimit({

    store: new RedisStore(

        redis

    ),

    algorithm: new FixedWindow({

        limit: 100,

        window: 60_000

    })

});
```

Recommended for production deployments.

---

# Custom Key Generator

By default, Velorate uses the client IP address.

You can generate keys using any request property.

```ts
rateLimit({

    store,

    algorithm,

    keyGenerator(request) {

        return request.user.id;

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

Skip rate limiting for specific requests.

```ts
rateLimit({

    store,

    algorithm,

    skip(request) {

        return request.path === "/health";

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

Replace the default 429 response.

```ts
rateLimit({

    store,

    algorithm,

    handler(request, response) {

        response.status(429).json({

            success: false,

            error: "Rate limit exceeded."

        });

    }

});
```

---

# Response Headers

Velorate automatically sets the following headers.

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Time until another request is allowed |

Example:

```http
HTTP/1.1 429 Too Many Requests

X-RateLimit-Limit: 100

X-RateLimit-Remaining: 0

Retry-After: 42
```

---

# Complete Example

```ts
import express from "express";

import {

    MemoryStore,

    SlidingWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/express";

const app = express();

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

app.get("/", (_, res) => {

    res.json({

        success: true

    });

});

app.listen(3000);
```

---

# Best Practices

- Use **RedisStore** in production.
- Prefer **SlidingWindow** for public APIs.
- Use a custom key generator for authenticated users.
- Exclude health check endpoints using `skip`.
- Keep rate limit values consistent across related endpoints.

---

# Troubleshooting

## Requests are never blocked

Verify that:

- The middleware is registered.
- The selected algorithm is configured correctly.
- The storage implementation is working.

---

## Every request returns 429

Check your key generator.

If every request generates the same key, all clients will share the same rate limit.

---

## Redis counters are not shared

Ensure every application instance connects to the same Redis server.

---

# Next Steps

Continue with:

- Fastify
- Koa
- Hono
- NestJS
- Custom Storage
- API Reference