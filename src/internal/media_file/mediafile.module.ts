import { Module } from "@nestjs/common";
import { MediaFileController } from "./mediafile.controller";
import { MediaFileService } from "./mediafile.service";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [MediaFileController],
    providers: [MediaFileService],
})

export class MediaFileInternalModule {}