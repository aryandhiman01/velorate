import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";

import {
    MemoryStore,
    FixedWindow
} from "@velorate/core";

import {
    rateLimit
} from "../src";

describe("Express Middleware", () => {

    function createApp() {

        const app = express();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 5,

                    window: 1000

                })

            })

        );

        app.get("/", (_, res) => {

            res.json({

                success: true

            });

        });

        return app;

    }

    it("should allow requests under limit", async () => {

        const app = createApp();

        const response = await request(app).get("/");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

    });

    it("should block requests after limit", async () => {

        const app = createApp();

        for (let i = 0; i < 5; i++) {

            await request(app).get("/");

        }

        const response = await request(app).get("/");

        expect(response.status).toBe(429);

        expect(response.body.error)
            .toBe("Too Many Requests");

    });

});