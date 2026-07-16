# Custom Algorithm

Velorate allows you to create custom rate limiting algorithms.

If the built-in algorithms do not satisfy your requirements, you can implement your own algorithm while continuing to use the same storage layer and framework adapters.

---

# When Should You Create a Custom Algorithm?

A custom algorithm is useful when your application requires behavior that is not provided by the built-in implementations.

Examples include:

- API plans with dynamic limits
- User-specific rate limits
- Organization-wide quotas
- Credit-based systems
- Adaptive rate limiting
- AI-powered throttling
- Geo-based limits

---

# Algorithm Interface

Every custom algorithm must implement the `RateLimitAlgorithm` interface.

```ts
interface RateLimitAlgorithm {

    check(

        key: string,

        store: RateLimitStore

    ): Promise<RateLimitDecision>;

}
```

The algorithm decides whether a request should be allowed.

The store is responsible for persisting state.

---

# RateLimitDecision

Every algorithm returns a decision object.

```ts
interface RateLimitDecision {

    allowed: boolean;

    remaining: number;

    retryAfter: number;

}
```

| Property | Description |
|----------|-------------|
| `allowed` | Whether the request should be accepted |
| `remaining` | Remaining requests |
| `retryAfter` | Time until another request is allowed |

---

# Basic Example

```ts
import type {

    RateLimitAlgorithm,

    RateLimitDecision,

    RateLimitStore

} from "@velorate/core";

export class CustomAlgorithm

    implements RateLimitAlgorithm {

    async check(

        key: string,

        store: RateLimitStore

    ): Promise<RateLimitDecision> {

        return {

            allowed: true,

            remaining: 100,

            retryAfter: 0

        };

    }

}
```

---

# Using a Custom Algorithm

A custom algorithm is used exactly like the built-in algorithms.

```ts
import {

    MemoryStore

} from "@velorate/core";

const store = new MemoryStore();

const algorithm = new CustomAlgorithm();
```

Express example:

```ts
app.use(

    rateLimit({

        store,

        algorithm

    })

);
```

The same algorithm works with:

- Express
- Fastify
- Koa
- Hono
- NestJS

No adapter-specific changes are required.

---

# Responsibilities

An algorithm should:

- Decide whether a request is allowed.
- Calculate remaining requests.
- Calculate retry time.
- Read and update the configured store.

An algorithm should **not**:

- Send HTTP responses.
- Modify request objects.
- Access framework-specific APIs.
- Store framework state.

This keeps the core independent of any web framework.

---

# Example Use Cases

## Dynamic Limits

Different users receive different limits.

```text
Free User

↓

100 requests/hour

Premium User

↓

1000 requests/hour
```

---

## Credit-Based Limits

Every request consumes credits instead of a fixed request count.

```text
Credits

100

↓

Request

↓

99
```

---

## Time-Based Policies

Limits vary depending on the time of day.

```text
Business Hours

↓

Higher limit

Night

↓

Lower limit
```

---

# Performance Considerations

A custom algorithm should:

- Minimize storage operations.
- Avoid unnecessary calculations.
- Use efficient data structures.
- Keep execution predictable.

The algorithm runs on every incoming request, so keeping it lightweight is important.

---

# Error Handling

Algorithms should throw meaningful errors when unexpected situations occur.

Examples include:

- Invalid configuration
- Missing required values
- Unsupported storage implementation

Avoid silently accepting invalid states.

---

# Testing

Before using a custom algorithm in production, verify:

- Allowed requests
- Blocked requests
- Remaining count
- Retry time
- Concurrent requests
- Edge cases
- Store compatibility

---

# Best Practices

- Keep algorithms independent of HTTP frameworks.
- Reuse existing storage implementations.
- Avoid framework-specific logic.
- Document configuration options.
- Add automated tests.

---

# Built-in Algorithms

Velorate includes:

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

Whenever possible, prefer the built-in implementations before creating a custom algorithm.

---

# Next Steps

Continue with:

- API Reference
- FAQ