import express from "express";

import {
    MemoryStore,
    FixedWindow
} from "@velorate/core";

import {
    rateLimit
} from "@velorate/express";

const app = express();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 5,

            window: 10_000

        })

    })

);

app.get("/", (_req, res) => {

    res.json({

        message: "Hello from Velorate 🚀"

    });

});

app.listen(3000, () => {

    console.log(

        "🚀 Example server running at http://localhost:3000"

    );

});