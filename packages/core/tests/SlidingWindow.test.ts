import { describe, expect, it } from "vitest";

import { SlidingWindow } from "../src/algorithms/SlidingWindow.js";
import { InvalidConfigurationError } from "../src/errors/InvalidConfigurationError.js";

describe("SlidingWindow", () => {

    it("should allow the first request", () => {

        const algorithm = new SlidingWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            state: null,
            config: {
                limit: 5,
                window: 10000
            },
            now: Date.now()
        });

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4);
        expect(result.retryAfter).toBe(0);

    });

    it("should increase current count", () => {

        const now = Date.now();

        const algorithm = new SlidingWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            state: {
                currentCount: 2,
                previousCount: 0,
                windowStart: now
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.currentCount).toBe(3);

    });

    it("should block requests after limit", () => {

        const now = Date.now();

        const algorithm = new SlidingWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            state: {
                currentCount: 5,
                previousCount: 0,
                windowStart: now
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.retryAfter).toBeGreaterThan(0);

    });

    it("should move current window into previous window", () => {

        const now = Date.now();

        const algorithm = new SlidingWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            state: {
                currentCount: 3,
                previousCount: 1,
                windowStart: now - 10001
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.previousCount).toBe(3);
        expect(result.state.currentCount).toBe(1);

    });

    it("should calculate weighted requests correctly", () => {

        const now = Date.now();

        const algorithm = new SlidingWindow({
            limit: 10,
            window: 10000
        });

        const result = algorithm.execute({
            state: {
                currentCount: 4,
                previousCount: 6,
                windowStart: now - 5000
            },
            config: {
                limit: 10,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);

    });

    it("should reset after long inactivity", () => {

        const now = Date.now();

        const algorithm = new SlidingWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            state: {
                currentCount: 5,
                previousCount: 5,
                windowStart: now - 30000
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.currentCount).toBe(1);

    });

    it("should reject invalid limit", () => {

        expect(() => {

            new SlidingWindow({
                limit: 0,
                window: 10000
            });

        }).toThrow(InvalidConfigurationError);

    });

    it("should reject invalid window", () => {

        expect(() => {

            new SlidingWindow({
                limit: 5,
                window: 0
            });

        }).toThrow(InvalidConfigurationError);

    });

});