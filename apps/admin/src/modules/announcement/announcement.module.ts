import { Module } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { PrismaModule } from "libs/database";
import { AnnouncementController } from "./announcement.controller";

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [AnnouncementController],
    providers: [AnnouncementService],
})

export class AnnouncementModule {}