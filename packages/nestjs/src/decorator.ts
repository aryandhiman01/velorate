import {

    SetMetadata

} from "@nestjs/common";

import {

    RATE_LIMIT_METADATA

} from "./metadata.js";

import type {

    RateLimitDecoratorOptions

} from "./interfaces.js";

export function RateLimit(

    options: RateLimitDecoratorOptions

) {

    return SetMetadata(

        RATE_LIMIT_METADATA,

        options

    );

}