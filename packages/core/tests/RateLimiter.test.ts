import { beforeEach, describe, expect, it } from "vitest";

import { MemoryStore } from "../src/storage/MemoryStore.js";
import { FixedWindow } from "../src/algorithms/FixedWindow.js";
import { RateLimiter } from "../src/core/RateLimiter.js";

describe("RateLimiter", () => {

    let limiter: RateLimiter;

    beforeEach(() => {

        limiter = new RateLimiter(

            new MemoryStore(),

            new FixedWindow({

                limit: 5,

                window: 10000

            })

        );

    });

    it("should allow the first request", async () => {

        const result = await limiter.check("user-1");

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4);
        expect(result.retryAfter).toBe(0);

    });

    it("should allow requests until the limit is reached", async () => {

        for (let i = 0; i < 5; i++) {

            const result = await limiter.check("user-1");

            expect(result.allowed).toBe(true);

        }

    });

    it("should block requests after the limit is exceeded", async () => {

        for (let i = 0; i < 5; i++) {

            await limiter.check("user-1");

        }

        const result = await limiter.check("user-1");

        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.retryAfter).toBeGreaterThan(0);

    });

    it("should keep different users isolated", async () => {

        for (let i = 0; i < 5; i++) {

            await limiter.check("user-1");

        }

        const blocked = await limiter.check("user-1");

        const allowed = await limiter.check("user-2");

        expect(blocked.allowed).toBe(false);

        expect(allowed.allowed).toBe(true);

        expect(allowed.remaining).toBe(4);

    });

    it("should reset a user", async () => {

        await limiter.check("user-1");

        await limiter.reset("user-1");

        const result = await limiter.check("user-1");

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4);

    });

    it("should clear the entire store", async () => {

        await limiter.check("user-1");
        await limiter.check("user-2");

        await limiter.clear();

        const user1 = await limiter.check("user-1");
        const user2 = await limiter.check("user-2");

        expect(user1.remaining).toBe(4);
        expect(user2.remaining).toBe(4);

    });

});