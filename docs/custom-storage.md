# Custom Storage

Velorate provides a pluggable storage system.

If the built-in stores do not meet your requirements, you can implement your own storage backend by implementing the `RateLimitStore` interface.

This allows Velorate to work with virtually any storage engine.

---

# When Should You Create a Custom Store?

A custom store is useful when you need to integrate with a storage system that is not officially supported.

Examples include:

- PostgreSQL
- MySQL
- MongoDB
- DynamoDB
- Memcached
- Cloudflare KV
- Upstash Redis
- Custom in-memory cache

---

# Store Interface

Every custom store must implement the `RateLimitStore` interface.

```ts
interface RateLimitStore {

    get(

        key: string

    ): Promise<number | null>;

    set(

        key: string,

        value: number,

        ttl: number

    ): Promise<void>;

    increment(

        key: string,

        ttl: number

    ): Promise<number>;

    delete(

        key: string

    ): Promise<void>;

}
```

The exact interface may evolve as Velorate introduces additional storage features. Always refer to the latest API reference for the current contract.

---

# Required Methods

## get()

Returns the current value for a key.

```ts
await store.get(

    "user-123"

);
```

---

## set()

Stores a value together with its expiration time.

```ts
await store.set(

    "user-123",

    15,

    60_000

);
```

---

## increment()

Atomically increments the stored value.

```ts
await store.increment(

    "user-123",

    60_000

);
```

---

## delete()

Removes a key from the store.

```ts
await store.delete(

    "user-123"

);
```

---

# Example Implementation

```ts
class CustomStore

    implements RateLimitStore {

    async get(

        key: string

    ) {

        // Read value

    }

    async set(

        key: string,

        value: number,

        ttl: number

    ) {

        // Store value

    }

    async increment(

        key: string,

        ttl: number

    ) {

        // Increment value

    }

    async delete(

        key: string

    ) {

        // Delete key

    }

}
```

---

# Using a Custom Store

Once implemented, the custom store can be used exactly like the built-in stores.

```ts
import {

    FixedWindow

} from "@velorate/core";

const store = new CustomStore();

const algorithm = new FixedWindow({

    limit: 100,

    window: 60_000

});
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

The same store can also be used with:

- Express
- Fastify
- Koa
- Hono
- NestJS

No adapter-specific changes are required.

---

# Design Guidelines

A custom store should:

- Return consistent results.
- Handle concurrent requests safely.
- Respect expiration times.
- Avoid unnecessary network calls.
- Be independent of any specific algorithm.

The algorithm determines **how** rate limiting works.

The store determines **where** state is stored.

Keeping these responsibilities separate makes implementations easier to maintain.

---

# Performance Considerations

When implementing a custom store:

- Prefer atomic operations whenever possible.
- Minimize network round trips.
- Use native expiration features if supported.
- Avoid blocking operations.
- Reuse existing database or cache connections.

---

# Error Handling

A custom store should throw meaningful errors when storage operations fail.

Examples include:

- Connection failures
- Authentication failures
- Timeouts
- Invalid configuration

Avoid silently ignoring storage errors, as this may lead to inconsistent rate limiting behavior.

---

# Testing

Before using a custom store in production, verify:

- Values are stored correctly.
- Counters increment correctly.
- Expiration works as expected.
- Concurrent requests behave correctly.
- The implementation works with all supported algorithms.

---

# Best Practices

- Prefer built-in stores unless a custom backend is required.
- Keep storage logic independent of business logic.
- Use native TTL support whenever available.
- Ensure atomic increment operations.
- Test under concurrent load before production deployment.

---

# Next Steps

Continue with:

- Custom Algorithm
- API Reference
- FAQ