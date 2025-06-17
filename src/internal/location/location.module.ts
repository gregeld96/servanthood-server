import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { LocationInternalController } from "./location.controller";
import { LocationInternalService } from "./location.service";

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [LocationInternalController],
    providers: [LocationInternalService],
})

export class LocationInternalModule {}