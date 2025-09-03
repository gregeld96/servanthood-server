import { Controller, Get, UsePipes, HttpCode, Query, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { GetEventListDTO, FormEventDTO, GetEventParticipantDTO } from "./dtos/event.schema";
import { EventService } from "./event.service";

@Controller('/events')
export class EventController {
    constructor(
        private readonly eventService: EventService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetEventListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetEventListDTO
    ) {
        return await this.eventService.getEvents(query);
    }

    @Get('participant/:publicId')
    @UsePipes(new ZodValidationPipe(GetEventParticipantDTO))
    @HttpCode(200)
    async getParticipantDetail(
        @Query() query: GetEventParticipantDTO,
        @Param() params: { publicId: string }
    ) {
        return await this.eventService.getEventParticipant({ ...query, publicId: params.publicId });
    }

    @Get(':publicId')
    @HttpCode(200)
    async getDetail(
        @Param() params: { publicId: string }
    ) {
        return await this.eventService.getEventDetail(params.publicId);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormEventDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormEventDTO,
    ) {
        return await this.eventService.create(body);
    }

    @Put('participant/:id')
    @HttpCode(200)
    async updateAttadanceParticipant(
        @Param() params: { id: string }
    ) {
        return await this.eventService.participantCheckIn(Number(params.id));
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormEventDTO,
        @Param() params: { id: string }
    ) {
        return await this.eventService.update({
            ...body,
            id: params.id,
        });
    }

    @Delete(':id')
    @HttpCode(200)
    async hardDelete(
        @Param() params: { id: string },
    ) {
        return await this.eventService.softDelete(params.id);
    }
}