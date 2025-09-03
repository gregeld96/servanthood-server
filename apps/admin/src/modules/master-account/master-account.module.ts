import { Module } from "@nestjs/common";
import { PrismaModule } from "libs/database";
import { MasterAccountService } from "./master-account.service";
import { MasterAccountController } from "./master-account.controller";


@Module({
    imports: [
        PrismaModule,
    ],
    providers: [MasterAccountService],
    controllers: [MasterAccountController]
})

export class MasterAccountModule {}