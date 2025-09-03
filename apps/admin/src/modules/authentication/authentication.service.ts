import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CredentialsDto } from "./dtos/authentication.schema";
import { PrismaService } from "libs/database";
import { checkPassword, ErrorName, internalServerError, prismaClientError, prismaNotFound } from "libs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async login (request: CredentialsDto) {
        try {
            const exist = await this.prisma.account.findFirst({
                where: {
                    email: request.email,
                    isInternal: true,
                },
                select: {
                    publicId: true,
                    email: true,
                    name: true,
                    password: true,
                    role: {
                        select: {
                            name: true,
                            permissions: true,
                        }
                    }
                }
            });
    
            if(!exist) throw({
                code: 400,
                message: 'Email / Password incorrect!'
            });
    
            if(!checkPassword(request.password, exist.password)) throw({
                code: 400,
                message: 'Email / Password incorrect!'
            });
    
            const token =  await this.jwtService.signAsync({
                id: exist.publicId,
                name: exist.name,
                email: exist.email,
                role: exist.role,
                permissions: exist.role.permissions,
            });
    
            return {
                token,
                user: {
                    name: exist.name,
                    email: exist.email,
                    roleName: exist.role.name,
                }
            }
        } catch (error: any) {
            switch (error.name) {
                case ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }
}