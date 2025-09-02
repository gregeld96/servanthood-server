import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { PrismaModule } from "libs/database";

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [LocationController],
    providers: [LocationService],
})

export class LocationModule {}