import { Redis } from "ioredis";

import {
    RedisStore,
    FixedWindow,
    RateLimiter
} from "../../packages/core/src/index.js";

async function main() {

    const redis = new Redis({
        host: "127.0.0.1",
        port: 6379
    });

    const store = new RedisStore({
        client: redis
    });

    const config = {
        limit: 5,
        window: 10_000
    };

    const limiter = new RateLimiter(
        store,
        new FixedWindow(config)
    );

    for (let i = 1; i <= 7; i++) {

        const result = await limiter.check("aryan");

        console.log(`Request ${i}:`, result);

    }

    await redis.quit();

}

main();