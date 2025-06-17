import { Controller, Get, UsePipes, HttpCode, Query, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { GetEventListDTO, FormEventDTO } from "./dtos/event.schema";
import { EventInternalService } from "./event.service";



@Controller('/internal/events')
export class EventInternalController {
    constructor(
        private readonly eventInternalService: EventInternalService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetEventListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetEventListDTO
    ) {
        return await this.eventInternalService.getEvents(query);
    }

    @Get(':publicId')
    @HttpCode(200)
    async getDetail(
        @Param() params: { publicId: string }
    ) {
        return await this.eventInternalService.getEventDetail(params.publicId);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormEventDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormEventDTO,
    ) {
        return await this.eventInternalService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormEventDTO,
        @Param() params: { id: string }
    ) {
        return await this.eventInternalService.update({
            ...body,
            id: params.id,
        });
    }

    @Delete(':id')
    @HttpCode(200)
    async hardDelete(
        @Param() params: { id: string },
    ) {
        return await this.eventInternalService.softDelete(params.id);
    }
}