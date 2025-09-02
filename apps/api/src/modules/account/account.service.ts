import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async updatePhoto(payload: { photoUrl: string, userId: number }) {
        try {
            const exist = await this.prisma.account.findFirst({
                where: {
                    id: payload.userId,
                }
            });

            if(!exist) throw({ code: 404, message: 'Account not found'});

            await this.prisma.account.update({
                where: {
                    id: exist.id,
                },
                data: {
                    profile: payload.photoUrl,
                }
            });
        } catch(error) {
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

    async getProfile(userId: number) {
        try {
            const exist = await this.prisma.account.findFirst({
                where: {
                    id: userId,
                }
            });

            if(!exist) throw({ code: 404, message: 'Account not found'});

            return exist;
        } catch(error) {
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