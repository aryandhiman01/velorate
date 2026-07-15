import Koa from "koa";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/koa";

const app = new Koa();

app.use(

    rateLimit({

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 5,

            window: 10_000

        })

    })

);

app.use(

    async (ctx) => {

        ctx.body = {

            message: "Hello Velorate 🚀"

        };

    }

);

app.listen(

    3000,

    () => {

        console.log(

            "Koa server running on http://localhost:3000"

        );

    }

);