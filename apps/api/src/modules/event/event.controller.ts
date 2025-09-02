import { Req, Controller, Get, HttpCode, Query, Param, Post } from "@nestjs/common";
import { EventService } from "./event.service";
import { FilterDto } from "libs/common/src/decorators/common.dto";

@Controller('/events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get()
    @HttpCode(200)
    async getList(@Query() filter: FilterDto) {
        return this.eventService.getEventList(filter);
    }

    @Get(':handle')
    @HttpCode(200)
    async getSpecific(@Param() params: any) {
        return this.eventService.getEventSpecific(params.handle);
    }

    @Post('join/:id')
    @HttpCode(200)
    async joinEvent(
        @Req() req: any,
        @Param() params: any,
    ) {
        return this.eventService.joinEvent({
            ...req.user,
            id: params.id,
        });
    }
}