import { describe, expect, it } from "vitest";

import { TokenBucket } from "../src/algorithms/TokenBucket.js";
import { InvalidConfigurationError } from "../src/errors/InvalidConfigurationError.js";

describe("TokenBucket", () => {

    it("should allow the first request", () => {

        const algorithm = new TokenBucket(5, 1);

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

    it("should consume one token per request", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(5, 1);

        const result = algorithm.execute({
            state: {
                tokens: 3,
                lastRefill: now
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.tokens).toBe(2);
        expect(result.remaining).toBe(2);

    });

    it("should reject when bucket is empty", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(5, 1);

        const result = algorithm.execute({
            state: {
                tokens: 0,
                lastRefill: now
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

    it("should refill tokens after one second", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(5, 1);

        const result = algorithm.execute({
            state: {
                tokens: 0,
                lastRefill: now - 1000
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.tokens).toBe(0);

    });

    it("should refill multiple tokens", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(10, 2);

        const result = algorithm.execute({
            state: {
                tokens: 2,
                lastRefill: now - 3000
            },
            config: {
                limit: 10,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.tokens).toBe(7);

    });

    it("should never exceed capacity", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(5, 10);

        const result = algorithm.execute({
            state: {
                tokens: 5,
                lastRefill: now - 10000
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.tokens).toBe(4);

    });

    it("should support fractional refill", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(5, 2);

        const result = algorithm.execute({
            state: {
                tokens: 1,
                lastRefill: now - 500
            },
            config: {
                limit: 5,
                window: 10000
            },
            now
        });

        expect(result.allowed).toBe(true);
        expect(result.state.tokens).toBeCloseTo(1);

    });

    it("should reject invalid capacity", () => {

        expect(() => {

            new TokenBucket(
                0,
                1
            );

        }).toThrow(
            InvalidConfigurationError
        );

    });

    it("should reject invalid refill rate", () => {

        expect(() => {

            new TokenBucket(
                5,
                0
            );

        }).toThrow(
            InvalidConfigurationError
        );

    });

    it("should calculate remaining tokens correctly", () => {

        const now = Date.now();

        const algorithm = new TokenBucket(10, 1);

        const result = algorithm.execute({
            state: {
                tokens: 8,
                lastRefill: now
            },
            config: {
                limit: 10,
                window: 10000
            },
            now
        });

        expect(result.remaining).toBe(7);

    });

});