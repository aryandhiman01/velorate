import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Redis } from "ioredis";

import { RedisStore } from "../src/storage/RedisStore.js";

describe("RedisStore", () => {

    let client: Redis;
    let store: RedisStore;

    beforeAll(async () => {

        client = new Redis({
            host: "127.0.0.1",
            port: 6379
        });

        store = new RedisStore({
            client,
            prefix: "velorate-test"
        });

    });

    beforeEach(async () => {
        await store.clear();
    });

    afterAll(async () => {
        await client.quit();
    });

    it("should return null for non existing key", async () => {

        const state = await store.get("user-1");

        expect(state).toBeNull();

    });

    it("should store and retrieve state", async () => {

        const data = {
            count: 1,
            resetAt: Date.now() + 10_000
        };

        await store.set("user-1", data);

        const state = await store.get("user-1");

        expect(state).toEqual(data);

    });

    it("should overwrite existing state", async () => {

        await store.set("user-1", {
            count: 1,
            resetAt: Date.now() + 10_000
        });

        await store.set("user-1", {
            count: 5,
            resetAt: Date.now() + 20_000
        });

        const state = await store.get("user-1");

        expect(state?.count).toBe(5);

    });

    it("should delete key", async () => {

        await store.set("user-1", {
            count: 1,
            resetAt: Date.now() + 10_000
        });

        await store.delete("user-1");

        expect(await store.get("user-1")).toBeNull();

    });

    it("should clear the store", async () => {

        await store.set("a", {
            count: 1,
            resetAt: Date.now() + 10_000
        });

        await store.set("b", {
            count: 2,
            resetAt: Date.now() + 10_000
        });

        await store.clear();

        expect(await store.get("a")).toBeNull();

        expect(await store.get("b")).toBeNull();

    });

    it("should expire key automatically", async () => {

        await store.set("user-1", {
            count: 1,
            resetAt: Date.now() + 1000
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        expect(await store.get("user-1")).toBeNull();

    });

    it("should isolate different users", async () => {

        await store.set("alice", {
            count: 2,
            resetAt: Date.now() + 10_000
        });

        await store.set("bob", {
            count: 5,
            resetAt: Date.now() + 10_000
        });

        const alice = await store.get("alice");
        const bob = await store.get("bob");

        expect(alice?.count).toBe(2);
        expect(bob?.count).toBe(5);

    });

});