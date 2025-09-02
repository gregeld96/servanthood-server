import { Body, Controller, HttpCode, Put, Req, Get } from "@nestjs/common";
import { AccountService } from "./account.service";


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
}