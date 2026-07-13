# @velorate/express

Official **Express.js adapter** for **Velorate** --- a fast, flexible,
and production-ready rate limiting library.

## Features

-   Fast Express middleware
-   Fixed Window
-   Sliding Window
-   Token Bucket
-   Leaky Bucket
-   MemoryStore & RedisStore
-   Custom key generator
-   Skip routes
-   Custom handler
-   TypeScript support

## Installation

``` bash
pnpm add @velorate/core @velorate/express express
```

## Basic Usage

``` ts
import express from "express";
import { MemoryStore, FixedWindow } from "@velorate/core";
import { rateLimit } from "@velorate/express";

const app = express();

app.use(rateLimit({
  store: new MemoryStore(),
  algorithm: new FixedWindow({
    limit: 5,
    window: 10000
  })
}));

app.get("/", (_req, res) => {
  res.json({ message: "Hello Velorate 🚀" });
});

app.listen(3000);
```

## Redis Example

``` ts
const client = createRedisClient();

app.use(rateLimit({
  store: new RedisStore({ client }),
  algorithm: new FixedWindow({
    limit: 100,
    window: 60000
  })
}));
```

## Algorithms

-   Fixed Window
-   Sliding Window
-   Token Bucket
-   Leaky Bucket

## Options

  Option         Description
  -------------- -------------------------
  store          Storage implementation
  algorithm      Rate limiting algorithm
  keyGenerator   Custom identifier
  skip           Skip callback
  handler        Custom blocked handler
  message        Custom error message

## Response Headers

-   X-RateLimit-Remaining
-   Retry-After

## Best Practices

-   Use MemoryStore for development.
-   Use RedisStore for production.
-   Skip health-check routes.
-   Use custom keys for authenticated APIs.

## License

MIT
