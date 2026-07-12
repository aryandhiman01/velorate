import { describe, expect, it } from "vitest";

import { LeakyBucket } from "../src/algorithms/LeakyBucket.js";
import { InvalidConfigurationError } from "../src/errors/InvalidConfigurationError.js";

describe("LeakyBucket", () => {

    it("should allow the first request", () => {

        const algorithm = new LeakyBucket(5, 1);

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

    it("should increase queue size", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(5, 1);

        const result = algorithm.execute({

            state: {
                queueSize: 2,
                lastLeak: now
            },

            config: {
                limit: 5,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBe(3);
        expect(result.remaining).toBe(2);

    });

    it("should reject when bucket is full", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(5, 1);

        const result = algorithm.execute({

            state: {
                queueSize: 5,
                lastLeak: now
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

    it("should leak requests after one second", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(5, 1);

        const result = algorithm.execute({

            state: {
                queueSize: 5,
                lastLeak: now - 1000
            },

            config: {
                limit: 5,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBe(5);

    });

    it("should leak multiple requests", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(10, 2);

        const result = algorithm.execute({

            state: {
                queueSize: 8,
                lastLeak: now - 3000
            },

            config: {
                limit: 10,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBe(3);

    });

    it("should empty bucket after long inactivity", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(10, 2);

        const result = algorithm.execute({

            state: {
                queueSize: 10,
                lastLeak: now - 10000
            },

            config: {
                limit: 10,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBe(1);

    });

    it("should support fractional leaking", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(5, 2);

        const result = algorithm.execute({

            state: {
                queueSize: 4,
                lastLeak: now - 500
            },

            config: {
                limit: 5,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBeCloseTo(4);

    });

    it("should reject invalid capacity", () => {

        expect(() => {

            new LeakyBucket(
                0,
                1
            );

        }).toThrow(
            InvalidConfigurationError
        );

    });

    it("should reject invalid leak rate", () => {

        expect(() => {

            new LeakyBucket(
                5,
                0
            );

        }).toThrow(
            InvalidConfigurationError
        );

    });

    it("should calculate remaining capacity correctly", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(10, 1);

        const result = algorithm.execute({

            state: {
                queueSize: 7,
                lastLeak: now
            },

            config: {
                limit: 10,
                window: 10000
            },

            now

        });

        expect(result.remaining).toBe(2);

    });

    it("should never allow queue size to become negative", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(10, 5);

        const result = algorithm.execute({

            state: {
                queueSize: 2,
                lastLeak: now - 10000
            },

            config: {
                limit: 10,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(true);
        expect(result.state.queueSize).toBe(1);

    });

    it("should calculate retryAfter correctly", () => {

        const now = Date.now();

        const algorithm = new LeakyBucket(5, 2);

        const result = algorithm.execute({

            state: {
                queueSize: 5,
                lastLeak: now
            },

            config: {
                limit: 5,
                window: 10000
            },

            now

        });

        expect(result.allowed).toBe(false);
        expect(result.retryAfter).toBeGreaterThan(0);

    });

});