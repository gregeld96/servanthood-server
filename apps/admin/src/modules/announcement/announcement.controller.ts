import { Body, Controller, HttpCode, Post, Get, Delete, Put, Param, UsePipes, Query } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { ZodValidationPipe } from "nestjs-zod";
import { FormProjectAnnouncementDTO, GetProjectAnnouncementListDTO } from "./dtos/announcement.schema";

@Controller('/announcements')
export class AnnouncementController {
    constructor(
        private readonly announcementService: AnnouncementService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetProjectAnnouncementListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetProjectAnnouncementListDTO
    ) {
        return await this.announcementService.getAnnouncements(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormProjectAnnouncementDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormProjectAnnouncementDTO,
    ) {
        return await this.announcementService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormProjectAnnouncementDTO,
        @Param() params: { id: string }
    ) {
        return await this.announcementService.update({
            ...body,
            id: params.id,
        });
    }

    @Delete(':id')
    @HttpCode(200)
    async hardDelete(
        @Param() params: { id: string },
    ) {
        return await this.announcementService.delete(params.id);
    }
}