import { Module } from "@nestjs/common";
import { PrismaModule } from "libs/database";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";


@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule { }