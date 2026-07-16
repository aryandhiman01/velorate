import { Hono } from "hono";

import { serve} from "@hono/node-server";

import { FixedWindow, MemoryStore } from "@velorate/core";

import { rateLimit } from "@velorate/hono";
import { info } from "node:console";

const app = new Hono();

app.use(
    "*", rateLimit({
        store: new MemoryStore(),
        algorithm: new FixedWindow({
            limit: 5,
            window: 10000
        })
    })
);

app.get("/", (c) => {
    return c.json({
        message: "Hello Velorate 🚀"
    });
});

serve(
    {
        fetch: app.fetch,
        port: 3000
    },

    (info) => {
        console.log(`Hono server is running on http://localhost:${info.port}`);
    }
);