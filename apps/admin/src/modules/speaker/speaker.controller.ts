import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { SpeakerService } from "./speaker.service";
import { ZodValidationPipe } from "nestjs-zod";
import { GetSpeakerListDTO, FormSpeakerDTO } from "./dtos/speaker.schema";


@Controller('/speakers')
export class SpeakerController {
    constructor(
        private readonly speakerService: SpeakerService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetSpeakerListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetSpeakerListDTO
    ) {
        return await this.speakerService.getSpeakers(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormSpeakerDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormSpeakerDTO,
    ) {
        return await this.speakerService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormSpeakerDTO,
        @Param() params: { id: string },
    ) {
        return await this.speakerService.update({
            ...body,
            id: Number(params.id),
        });
    }

    @Delete('/soft/:id')
    @HttpCode(200)
    async softDelete(
        @Param() params: { id: string },
    ) {
        return await this.speakerService.softDelete(Number(params.id));
    }

}