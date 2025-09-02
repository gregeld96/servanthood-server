import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { MasterFetchDto } from "./master.dto";
import { MasterSettingService } from "./master.service";


@Controller('/masters')
export class MasterSettingController {
    constructor(private readonly masterSettingService: MasterSettingService) {}

    @Get()
    @HttpCode(200)
    async getList(@Query() filter: MasterFetchDto) {
        return this.masterSettingService.getMasterSpecificList(filter);
    }

    @Get('detail')
    @HttpCode(200)
    async getSpecific(@Query() filter: MasterFetchDto) {
        return this.masterSettingService.getMasterSpecific(filter);
    }
}