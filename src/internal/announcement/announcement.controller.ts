import { Body, Controller, HttpCode, Post, Get, Delete, Put, Param, UsePipes, Query } from "@nestjs/common";
import { AnnouncementInternalService } from "./announcement.service";
import { ZodValidationPipe } from "nestjs-zod";
import { FormProjectAnnouncementDTO, GetProjectAnnouncementListDTO } from "./dtos/announcement.schema";



@Controller('/internal/announcements')
export class AnnouncementInternalController {
    constructor(
        private readonly announcementInternalService: AnnouncementInternalService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetProjectAnnouncementListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetProjectAnnouncementListDTO
    ) {
        return await this.announcementInternalService.getAnnouncements(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormProjectAnnouncementDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormProjectAnnouncementDTO,
    ) {
        return await this.announcementInternalService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormProjectAnnouncementDTO,
        @Param() params: { id: string }
    ) {
        return await this.announcementInternalService.update({
            ...body,
            id: params.id,
        });
    }

    @Delete(':id')
    @HttpCode(200)
    async hardDelete(
        @Param() params: { id: string },
    ) {
        return await this.announcementInternalService.delete(params.id);
    }
}