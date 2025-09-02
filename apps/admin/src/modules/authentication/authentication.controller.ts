import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ZodValidationPipe } from "nestjs-zod";
import { CredentialsDto } from "./dtos/authentication.schema";


@Controller('auths')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {}

    @Post('login')
    @UsePipes(new ZodValidationPipe(CredentialsDto))
    @HttpCode(200)
    async login(
        @Body() body: CredentialsDto,
    ) {
        return await this.authenticationService.login(body);
    }
}