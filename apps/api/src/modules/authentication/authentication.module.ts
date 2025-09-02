import { Module } from "@nestjs/common";
import { PrismaModule } from "libs/database";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";


@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService],
})
export class AuthenticationModule { }