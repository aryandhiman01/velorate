# Frequently Asked Questions

This document answers the most common questions about Velorate.

---

# Which algorithm should I use?

The best algorithm depends on your application.

| Scenario | Recommended Algorithm |
|----------|-----------------------|
| Internal APIs | Fixed Window |
| Public APIs | Sliding Window |
| Burst traffic | Token Bucket |
| Constant throughput | Leaky Bucket |

If you're unsure, **Sliding Window** is generally a good default for public APIs.

---

# Which store should I use?

| Environment | Recommended Store |
|-------------|-------------------|
| Development | MemoryStore |
| Testing | MemoryStore |
| Production | RedisStore |

MemoryStore is intended for single-instance deployments.

RedisStore is recommended for distributed production environments.

---

# Does Velorate support Redis?

Yes.

Velorate includes a built-in `RedisStore` implementation that works with **ioredis**.

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

# Does Velorate support multiple Node.js instances?

Yes.

Use **RedisStore** so that all application instances share the same rate limit data.

MemoryStore is local to a single process and should not be used for horizontally scaled deployments.

---

# Why am I always receiving HTTP 429?

Common causes include:

- The configured request limit has been exceeded.
- All users are sharing the same rate limit key.
- Your custom `keyGenerator` always returns the same value.
- The rate limit window has not expired yet.

---

# Why are requests never blocked?

Check the following:

- The middleware or guard is registered correctly.
- The selected algorithm is configured properly.
- The configured limit is low enough to test.
- The `skip` function is not always returning `true`.

---

# Can I identify users instead of IP addresses?

Yes.

Use a custom key generator.

Example:

```ts
keyGenerator(request) {

    return request.user.id;

}
```

Common identifiers include:

- User ID
- API Key
- Session ID
- Organization ID

---

# Can I skip specific routes?

Yes.

Use the `skip` option.

Example:

```ts
skip(request) {

    return request.path === "/health";

}
```

Typical use cases include:

- Health checks
- Metrics endpoints
- Internal services

---

# Can I customize the error response?

Yes.

Use the `handler` option.

```ts
handler(request, response) {

    response.status(429).json({

        error: "Rate limit exceeded."

    });

}
```

---

# Can I customize the error message?

Yes.

```ts
message: "Too many requests."
```

If no custom message is provided, Velorate returns:

```text
Too Many Requests
```

---

# Does Velorate automatically set response headers?

Yes.

Velorate automatically includes:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `Retry-After`

These headers help clients understand their current rate limit status.

---

# Can I create my own storage implementation?

Yes.

Implement the `RateLimitStore` interface.

See:

- Custom Storage
- API Reference

---

# Can I create my own algorithm?

Yes.

Implement the `RateLimitAlgorithm` interface.

See:

- Custom Algorithm
- API Reference

---

# Does Velorate work with TypeScript?

Yes.

Velorate is written in TypeScript and ships with built-in type definitions.

No additional typings are required.

---

# Does Velorate support JavaScript?

Yes.

Although the library is written in TypeScript, it can also be used in JavaScript projects.

---

# Which package should I install?

Install the core package together with the adapter for your framework.

Examples:

```text
Express

@velorate/core
@velorate/express
```

```text
Fastify

@velorate/core
@velorate/fastify
```

```text
NestJS

@velorate/core
@velorate/nestjs
```

---

# Is Velorate production-ready?

Yes.

Velorate provides:

- Multiple algorithms
- Redis support
- Framework-specific adapters
- TypeScript support
- Comprehensive automated tests

For production deployments, use **RedisStore** instead of **MemoryStore**.

---

# Where can I report bugs?

Please open an issue in the GitHub repository.

When reporting an issue, include:

- Node.js version
- Velorate version
- Framework
- Minimal reproduction
- Error message

---

# Where can I request a feature?

Feature requests are welcome through GitHub Issues or GitHub Discussions.

Please include:

- The problem you are trying to solve
- Your proposed solution
- Any alternative approaches considered

---

# Need More Help?

If your question is not covered here, refer to:

- Getting Started
- Installation
- Algorithms
- Stores
- Framework Guides
- API Reference

If the issue persists, open a GitHub Discussion or GitHub Issue.