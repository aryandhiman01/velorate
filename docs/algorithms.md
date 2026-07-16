# Algorithms

Velorate provides multiple rate limiting algorithms, each designed for different traffic patterns and application requirements.

Every algorithm implements the same interface, allowing you to switch strategies without changing your application code.

---

# Available Algorithms

| Algorithm | Best For |
|-----------|----------|
| Fixed Window | Simple APIs and internal services |
| Sliding Window | Public APIs and user-facing applications |
| Token Bucket | Burst traffic |
| Leaky Bucket | Constant throughput |

---

# Fixed Window

The Fixed Window algorithm counts requests within a fixed time interval.

For example, with a limit of **100 requests per minute**, every request made during that minute is counted together. Once the minute ends, the counter resets.

```text
Minute 1

██████████

100 / 100

↓

Reset

↓

Minute 2

0 / 100
```

## Advantages

- Simple implementation
- Very fast
- Low memory usage
- Easy to understand

## Limitations

Traffic spikes can occur at window boundaries.

Example:

```text
59.9 sec

100 requests

↓

60.1 sec

100 requests
```

This allows nearly **200 requests** in a very short period.

## Recommended Use Cases

- Internal APIs
- Admin dashboards
- Authentication endpoints
- Low traffic services

---

# Sliding Window

Sliding Window continuously evaluates requests over a moving time window.

Instead of resetting counters at fixed intervals, older requests gradually expire.

```text
Request Timeline

■■■■■■■■■■

↓

Old requests expire

↓

Window slides
```

## Advantages

- Fair request distribution
- Prevents boundary spikes
- Better user experience

## Limitations

Slightly more complex than Fixed Window.

## Recommended Use Cases

- Public REST APIs
- SaaS platforms
- Mobile applications
- Customer-facing services

---

# Token Bucket

The Token Bucket algorithm stores tokens that refill over time.

Each incoming request consumes one token.

If no tokens remain, the request is rejected.

```text
Bucket

██████████

↓

Consume

██████

↓

Refill

████████
```

## Advantages

- Supports burst traffic
- Smooth average request rate
- Efficient resource usage

## Limitations

Requires refill calculations.

## Recommended Use Cases

- Payment APIs
- Upload services
- Event processing
- External integrations

---

# Leaky Bucket

The Leaky Bucket algorithm processes requests at a constant rate.

Incoming requests are placed into a queue and released steadily.

```text
Incoming

██████████

↓

Queue

██████████

↓

Constant Output

██
██
██
██
```

## Advantages

- Predictable throughput
- Prevents sudden spikes
- Stable processing rate

## Limitations

Burst requests may wait in the queue.

## Recommended Use Cases

- Background jobs
- Queue systems
- Streaming services
- Message processing

---

# Choosing an Algorithm

| Scenario | Recommended Algorithm |
|----------|-----------------------|
| Internal API | Fixed Window |
| Public API | Sliding Window |
| Burst traffic | Token Bucket |
| Constant processing | Leaky Bucket |

---

# Switching Algorithms

One of Velorate's design goals is to make algorithms interchangeable.

Example:

```ts
import {

    FixedWindow

} from "@velorate/core";

const algorithm = new FixedWindow({

    limit: 100,

    window: 60_000

});
```

Changing to another algorithm only requires replacing the constructor.

```ts
import {

    SlidingWindow

} from "@velorate/core";

const algorithm = new SlidingWindow({

    limit: 100,

    window: 60_000

});
```

No other application code needs to change.

---

# Performance Considerations

| Algorithm | Complexity |
|-----------|------------|
| Fixed Window | Low |
| Sliding Window | Medium |
| Token Bucket | Medium |
| Leaky Bucket | Medium |

The appropriate algorithm depends more on application requirements than raw performance.

---

# Best Practices

- Use **Fixed Window** for simple APIs.
- Use **Sliding Window** for public-facing services.
- Use **Token Bucket** when burst traffic is expected.
- Use **Leaky Bucket** when consistent request processing is required.

---

# Next Steps

Continue with:

- Stores
- Express
- Fastify
- Koa
- Hono
- NestJS
- API Reference