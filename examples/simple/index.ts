import {
  MemoryStore,
  FixedWindow,
  RateLimiter
} from "../../packages/core/src/index.js";

async function main() {

  const limiter = new RateLimiter(
    new MemoryStore(),
    new FixedWindow({
      limit: 5,
      window: 10_000
    })
  );

  for (let i = 1; i <= 7; i++) {

    const result = await limiter.check("127.0.0.1");

    console.log(
      `Request ${i}:`,
      result
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

  }

}

main();