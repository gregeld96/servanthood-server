import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { PrismaModule, PrismaService } from "libs/database";
import { JwtAuthMiddleware, JwtAuthOptions } from "libs/common";
import { CommonModule } from "libs/common/src/common.module";
import { MasterSettingModule } from "./modules/master_setting/master.module";
import { EventModule } from "./modules/event/event.module";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { AccountModule } from "./modules/account/account.module";
import { AccountController } from "./modules/account/account.controller";
import { MediaFileController } from "libs/common/src/upload/mediafile.controller";
import { MediaFileModule } from "libs/common/src/upload/mediafile.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_PUBLIC,
        }),
        CommonModule,
        PrismaModule,
        MasterSettingModule,
        EventModule,
        AuthenticationModule,
        AccountModule,
        MediaFileModule,
    ],
    providers: [
        PrismaService,
        JwtService,
        {
            provide: "PUBLIC_JWT_OPTIONS",
            useValue: {
                secret: process.env.JWT_SECRET_PUBLIC,
                attachProperty: "public",
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
                        secret: process.env.JWT_SECRET_PUBLIC || '',
                        attachProperty: "public",
                    }
                ).use(req, res, next),
            )
            .forRoutes(
                AccountController,
                MediaFileController,
            );
    }
}