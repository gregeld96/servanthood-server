import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { SpeakerInternalController } from "./speaker.controller";
import { SpeakerInternalService } from "./speaker.service";

@Module({
    imports: [
        PrismaModule,
    ],
    providers: [SpeakerInternalService],
    controllers: [SpeakerInternalController],
})

export class SpeakerInternalModule {}