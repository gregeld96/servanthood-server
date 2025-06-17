import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { CredentialsDto } from "./dtos/authentication.schema";
import { checkPassword } from "src/shared/libs/bcryptjs";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";

@Injectable()
export class AuthInternalService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
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
                status: 400,
                message: 'Email / Password incorrect!'
            });
    
            if(!checkPassword(request.password, exist.password)) throw({
                status: 400,
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
                case ErrorCategory.ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }
}