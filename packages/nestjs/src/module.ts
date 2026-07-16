import {

    DynamicModule,

    Module

} from "@nestjs/common";

import {

    RATE_LIMIT_OPTIONS

} from "./constants.js";

import {

    RateLimitService

} from "./service.js";

import {

    RateLimitGuard

} from "./guard.js";

import type {

    RateLimitModuleOptions

} from "./interfaces.js";

@Module({})
export class RateLimitModule {

    static forRoot(

        options: RateLimitModuleOptions

    ): DynamicModule {

        return {

            global: true,

            module: RateLimitModule,

            providers: [

                {

                    provide:

                        RATE_LIMIT_OPTIONS,

                    useValue: options

                },

                RateLimitService,

                RateLimitGuard

            ],

            exports: [

                RateLimitService,

                RateLimitGuard

            ]

        };

    }

}