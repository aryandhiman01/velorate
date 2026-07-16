import {

    DynamicModule,

    MiddlewareConsumer,

    Module,

    NestModule

} from "@nestjs/common";

import {

    RateLimitMiddleware

} from "./middleware.js";

import type {

    RateLimitModuleOptions

} from "./interfaces.js";

@Module({})
export class RateLimitModule implements NestModule {

    static forRoot(

        options: RateLimitModuleOptions

    ): DynamicModule {

        return {

            module: RateLimitModule,

            providers: [

                {

                    provide: "RATE_LIMIT_OPTIONS",

                    useValue: options

                },

                {

                    provide: RateLimitMiddleware,

                    useFactory: () =>

                        new RateLimitMiddleware(

                            options

                        )

                }

            ],

            exports: [

                RateLimitMiddleware

            ]

        };

    }

    configure(

        consumer: MiddlewareConsumer

    ): void {

        consumer

            .apply(

                RateLimitMiddleware

            )

            .forRoutes("*");

    }

}