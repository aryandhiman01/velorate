# Stores

Velorate separates rate limiting algorithms from data storage.

A **store** is responsible for persisting rate limit state such as request counts, timestamps, or tokens. Since the storage layer is independent of the algorithm, the same algorithm can be used with different storage implementations.

---

# Available Stores

| Store | Recommended For |
|--------|-----------------|
| MemoryStore | Development, testing, single-instance applications |
| RedisStore | Production, distributed systems, multiple application instances |

---

# MemoryStore

`MemoryStore` keeps all rate limiting data in the application's memory.

```ts
import {

    MemoryStore

} from "@velorate/core";

const store = new MemoryStore();
```

---

## Characteristics

- In-memory storage
- Zero external dependencies
- Fast read and write operations
- Automatically cleared when the application restarts

---

## Advantages

- Very simple setup
- Excellent performance
- No infrastructure required
- Ideal for development

---

## Limitations

Since data exists only inside the current process:

- Counters are lost after a restart
- Multiple application instances do not share data
- Not suitable for horizontally scaled deployments

---

## Recommended Use Cases

- Local development
- Testing
- Small internal tools
- Single server deployments

---

# RedisStore

`RedisStore` stores rate limiting data inside Redis.

```ts
import Redis from "ioredis";

import {

    RedisStore

} from "@velorate/core";

const redis = new Redis();

const store = new RedisStore(

    redis

);
```

---

## Characteristics

- Persistent external storage
- Shared across multiple application instances
- Supports distributed deployments
- TTL-based expiration

---

## Advantages

- Horizontal scalability
- Shared counters
- Reliable production storage
- Suitable for cloud deployments

---

## Limitations

- Requires a running Redis server
- Additional infrastructure
- Network latency compared to in-memory storage

---

## Recommended Use Cases

- Production APIs
- SaaS applications
- Kubernetes deployments
- Load-balanced services
- Multiple Node.js instances

---

# Choosing a Store

| Scenario | Recommended Store |
|----------|-------------------|
| Local development | MemoryStore |
| Unit testing | MemoryStore |
| Internal tools | MemoryStore |
| Production | RedisStore |
| Multiple servers | RedisStore |
| Cloud deployment | RedisStore |

---

# Store Independence

Algorithms are completely independent of storage.

Example:

```ts
import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

const store = new MemoryStore();

const algorithm = new FixedWindow({

    limit: 100,

    window: 60_000

});
```

Switching to Redis only requires replacing the store.

```ts
import Redis from "ioredis";

import {

    RedisStore,

    FixedWindow

} from "@velorate/core";

const redis = new Redis();

const store = new RedisStore(

    redis

);

const algorithm = new FixedWindow({

    limit: 100,

    window: 60_000

});
```

The algorithm configuration remains unchanged.

---

# How Redis Expiration Works

RedisStore automatically assigns an expiration time to each key.

```text
Request

↓

Store Counter

↓

Set TTL

↓

TTL Expires

↓

Counter Removed
```

No manual cleanup is required.

---

# Custom Stores

Velorate allows custom storage implementations by implementing the `RateLimitStore` interface.

Example use cases include:

- PostgreSQL
- MongoDB
- DynamoDB
- Memcached
- Cloudflare KV
- Upstash Redis

See **custom-storage.md** for implementation details.

---

# Performance Considerations

| Store | Read Speed | Write Speed | Shared Across Instances |
|--------|------------|-------------|-------------------------|
| MemoryStore | Excellent | Excellent | No |
| RedisStore | Excellent | Excellent | Yes |

For most production environments, RedisStore is the recommended choice.

---

# Best Practices

- Use **MemoryStore** for development and testing.
- Use **RedisStore** for production deployments.
- Keep the storage layer independent of business logic.
- Avoid using MemoryStore in load-balanced environments.

---

# Next Steps

Continue with:

- Express
- Fastify
- Koa
- Hono
- NestJS
- Custom Storage
- API Reference