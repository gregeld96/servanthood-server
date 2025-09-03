import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { PrismaModule, PrismaService } from "libs/database";
import { JwtAuthMiddleware, JwtAuthOptions } from "libs/common";
import { CommonModule } from "libs/common/src/common.module";
import { MediaFileController } from "libs/common/src/upload/mediafile.controller";
import { MediaFileModule } from "libs/common/src/upload/mediafile.module";
import { AnnouncementController } from "./modules/announcement/announcement.controller";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { EventController } from "./modules/event/event.controller";
import { EventModule } from "./modules/event/event.module";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { LocationController } from "./modules/location/location.controller";
import { SpeakerController } from "./modules/speaker/speaker.controller";
import { SpeakerModule } from "./modules/speaker/speaker.module";
import { LocationModule } from "./modules/location/location.module";
import { MasterAccountModule } from "./modules/master-account/master-account.module";
import { MasterAccountController } from "./modules/master-account/master-account.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_INTERNAL,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', // default = root (process.cwd())
        }),
        AuthenticationModule,
        CommonModule,
        PrismaModule,
        AnnouncementModule,
        MediaFileModule,
        EventModule,
        SpeakerModule,
        LocationModule,
        MasterAccountModule,
    ],
    providers: [
        PrismaService,
        JwtService,
        {
            provide: "INTERNAL_JWT_OPTIONS",
            useValue: {
                secret: process.env.JWT_SECRET_INTERNAL,
                attachProperty: "internal",
            } as JwtAuthOptions,
        },
    ],
})

export class AppModule implements NestModule {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply((req: Request, res: Response, next: NextFunction) =>
                new JwtAuthMiddleware(
                    this.prisma,
                    this.jwtService,
                    {
                        secret: process.env.JWT_SECRET_INTERNAL || '',
                        attachProperty: "internal",
                    }
                ).use(req, res, next),
            )
            .exclude({
                path: '/auths/login',
                method: RequestMethod.POST
            })
            .forRoutes(
                AnnouncementController,
                MediaFileController,
                EventController,
                LocationController,
                SpeakerController,
                MasterAccountController,
            )
    }
}