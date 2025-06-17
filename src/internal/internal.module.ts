import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { AuthInternalModule } from "./authentication/authentication.module";
import { InternalApiTokenCheck } from "src/middlewares/internal_authentication";
import { AnnouncementInternalModule } from "./announcement/announcement.module";
import { MediaFileInternalModule } from "./media_file/mediafile.module";
import { LocationInternalModule } from "./location/location.module";
import { SpeakerInternalModule } from "./speaker/speaker.module";
import { EventInternalModule } from "./event/event.module";
import { EventParticipantInternalModule } from "./event/participant/participant.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_INTERNAL,
        }),
        PrismaModule,
        AuthInternalModule,
        AnnouncementInternalModule,
        MediaFileInternalModule,
        LocationInternalModule,
        SpeakerInternalModule,
        EventInternalModule,
        EventParticipantInternalModule,
    ]
})

export class InternalModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(InternalApiTokenCheck)
            .exclude(
                {
                    path: '/internal/auths/login', method: RequestMethod.POST
                },
            )
    }
}