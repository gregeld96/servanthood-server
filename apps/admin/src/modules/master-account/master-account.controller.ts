import { Controller, Get, UsePipes, HttpCode, Query, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { MasterAccountService } from "./master-account.service";
import { GetAccountListDTO } from "./dtos/master-account.schema";

@Controller('/master-accounts')
export class MasterAccountController {
    constructor(
        private readonly masterAccountService: MasterAccountService,
    ) {}

    @Get()
    @UsePipes(new ZodValidationPipe(GetAccountListDTO))
    @HttpCode(200)
    async getAllWithoutFilter(
        @Query() query: GetAccountListDTO
    ) {
        return await this.masterAccountService.getAccountsWithoutFilter(query);
    }

    @Post('/filter')
    @UsePipes(new ZodValidationPipe(GetAccountListDTO))
    @HttpCode(200)
    async getAll(
        @Query() query: GetAccountListDTO
    ) {
        return await this.masterAccountService.getAccounts(query);
    }

    @Get(':publicId')
    @HttpCode(200)
    async getDetail(
        @Param() params: any
    ) {
        return await this.masterAccountService.getAccountDetail(params.publicId);
    }

    // @Post()
    // @UsePipes(new ZodValidationPipe(FormEventDTO))
    // @HttpCode(201)
    // async create(
    //     @Body() body: FormEventDTO,
    // ) {
    //     return await this.eventService.create(body);
    // }

    // @Put('participant/:id')
    // @HttpCode(200)
    // async updateAttadanceParticipant(
    //     @Param() params: { id: string }
    // ) {
    //     return await this.eventService.participantCheckIn(Number(params.id));
    // }

    // @Put(':id')
    // @HttpCode(200)
    // async update(
    //     @Body() body: FormEventDTO,
    //     @Param() params: { id: string }
    // ) {
    //     return await this.eventService.update({
    //         ...body,
    //         id: params.id,
    //     });
    // }

    // @Delete(':id')
    // @HttpCode(200)
    // async hardDelete(
    //     @Param() params: { id: string },
    // ) {
    //     return await this.eventService.softDelete(params.id);
    // }
}