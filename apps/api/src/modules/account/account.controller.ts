import { Body, Controller, HttpCode, Put, Req, Get, Post, Param, UsePipes } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ZodValidationPipe } from "nestjs-zod";
import { UpdateAccountDto } from "./dtos/account.schema";


@Controller('/accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
    ) {}

    @Put('profile-pic')
    @HttpCode(200)
    async updateProfilePic(
        @Body() payload: { photoUrl: string },
        @Req() req: any
    ) {
        return this.accountService.updatePhoto({
            ...payload,
            userId: req.user.userId,
        });
    }

    @Get('profile')
    @HttpCode(200)
    async register(@Req() req: any) {
        return this.accountService.getProfile(req.user.userId);
    }

    @Post('join/event/:id')
    @HttpCode(200)
    async joinEvent(
        @Req() req: any,
        @Param() params: any,
    ) {
        return this.accountService.joinEvent({
            ...req.user,
            id: params.id,
        });
    }

    @Post('check-in/event/:id')
    @HttpCode(200)
    async checkInEvent(
        @Req() req: any,
        @Param() params: any,
    ) {
        return this.accountService.checkInEvent({
            ...req.user,
            id: params.id,
        });
    }

    @Put()
    @UsePipes(new ZodValidationPipe(UpdateAccountDto))
    @HttpCode(200)
    async updateProfile(
        @Body() payload: UpdateAccountDto,
        @Req() req: any
    ) {
        return this.accountService.updateProfile({
            ...payload,
            userId: req.user.userId,
        });
    }
}