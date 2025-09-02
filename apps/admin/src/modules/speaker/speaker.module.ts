import { Module } from "@nestjs/common";
import { SpeakerController } from "./speaker.controller";
import { SpeakerService } from "./speaker.service";
import { PrismaModule } from "libs/database";

@Module({
    imports: [
        PrismaModule,
    ],
    providers: [SpeakerService],
    controllers: [SpeakerController],
})

export class SpeakerModule {}