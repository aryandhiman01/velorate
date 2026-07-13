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

describe("Express Skip Option", () => {

    function createApp() {

        const app = express();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 1000

                }),

                skip: (req) => req.path === "/health"

            })

        );

        app.get("/", (_, res) => {

            res.json({

                success: true

            });

        });

        app.get("/health", (_, res) => {

            res.json({

                healthy: true

            });

        });

        return app;

    }

    it("should skip rate limiting for health route", async () => {

        const app = createApp();

        for (let i = 0; i < 10; i++) {

            const response = await request(app)
                .get("/health");

            expect(response.status).toBe(200);

            expect(response.body.healthy).toBe(true);

        }

    });

    it("should still rate limit other routes", async () => {

        const app = createApp();

        const first = await request(app)
            .get("/");

        expect(first.status).toBe(200);

        const second = await request(app)
            .get("/");

        expect(second.status).toBe(429);

    });

});