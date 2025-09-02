import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthenticationService } from "./authentication.service";
import { CredentialDto, CreateAccountDto } from "./authentication.dto";


@Controller('/auths')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post('login')
    @UsePipes(new ZodValidationPipe(CredentialDto))
    @HttpCode(200)
    async login(@Body() payload: CredentialDto) {
        return this.authenticationService.login(payload);
    }

    @Post('register')
    @UsePipes(new ZodValidationPipe(CreateAccountDto))
    @HttpCode(201)
    async register(@Body() payload: CreateAccountDto) {
        return this.authenticationService.register(payload);
    }
}