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

describe("Express Custom Handler", () => {

    function createApp(
        called: { value: number }
    ) {

        const app = express();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 1000

                }),

                handler: (_req, res) => {

                    called.value++;

                    res.status(429).json({

                        custom: true,

                        message: "Blocked by custom handler"

                    });

                }

            })

        );

        app.get("/", (_req, res) => {

            res.json({

                success: true

            });

        });

        return app;

    }

    it("should call custom handler after limit is exceeded", async () => {

        const called = {

            value: 0

        };

        const app = createApp(called);

        const first = await request(app).get("/");

        expect(first.status).toBe(200);

        expect(called.value).toBe(0);

        const second = await request(app).get("/");

        expect(second.status).toBe(429);

        expect(second.body.custom).toBe(true);

        expect(second.body.message).toBe(

            "Blocked by custom handler"

        );

        expect(called.value).toBe(1);

    });

    it("should execute custom handler every time limit is exceeded", async () => {

        const called = {

            value: 0

        };

        const app = createApp(called);

        await request(app).get("/");

        await request(app).get("/");

        await request(app).get("/");

        expect(called.value).toBe(2);

    });

});