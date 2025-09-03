import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";
import { UserEvent } from "./account.dto";

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

    async joinEvent(payload: UserEvent & { id: string }) {
        try {
            const event = await this.prisma.event.findFirstOrThrow({
                where: {
                    publicId: payload.id
                }
            });

            const existingRegistration = await this.prisma.eventFormRegister.findFirst({
                where: {
                    memberId: payload.userId,
                    eventId: event.id
                }
            });

            if(existingRegistration) throw({ code: 400, message: 'User already joined'});

            await this.prisma.eventFormRegister.create({
                data: {
                    memberId: payload.userId,
                    eventId: event.id,
                    participantName: payload.name,
                    participantDob: payload.dob,
                    participantGender: payload.gender,
                    participantParishOrigin: payload.parishOrigin,
                }
            });
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