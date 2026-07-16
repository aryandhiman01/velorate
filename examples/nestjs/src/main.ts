import "reflect-metadata";

import {

    NestFactory

} from "@nestjs/core";

import {

    AppModule

} from "./app.module.js";

async function bootstrap() {

    const app = await NestFactory.create(

        AppModule

    );

    await app.listen(3000);

    console.log("NestJS running at http://localhost:3000");

}

bootstrap();