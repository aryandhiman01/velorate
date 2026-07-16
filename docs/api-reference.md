# API Reference

This document describes the public API exposed by Velorate.

---

# Packages

| Package | Description |
|---------|-------------|
| `@velorate/core` | Core rate limiting engine |
| `@velorate/express` | Express adapter |
| `@velorate/fastify` | Fastify adapter |
| `@velorate/koa` | Koa adapter |
| `@velorate/hono` | Hono adapter |
| `@velorate/nestjs` | NestJS adapter |

---

# Core

## RateLimiter

The central class responsible for executing the configured rate limiting algorithm.

### Constructor

```ts
new RateLimiter(

    store,

    algorithm

)
```

### Parameters

| Parameter | Type |
|-----------|------|
| `store` | `RateLimitStore` |
| `algorithm` | `RateLimitAlgorithm` |

---

### Methods

#### check()

```ts
check(

    key: string

): Promise<RateLimitDecision>
```

Checks whether a request identified by the given key should be allowed.

---

# Algorithms

All algorithms implement the `RateLimitAlgorithm` interface.

---

## FixedWindow

```ts
new FixedWindow({

    limit,

    window

})
```

### Configuration

| Property | Type |
|----------|------|
| `limit` | number |
| `window` | number |

---

## SlidingWindow

```ts
new SlidingWindow({

    limit,

    window

})
```

### Configuration

| Property | Type |
|----------|------|
| `limit` | number |
| `window` | number |

---

## TokenBucket

```ts
new TokenBucket({

    capacity,

    refillRate

})
```

### Configuration

| Property | Type |
|----------|------|
| `capacity` | number |
| `refillRate` | number |

---

## LeakyBucket

```ts
new LeakyBucket({

    capacity,

    leakRate

})
```

### Configuration

| Property | Type |
|----------|------|
| `capacity` | number |
| `leakRate` | number |

---

# Stores

---

## MemoryStore

```ts
new MemoryStore()
```

In-memory storage implementation.

Recommended for development and testing.

---

## RedisStore

```ts
new RedisStore(

    redis

)
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `redis` | ioredis client |

Recommended for distributed production deployments.

---

# Interfaces

---

## RateLimitDecision

Returned after every rate limit check.

```ts
interface RateLimitDecision {

    allowed: boolean;

    remaining: number;

    retryAfter: number;

}
```

| Property | Description |
|----------|-------------|
| `allowed` | Whether the request is accepted |
| `remaining` | Remaining requests |
| `retryAfter` | Seconds until another request is allowed |

---

## RateLimitStore

Storage interface implemented by all stores.

```ts
interface RateLimitStore {

    get(...)

    set(...)

    increment(...)

    delete(...)

}
```

See **Custom Storage** for implementation details.

---

## RateLimitAlgorithm

Implemented by every algorithm.

```ts
interface RateLimitAlgorithm {

    check(...)

}
```

See **Custom Algorithm** for implementation details.

---

# Express

## rateLimit()

```ts
rateLimit({

    store,

    algorithm,

    ...

})
```

### Options

| Option | Description |
|---------|-------------|
| `store` | Storage implementation |
| `algorithm` | Rate limiting algorithm |
| `keyGenerator` | Generate a custom key |
| `skip` | Skip requests |
| `message` | Custom message |
| `handler` | Custom handler |

Returns an Express middleware.

---

# Fastify

## rateLimit()

```ts
await app.register(

    rateLimit,

    options

)
```

Accepts the same configuration options as the Express adapter.

Returns a Fastify plugin.

---

# Koa

## rateLimit()

```ts
app.use(

    rateLimit({

        ...

    })

)
```

Returns a Koa middleware.

---

# Hono

## rateLimit()

```ts
app.use(

    "*",

    rateLimit({

        ...

    })

)
```

Returns a Hono middleware.

---

# NestJS

---

## RateLimitModule

Registers Velorate in a NestJS application.

```ts
RateLimitModule.forRoot({

    ...

})
```

---

## RateLimitGuard

```ts
@UseGuards(

    RateLimitGuard

)
```

Protects controllers and routes using the configured rate limiting policy.

---

# Common Options

The following options are available across all adapters.

| Option | Type | Required |
|---------|------|:--------:|
| `store` | `RateLimitStore` | ✅ |
| `algorithm` | `RateLimitAlgorithm` | ✅ |
| `keyGenerator` | Function | ❌ |
| `skip` | Function | ❌ |
| `message` | string | ❌ |
| `handler` | Function | ❌ |

---

# Response Headers

Velorate automatically includes the following headers.

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Configured request limit |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Time until another request is allowed |

---

# TypeScript

All public APIs include TypeScript type definitions.

No additional packages are required.

---

# Versioning

Velorate follows Semantic Versioning (SemVer).

- MAJOR for breaking changes
- MINOR for new features
- PATCH for bug fixes

---

# Related Documentation

- Getting Started
- Installation
- Algorithms
- Stores
- Express
- Fastify
- Koa
- Hono
- NestJS
- Custom Storage
- Custom Algorithm
- FAQ