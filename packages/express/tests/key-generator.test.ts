import { describe, expect, it } from "vitest";

import express from "express";
import request from "supertest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src";

describe("Express Key Generator", () => {

    function createApp() {

        const app = express();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 2,

                    window: 1000

                }),

                keyGenerator: (req) =>
                    req.header("x-api-key") ?? "anonymous"

            })

        );

        app.get("/", (_, res) => {

            res.json({

                success: true

            });

        });

        return app;

    }

    it("should rate limit requests with same api key", async () => {

        const app = createApp();

        await request(app)
            .get("/")
            .set("x-api-key", "user-1");

        await request(app)
            .get("/")
            .set("x-api-key", "user-1");

        const response = await request(app)
            .get("/")
            .set("x-api-key", "user-1");

        expect(response.status).toBe(429);

    });

    it("should use different limits for different api keys", async () => {

        const app = createApp();

        await request(app)
            .get("/")
            .set("x-api-key", "user-1");

        await request(app)
            .get("/")
            .set("x-api-key", "user-2");

        const response1 = await request(app)
            .get("/")
            .set("x-api-key", "user-1");

        const response2 = await request(app)
            .get("/")
            .set("x-api-key", "user-2");

        expect(response1.status).toBe(200);

        expect(response2.status).toBe(200);

    });

});