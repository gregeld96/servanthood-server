import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { PrismaModule } from "libs/database";


@Module({
    imports: [
        PrismaModule,
    ],
    providers: [EventService],
    controllers: [EventController]
})

export class EventModule {}