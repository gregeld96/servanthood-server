import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes } from "@nestjs/common";
import { SpeakerInternalService } from "./speaker.service";
import { ZodValidationPipe } from "nestjs-zod";
import { GetSpeakerListDTO, FormSpeakerDTO } from "./dtos/speaker.schema";



@Controller('/internal/speakers')
export class SpeakerInternalController {
    constructor(
        private readonly speakerInternalService: SpeakerInternalService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetSpeakerListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetSpeakerListDTO
    ) {
        return await this.speakerInternalService.getSpeakers(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormSpeakerDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormSpeakerDTO,
    ) {
        return await this.speakerInternalService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormSpeakerDTO,
        @Param() params: { id: string },
    ) {
        return await this.speakerInternalService.update({
            ...body,
            id: Number(params.id),
        });
    }

    @Delete('/soft/:id')
    @HttpCode(200)
    async softDelete(
        @Param() params: { id: string },
    ) {
        return await this.speakerInternalService.softDelete(Number(params.id));
    }

}