import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore} from "../src/storage/MemoryStore";
import type { RateLimitState } from "../src/types/rate-limit-state";
import { count } from "node:console";

describe("MemoryStore", () => {
    let store: MemoryStore;

    beforeEach(() => {
        store = new MemoryStore();
    });

    it("should return null for non existing key", async () => {

        const state = await store.get("user-1");

        expect(state).toBeNull();
    });

    it("should store and retrieve a state", async () => {
        const state: RateLimitState = {
            count: 3,
            resetAt: Date.now() + 60000
        };

        await store.set("user-1", state);

        const result = await store.get("user-1");

        expect(result).toEqual(state);
    });

    it("should overwrite an existing state", async () => {
        await store.set("user-1", {
            count: 1,
            resetAt: 2000
        });

        await store.set("user-1", {
            count: 5,
            resetAt: 2000
        });

        const result = await store.get("user-1");

        expect(result).toEqual({
            count: 5,
            resetAt: 2000
        });
    });

    it("should delete a key", async () => {

        await store.set("user-1", {

            count: 5,

            resetAt: 1000

        });

        await store.delete("user-1");

        const result = await store.get("user-1");

        expect(result).toBeNull();

    });

    it("should clear the entire store", async () => {

        await store.set("user-1", {

            count: 1,

            resetAt: 1000

        });

        await store.set("user-2", {

            count: 2,

            resetAt: 2000

        });

        await store.clear();

        expect(await store.get("user-1")).toBeNull();

        expect(await store.get("user-2")).toBeNull();

    });
})