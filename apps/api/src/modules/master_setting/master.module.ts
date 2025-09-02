import { Module } from "@nestjs/common";
import { PrismaModule } from "libs/database";
import { MasterSettingController } from "./master.controller";
import { MasterSettingService } from "./master.service";


@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [MasterSettingController],
    providers: [MasterSettingService],
})
export class MasterSettingModule { }