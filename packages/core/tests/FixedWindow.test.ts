import { describe, expect, it } from "vitest";

import { FixedWindow } from "../src/algorithms/FixedWindow.js";

describe("FixedWindow", () => {

    it("should allow the first request", () => {

        const algorithm = new FixedWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute(null);

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4);
        expect(result.retryAfter).toBe(0);
        expect(result.state.count).toBe(1);

    });

    it("should increment the request count", () => {

        const algorithm = new FixedWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            count: 2,
            resetAt: Date.now() + 10000
        });

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(2);
        expect(result.state.count).toBe(3);

    });

    it("should block requests after the limit is reached", () => {

        const algorithm = new FixedWindow({
            limit: 5,
            window: 10000
        });

        const state = {
            count: 5,
            resetAt: Date.now() + 10000
        };

        const result = algorithm.execute(state);

        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.retryAfter).toBeGreaterThan(0);
        expect(result.state).toEqual(state);

    });

    it("should reset the counter after the window expires", () => {

        const algorithm = new FixedWindow({
            limit: 5,
            window: 10000
        });

        const result = algorithm.execute({
            count: 5,
            resetAt: Date.now() - 1000
        });

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4);
        expect(result.retryAfter).toBe(0);
        expect(result.state.count).toBe(1);

    });

    it("should decrease remaining requests correctly", () => {

        const algorithm = new FixedWindow({
            limit: 10,
            window: 10000
        });

        const result = algorithm.execute({
            count: 7,
            resetAt: Date.now() + 10000
        });

        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(2);
        expect(result.state.count).toBe(8);

    });

    it("should reject invalid limit", () => {

        expect(() => {

            new FixedWindow({
                limit: 0,
                window: 10000
            });

        }).toThrow("Rate limit must be greater than 0.");

    });

    it("should reject invalid window", () => {

        expect(() => {

            new FixedWindow({
                limit: 5,
                window: 0
            });

        }).toThrow("Window duration must be greater than 0.");

    });

});