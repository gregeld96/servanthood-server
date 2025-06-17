import { Module } from "@nestjs/common";

import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { AnnouncementInternalController } from "./announcement.controller";
import { AnnouncementInternalService } from "./announcement.service";

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [AnnouncementInternalController],
    providers: [AnnouncementInternalService],
})

export class AnnouncementInternalModule {}