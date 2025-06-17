import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { AuthInternalService } from "./authentication.service";
import { ZodValidationPipe } from "nestjs-zod";
import { CredentialsDto } from "./dtos/authentication.schema";


@Controller('/internal/auths')
export class AuthInternalController {
    constructor(
        private readonly authInternalService: AuthInternalService
    ) {}

    @Post('login')
    @UsePipes(new ZodValidationPipe(CredentialsDto))
    @HttpCode(200)
    async login(
        @Body() body: CredentialsDto,
    ) {
        return await this.authInternalService.login(body);
    }
}