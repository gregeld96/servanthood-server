import { Module } from "@nestjs/common";
import { MediaFileController } from "./mediafile.controller";
import { MediaFileService } from "./mediafile.service";
import { PrismaModule } from "libs/database";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        PrismaModule,
        ConfigModule,
    ],
    controllers: [MediaFileController],
    providers: [MediaFileService],
})

export class MediaFileModule {}