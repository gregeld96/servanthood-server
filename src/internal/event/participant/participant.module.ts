import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { EventParticipantInternalController } from "./participant.controller";
import { EventParticipantInternalService } from "./participant.service";
import { Module } from "@nestjs/common";



@Module({
    imports: [
        PrismaModule,
    ],
    providers: [EventParticipantInternalService],
    controllers: [EventParticipantInternalController],
})

export class EventParticipantInternalModule {}