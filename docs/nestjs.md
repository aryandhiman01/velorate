# NestJS

This guide explains how to integrate Velorate with NestJS applications using the provided module and guard.

---

# Prerequisites

Before continuing, make sure you have completed the installation.

```bash
npm install @velorate/core @velorate/nestjs
```

See the **Installation** guide for more details.

---

# Basic Usage

Register the `RateLimitModule` in your application.

```ts
import { Module } from "@nestjs/common";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    RateLimitModule

} from "@velorate/nestjs";

@Module({

    imports: [

        RateLimitModule.forRoot({

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 100,

                window: 60_000

            })

        })

    ]

})

export class AppModule {}
```

---

# Protecting Routes

Use the provided guard.

```ts
import {

    Controller,

    Get,

    UseGuards

} from "@nestjs/common";

import {

    RateLimitGuard

} from "@velorate/nestjs";

@Controller()

@UseGuards(

    RateLimitGuard

)

export class AppController {

    @Get()

    getHello() {

        return {

            message: "Hello Velorate"

        };

    }

}
```

Every request handled by this controller is now rate limited.

---

# Module Configuration

```ts
RateLimitModule.forRoot({

    store: new MemoryStore(),

    algorithm: new FixedWindow({

        limit: 100,

        window: 60_000

    })

});
```

---

# Configuration Options

| Option | Description |
|---------|-------------|
| `store` | Storage implementation |
| `algorithm` | Rate limiting algorithm |
| `keyGenerator` | Generate a custom identifier |
| `skip` | Skip selected requests |
| `message` | Custom error message |
| `handler` | Custom response handler |

---

# Using MemoryStore

```ts
RateLimitModule.forRoot({

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

RateLimitModule.forRoot({

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

By default, Velorate identifies clients using their IP address.

You can generate your own key.

```ts
RateLimitModule.forRoot({

    store,

    algorithm,

    keyGenerator(request) {

        return String(

            request.headers["x-api-key"]

        );

    }

});
```

Common examples include:

- User ID
- API Key
- Session ID
- Organization ID

---

# Skip Requests

Skip rate limiting for selected requests.

```ts
RateLimitModule.forRoot({

    store,

    algorithm,

    skip(request) {

        return request.url === "/health";

    }

});
```

Typical use cases:

- Health endpoints
- Monitoring
- Internal services

---

# Custom Error Message

```ts
RateLimitModule.forRoot({

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

Replace the default response.

```ts
RateLimitModule.forRoot({

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

Velorate automatically includes standard rate limiting headers.

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Seconds until another request is allowed |

---

# Complete Example

```ts
@Module({

    imports: [

        RateLimitModule.forRoot({

            store: new MemoryStore(),

            algorithm: new SlidingWindow({

                limit: 100,

                window: 60_000

            }),

            message: "Too many requests."

        })

    ]

})

export class AppModule {}
```

```ts
@Controller()

@UseGuards(

    RateLimitGuard

)

export class AppController {

    @Get()

    getHello() {

        return {

            success: true

        };

    }

}
```

---

# Best Practices

- Use **RedisStore** in production.
- Prefer **SlidingWindow** for public APIs.
- Use authenticated user IDs or API keys as rate limit keys.
- Exclude health check endpoints using `skip`.
- Keep rate limit policies consistent across related endpoints.

---

# Troubleshooting

## Requests are never blocked

Verify:

- `RateLimitModule` is imported.
- `RateLimitGuard` is applied.
- The selected algorithm is configured correctly.
- The storage implementation is working.

---

## Every request returns 429

Verify your custom key generator.

If every request generates the same key, all clients share the same rate limit.

---

## Redis counters are not shared

Ensure every application instance connects to the same Redis server.

---

# Next Steps

Continue with:

- Custom Storage
- Custom Algorithm
- API Reference
- FAQ