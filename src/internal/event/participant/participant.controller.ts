import { Controller, Get, UsePipes, HttpCode, Query, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { GetParticipantListDTO, FormEventParticipantDTO } from "./dtos/participant.schema";
import { EventParticipantInternalService } from "./participant.service";

@Controller('/internal/events/participants')
export class EventParticipantInternalController {
    constructor(
        private readonly participantService: EventParticipantInternalService
    ) {}

    @Get(':eventId')
    @UsePipes(new ZodValidationPipe(GetParticipantListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetParticipantListDTO,
        @Param() params: { eventId: string }
    ) {
        return await this.participantService.getListParticipantEvent({
            ...query,
            eventId: params.eventId
        });
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormEventParticipantDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormEventParticipantDTO,
    ) {
        return await this.participantService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async updateStatus(
        @Param() params: { id: string }
    ) {
        return await this.participantService.updateStatus(Number(params.id));
    }

    @Delete(':id')
    @HttpCode(200)
    async hardDelete(
        @Param() params: { id: string },
    ) {
        return await this.participantService.delete(Number(params.id));
    }
}