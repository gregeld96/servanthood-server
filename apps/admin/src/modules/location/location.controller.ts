import { Body, Controller, HttpCode, Post, Get, Delete, Put, Param, UsePipes, Query } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { LocationService } from "./location.service";
import { FormLocationDTO, GetLocationListDTO } from "./dtos/location.schema";

@Controller('/locations')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetLocationListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetLocationListDTO
    ) {
        return await this.locationService.getLocations(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormLocationDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormLocationDTO,
    ) {
        return await this.locationService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormLocationDTO,
        @Param() params: { id: string },
    ) {
        return await this.locationService.update({
            ...body,
            id: Number(params.id),
        });
    }

    @Delete('/soft/:id')
    @HttpCode(200)
    async softDelete(
        @Param() params: { id: string },
    ) {
        return await this.locationService.softDelete(Number(params.id));
    }
}
