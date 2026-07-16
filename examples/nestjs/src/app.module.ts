import {

    Module

} from "@nestjs/common";

import {

    FixedWindow,

    MemoryStore

} from "@velorate/core";

import {

    RateLimitModule

} from "@velorate/nestjs";

import {

    AppController

} from "./app.controller.js";

@Module({

    imports: [

        RateLimitModule.forRoot({

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 5,

                window: 10_000

            })

        })

    ],

    controllers: [

        AppController

    ]

})

export class AppModule {}