import {

    Controller,

    Get,

    UseGuards

} from "@nestjs/common";

import {

    RateLimitGuard

} from "@velorate/nestjs";

@Controller()

@UseGuards(

    RateLimitGuard

)

export class AppController {

    @Get()

    getHello() {

        return {

            message: "Hello Velorate 🚀"

        };

    }

}