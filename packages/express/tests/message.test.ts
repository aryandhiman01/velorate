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

describe("Express Custom Message", () => {

    function createApp() {

        const app = express();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 1000

                }),

                message: "Upgrade your plan"

            })

        );

        app.get("/", (_req, res) => {

            res.json({

                success: true

            });

        });

        return app;

    }

    it("should return custom message when rate limit is exceeded", async () => {

        const app = createApp();

        const first = await request(app).get("/");

        expect(first.status).toBe(200);

        const second = await request(app).get("/");

        expect(second.status).toBe(429);

        expect(second.body.error).toBe(

            "Upgrade your plan"

        );

    });

    it("should not return default message when custom message is provided", async () => {

        const app = createApp();

        await request(app).get("/");

        const response = await request(app).get("/");

        expect(response.body.error).not.toBe(

            "Too Many Requests"

        );

    });

});