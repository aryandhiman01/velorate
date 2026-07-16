<div align="center">

# Velorate

**A fast, flexible, and production-ready rate limiting library for Node.js.**

Support for multiple algorithms, pluggable storage engines, and framework-specific adapters with a unified API.

[![npm version](https://img.shields.io/npm/v/@velorate/core.svg)](https://www.npmjs.com/package/@velorate/core)
[![npm downloads](https://img.shields.io/npm/dm/@velorate/core.svg)](https://www.npmjs.com/package/@velorate/core)
[![License](https://img.shields.io/npm/l/@velorate/core.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-107%20Passing-success.svg)]()
[![Node.js](https://img.shields.io/node/v/@velorate/core.svg)](https://nodejs.org/)

</div>

---

## Why Velorate?

Most rate limiting libraries solve a single use case. Velorate is designed to provide a consistent developer experience across different Node.js frameworks while keeping the core implementation framework-independent.

Whether you're building a REST API, microservice, SaaS platform, or public API, Velorate provides configurable algorithms, interchangeable storage backends, and native integrations without changing your application logic.

---

# Features

- Multiple rate limiting algorithms
- Memory and Redis storage support
- Native adapters for popular Node.js frameworks
- Framework-independent core
- Custom key generators
- Skip conditions
- Custom block handlers
- Custom error messages
- Standard rate limit headers
- TypeScript first
- Lightweight and extensible
- Production-ready architecture

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

# Supported Algorithms

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

Each algorithm is implemented independently and can be swapped without changing your application code.

---

# Supported Storage

- Memory Store
- Redis Store

The storage layer is completely pluggable, allowing custom implementations when required.

---

# Installation

## Core

```bash
npm install @velorate/core
```

or

```bash
pnpm add @velorate/core
```

---

## Express

```bash
npm install @velorate/core @velorate/express
```

---

## Fastify

```bash
npm install @velorate/core @velorate/fastify
```

---

## Koa

```bash
npm install @velorate/core @velorate/koa
```

---

## Hono

```bash
npm install @velorate/core @velorate/hono
```

---

## NestJS

```bash
npm install @velorate/core @velorate/nestjs
```

---

# Quick Start

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

app.get("/", (_, res) => {

    res.json({

        message: "Hello Velorate"

    });

});

app.listen(3000);
```

---

# Framework Support

| Framework | Status |
|-----------|:------:|
| Express | ✅ |
| Fastify | ✅ |
| Koa | ✅ |
| Hono | ✅ |
| NestJS | ✅ |

---

# Philosophy

Velorate is built around three principles.

- **Framework-independent core** — The core rate limiting engine has no dependency on any web framework.
- **Consistent API** — The same concepts work across every supported framework.
- **Extensible architecture** — Algorithms, storage engines, and adapters can be extended without modifying the core.

---

# Architecture

Velorate is divided into independent layers to keep the core framework-agnostic and make integrations easy to maintain.

```text
                ┌──────────────────────────────┐
                │        Application           │
                └──────────────┬───────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   Express Adapter      Fastify Adapter        NestJS Adapter
        │                      │                      │
        ├──────────────┬───────┴──────────────┬───────┤
                       ▼
                Velorate Core
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Algorithms      Storage       RateLimiter
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Memory Store       Redis Store
```

The core package contains all rate limiting logic. Framework adapters only translate incoming requests into a common interface, keeping the implementation consistent across frameworks.

---

# Algorithms

Velorate currently supports four algorithms.

| Algorithm | Best For |
|-----------|-----------|
| Fixed Window | Simple APIs and internal services |
| Sliding Window | Public APIs with smoother limiting |
| Token Bucket | Burst traffic |
| Leaky Bucket | Constant request processing |

---

## Fixed Window

Requests are counted within a fixed time interval.

```text
Window 1

██████████

↓

Reset

↓

Window 2
```

Advantages

- Simple implementation
- Fast execution
- Low memory usage

Best suited for

- Internal APIs
- Admin panels
- Authentication endpoints

---

## Sliding Window

Requests are calculated over a moving time window.

```text
Old Requests

↓

Expire

↓

New Window
```

Advantages

- Fair distribution
- Smoother limiting
- Better user experience

Best suited for

- Public REST APIs
- SaaS applications
- Mobile APIs

---

## Token Bucket

Tokens refill over time while allowing bursts.

```text
Bucket

██████

↓

Consume

███

↓

Refill
```

Advantages

- Allows bursts
- Stable average rate
- Efficient

Best suited for

- Payment APIs
- File uploads
- Event processing

---

## Leaky Bucket

Requests leave the bucket at a constant rate.

```text
Incoming

██████████

↓

Queue

↓

Constant Output
```

Advantages

- Smooth traffic
- Prevents spikes
- Predictable throughput

Best suited for

- Queues
- Background workers
- Streaming services

---

# Storage

Velorate separates algorithms from storage.

Current implementations:

| Store | Description |
|--------|-------------|
| MemoryStore | In-memory storage for development and single-instance deployments |
| RedisStore | Distributed storage for production deployments |

Since storage is abstracted, custom implementations can be created without modifying the core package.

---

# Supported Frameworks

| Framework | Package | Status |
|-----------|---------|:------:|
| Express | `@velorate/express` | ✅ |
| Fastify | `@velorate/fastify` | ✅ |
| Koa | `@velorate/koa` | ✅ |
| Hono | `@velorate/hono` | ✅ |
| NestJS | `@velorate/nestjs` | ✅ |

All adapters expose a familiar API while internally using the same core implementation.

---

# Feature Matrix

| Feature | Core | Express | Fastify | Koa | Hono | NestJS |
|---------|:----:|:-------:|:--------:|:---:|:-----:|:------:|
| Fixed Window | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sliding Window | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Token Bucket | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Leaky Bucket | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Memory Store | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Redis Store | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Key Generator | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Skip Requests | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Handler | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Message | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rate Limit Headers | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

# Project Structure

```text
velorate/

packages/

├── core/
├── express/
├── fastify/
├── hono/
├── koa/
└── nestjs/

examples/

├── express/
├── fastify/
├── hono/
├── koa/
└── nestjs/

docs/
```

The monorepo structure keeps the core isolated while allowing each framework adapter to evolve independently.

# Examples

The repository includes working examples for every supported framework.

| Framework | Example |
|-----------|---------|
| Express | `examples/express` |
| Fastify | `examples/fastify` |
| Koa | `examples/koa` |
| Hono | `examples/hono` |
| NestJS | `examples/nestjs` |

Each example demonstrates:

- Framework integration
- MemoryStore configuration
- Rate limiting behavior
- Standard response headers

---

# Basic Configuration

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

---

# Custom Key Generator

Generate rate limit keys using any request property.

```ts
rateLimit({

    store,

    algorithm,

    keyGenerator(request) {

        return request.user.id;

    }

});
```

---

# Skip Requests

Skip rate limiting for selected requests.

```ts
rateLimit({

    store,

    algorithm,

    skip(request) {

        return request.path === "/health";

    }

});
```

---

# Custom Handler

Override the default **429 Too Many Requests** response.

```ts
rateLimit({

    store,

    algorithm,

    handler(request, response) {

        response.status(429).json({

            success: false,

            message: "Rate limit exceeded."

        });

    }

});
```

---

# Custom Message

Customize the default error message.

```ts
rateLimit({

    store,

    algorithm,

    message: "Too many requests. Please try again later."

});
```

---

# Response Headers

Velorate automatically includes standard rate limiting headers.

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Seconds until retry |

Example

```http
HTTP/1.1 429 Too Many Requests

X-RateLimit-Limit: 100

X-RateLimit-Remaining: 0

Retry-After: 42
```

---

# API Overview

## Core

```ts
RateLimiter

MemoryStore

RedisStore

FixedWindow

SlidingWindow

TokenBucket

LeakyBucket
```

---

## Framework Adapters

```ts
rateLimit()
```

Available for

- Express
- Fastify
- Koa
- Hono

---

## NestJS

```ts
RateLimitModule

RateLimitGuard
```

---

# Benchmarks

The benchmark suite measures throughput across supported frameworks using identical algorithms and storage implementations.

Current benchmark scenarios include:

- MemoryStore
- RedisStore
- Fixed Window
- Sliding Window

Future benchmark reports will compare Velorate against other popular rate limiting libraries using identical workloads.

---

# Testing

Velorate includes comprehensive automated tests across all packages.

Coverage includes:

- Core algorithms
- Storage engines
- Framework adapters
- Headers
- Custom handlers
- Skip conditions
- Key generators
- Custom messages

Current status:

```text
107 Passing Tests
```

---

# Compatibility

| Requirement | Supported |
|------------|-----------|
| Node.js | 18+ |
| TypeScript | Yes |
| ESM | Yes |
| CommonJS | Planned |
| Bun | Planned |
| Deno | Planned |

---

# Documentation

Detailed documentation is available inside the `docs/` directory.

Topics include:

- Getting Started
- Installation
- Algorithms
- Storage
- Framework Adapters
- API Reference
- Best Practices
- FAQ

# Roadmap

The following features are planned for future releases.

## v1.0

- Core rate limiting engine
- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket
- Memory Store
- Redis Store
- Express adapter
- Fastify adapter
- Koa adapter
- Hono adapter
- NestJS adapter

---

## v1.1

- Benchmark suite
- Documentation website
- Additional storage engines
- Additional framework adapters
- Improved API documentation

---

## Future

- Bun adapter
- Elysia adapter
- Nitro adapter
- Oak adapter
- GraphQL integration
- WebSocket rate limiting
- Redis Cluster support

---

# Contributing

Contributions are welcome.

If you would like to improve Velorate, please:

1. Fork the repository.
2. Create a feature branch.
3. Follow the existing coding style.
4. Add or update tests when required.
5. Submit a pull request.

Please read the **CONTRIBUTING.md** guide before opening a pull request.

---

# Repository

```text
velorate/

packages/
│
├── core
├── express
├── fastify
├── hono
├── koa
└── nestjs

examples/

docs/

.github/
```

---

# Design Goals

Velorate is built around a small set of design principles.

- Framework-independent core
- Consistent APIs across adapters
- Pluggable algorithms
- Pluggable storage engines
- TypeScript-first development
- Predictable behavior
- Minimal dependencies
- Extensible architecture

---

# Documentation

Detailed documentation is available in the **docs/** directory.

Documentation includes:

- Getting Started
- Installation
- Algorithms
- Storage
- Express
- Fastify
- Koa
- Hono
- NestJS
- API Reference
- FAQ

---

# Support

If you encounter a bug or have a feature request, please open an issue on GitHub.

Questions and discussions are welcome through GitHub Discussions.

---

# License

MIT License

---

# Acknowledgements

Velorate is inspired by established rate limiting techniques and modern Node.js framework design while providing a consistent developer experience across multiple frameworks.

---

<div align="center">

Built with ❤️ using TypeScript.

If Velorate helps your project, consider giving the repository a ⭐.

</div>