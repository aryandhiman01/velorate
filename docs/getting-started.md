# Getting Started

Welcome to **Velorate**.

Velorate is a framework-independent rate limiting library for Node.js that provides multiple algorithms, pluggable storage engines, and native adapters for popular web frameworks.

This guide introduces the project architecture, explains how the packages are organized, and helps you create your first rate limiter.

---

# What is Velorate?

Velorate separates the rate limiting engine from framework-specific integrations.

Instead of implementing rate limiting separately for every framework, the core package contains all algorithms and storage implementations while lightweight adapters integrate with Express, Fastify, Koa, Hono, and NestJS.

This architecture provides a consistent API regardless of the framework you choose.

---

# Architecture

```text
Application
      │
      ▼
Framework Adapter
      │
      ▼
Velorate Core
      │
      ├── Algorithms
      │
      ├── Storage
      │
      └── RateLimiter
```

The core package has no dependency on any web framework.

Framework adapters only translate incoming requests into the core API.

---

# Package Overview

Velorate is organized as a monorepo.

```text
packages/

core/
express/
fastify/
koa/
hono/
nestjs/

examples/

docs/
```

Each package has a single responsibility.

| Package | Responsibility |
|---------|----------------|
| `@velorate/core` | Algorithms, storage, and rate limiting engine |
| `@velorate/express` | Express adapter |
| `@velorate/fastify` | Fastify adapter |
| `@velorate/koa` | Koa adapter |
| `@velorate/hono` | Hono adapter |
| `@velorate/nestjs` | NestJS adapter |

---

# Core Concepts

Velorate consists of three building blocks.

## Algorithm

An algorithm determines **when** requests should be allowed or rejected.

Supported algorithms:

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

---

## Store

A store determines **where** rate limit data is stored.

Available stores:

- MemoryStore
- RedisStore

Custom stores can also be implemented.

---

## Adapter

An adapter connects Velorate with a web framework.

Supported adapters:

- Express
- Fastify
- Koa
- Hono
- NestJS

All adapters share the same concepts and similar configuration.

---

# Installation

Install the core package together with the adapter for your framework.

Example (Express):

```bash
npm install @velorate/core @velorate/express
```

or

```bash
pnpm add @velorate/core @velorate/express
```

See the **Installation** guide for framework-specific instructions.

---

# Your First Rate Limiter

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

The application now allows up to **100 requests per minute** for each client.

---

# Request Flow

A request passes through the following steps.

```text
Incoming Request
        │
        ▼
Framework Adapter
        │
        ▼
Generate Key
        │
        ▼
Algorithm
        │
        ▼
Store
        │
        ▼
Allow or Reject
        │
        ▼
Response
```

This flow is identical across every supported framework.

---

# Choosing an Algorithm

Different workloads benefit from different algorithms.

| Use Case | Recommended Algorithm |
|----------|-----------------------|
| Internal APIs | Fixed Window |
| Public REST APIs | Sliding Window |
| Burst Traffic | Token Bucket |
| Constant Processing | Leaky Bucket |

The algorithm can be changed without changing the rest of your application.

---

# Choosing a Store

| Store | Recommended For |
|--------|-----------------|
| MemoryStore | Development, testing, single-instance deployments |
| RedisStore | Production, distributed deployments, multiple servers |

---

# Next Steps

Continue with the following guides:

1. Installation
2. Algorithms
3. Stores
4. Framework Adapter
5. API Reference

---

# Learn More

- Installation
- Algorithms
- Stores
- Express
- Fastify
- Koa
- Hono
- NestJS
- API Reference
- FAQ