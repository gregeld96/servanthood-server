import { Module } from "@nestjs/common";
import { MediaFileController } from "./mediafile.controller";
import { MediaFileService } from "./mediafile.service";
import { PrismaModule } from "libs/database";

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [MediaFileController],
    providers: [MediaFileService],
})

export class MediaFileModule {}