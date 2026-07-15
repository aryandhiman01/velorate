import Fastify from "fastify";

import {

    MemoryStore,

    FixedWindow

} from "@velorate/core";

import {

    rateLimit

} from "@velorate/fastify";

const app = Fastify();

await app.register(

    rateLimit,

    {

        store: new MemoryStore(),

        algorithm: new FixedWindow({

            limit: 5,

            window: 10000

        })

    }

);

app.get(

    "/",

    async () => {

        return {

            message: "Hello Velorate 🚀"

        };

    }

);

await app.listen({

    port: 3000

});

console.log(

    "Server running on http://localhost:3000"

);