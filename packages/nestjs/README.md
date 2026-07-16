# @velorate/nestjs

Official **NestJS adapter** for **Velorate**, a fast, flexible, and production-ready rate limiting library.

## Features

- Native NestJS guard
- Dynamic module support
- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket
- MemoryStore
- RedisStore
- Custom key generator
- Skip requests
- Custom handler
- Dependency Injection support
- TypeScript support

---

## Installation

```bash
pnpm add @velorate/core @velorate/nestjs
```

```bash
npm install @velorate/core @velorate/nestjs
```

```bash
yarn add @velorate/core @velorate/nestjs
```

---

## Quick Start

```ts
import { Module } from "@nestjs/common";

import {
  MemoryStore,
  FixedWindow,
} from "@velorate/core";

import { RateLimitModule } from "@velorate/nestjs";

@Module({
  imports: [
    RateLimitModule.forRoot({
      store: new MemoryStore(),
      algorithm: new FixedWindow({
        limit: 5,
        window: 10_000,
      }),
    }),
  ],
})
export class AppModule {}
```

---

## Using Redis

Use `RedisStore` for production or when running multiple application instances.

```ts
import { Module } from "@nestjs/common";
import { createClient } from "redis";

import {
  RedisStore,
  FixedWindow,
} from "@velorate/core";

import { RateLimitModule } from "@velorate/nestjs";

const client = createClient();

await client.connect();

@Module({
  imports: [
    RateLimitModule.forRoot({
      store: new RedisStore({
        client,
      }),
      algorithm: new FixedWindow({
        limit: 100,
        window: 60_000,
      }),
    }),
  ],
})
export class AppModule {}
```

---

## Protect Routes

```ts
import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";

import { RateLimitGuard } from "@velorate/nestjs";

@Controller()
@UseGuards(RateLimitGuard)
export class AppController {
  @Get()
  getHello() {
    return {
      message: "Hello Velorate 🚀",
    };
  }
}
```

---

## Supported Algorithms

- Fixed Window
- Sliding Window
- Token Bucket
- Leaky Bucket

---

## Supported Stores

- MemoryStore
- RedisStore

---

## Configuration

| Option | Description |
|---------|-------------|
| `store` | Storage implementation |
| `algorithm` | Rate limiting algorithm |
| `keyGenerator` | Generate a custom identifier |
| `skip` | Skip rate limiting |
| `message` | Custom error message |
| `handler` | Custom blocked request handler |

---

## Response Headers

| Header | Description |
|---------|-------------|
| `X-RateLimit-Limit` | Maximum allowed requests |
| `X-RateLimit-Remaining` | Remaining requests |
| `Retry-After` | Time until the next request is allowed |

---

## Project Structure

```text
@velorate/nestjs
├── RateLimitModule
├── RateLimitGuard
├── RateLimitService
└── @velorate/core
```

---

## License

MIT