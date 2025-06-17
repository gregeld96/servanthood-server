import { Body, Controller, HttpCode, Post, Get, Delete, Put, Param, UsePipes, Query } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { LocationInternalService } from "./location.service";
import { FormLocationDTO, GetLocationListDTO } from "./dtos/location.schema";

@Controller('/internal/locations')
export class LocationInternalController {
    constructor(
        private readonly locationInternalService: LocationInternalService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetLocationListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetLocationListDTO
    ) {
        return await this.locationInternalService.getLocations(query);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(FormLocationDTO))
    @HttpCode(201)
    async create(
        @Body() body: FormLocationDTO,
    ) {
        return await this.locationInternalService.create(body);
    }

    @Put(':id')
    @HttpCode(200)
    async update(
        @Body() body: FormLocationDTO,
        @Param() params: { id: string },
    ) {
        return await this.locationInternalService.update({
            ...body,
            id: Number(params.id),
        });
    }

    @Delete('/soft/:id')
    @HttpCode(200)
    async softDelete(
        @Param() params: { id: string },
    ) {
        return await this.locationInternalService.softDelete(Number(params.id));
    }
}
