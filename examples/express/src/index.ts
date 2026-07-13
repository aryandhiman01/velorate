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

            window: 10000

        })

    })

);

app.get("/", (_, res) => {

    res.json({

        message: "Velorate is working 🚀"

    });

});

app.listen(3000, () => {

    console.log(

        "Server running at http://localhost:3000"

    );

});