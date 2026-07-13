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

describe("Express Headers", () => {

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

    it("should include X-RateLimit-Remaining header", async () => {

        const app = createApp();

        const response = await request(app)
            .get("/");

        expect(
            response.headers[
                "x-ratelimit-remaining"
            ]
        ).toBeDefined();

    });

    it("should include Retry-After header", async () => {

        const app = createApp();

        for (let i = 0; i < 5; i++) {

            await request(app).get("/");

        }

        const response = await request(app)
            .get("/");

        expect(
            response.headers[
                "retry-after"
            ]
        ).toBeDefined();

    });

});