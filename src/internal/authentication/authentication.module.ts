import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/libs/prisma/prisma.module";
import { AuthInternalController } from "./authentication.controller";
import { AuthInternalService } from "./authentication.service";


@Module({
    imports: [
        PrismaModule
    ],
    controllers: [AuthInternalController],
    providers: [AuthInternalService],
})
export class AuthInternalModule { }