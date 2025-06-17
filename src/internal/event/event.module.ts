import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { EventInternalController } from "./event.controller";
import { EventInternalService } from "./event.service";


@Module({
    imports: [
        PrismaModule,
    ],
    providers: [EventInternalService],
    controllers: [EventInternalController]
})

export class EventInternalModule {}