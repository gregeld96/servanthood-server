import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";
import { FormEventParticipantType, GetListParticipantFilterType } from "./dtos/participant.type";
import { generatePaginationValue } from "src/shared/libs/general/generate";
@Injectable()
export class EventParticipantInternalService {
    constructor(
        private prismaService: PrismaService,
    ) {}

    async getListParticipantEvent(req: GetListParticipantFilterType & { eventId: string}) {
        const { eventId, name, currentPage, limit, sortBy, } = req;

        try {
            const exist = await this.prismaService.event.findFirstOrThrow({
                where: {
                    publicId: eventId,
                }
            });

            const totalCount = await this.prismaService.eventFormRegister.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    eventId: exist.id,
                },
            });

            const { take, skip, totalPage } = generatePaginationValue({ limit, currentPage, totalCount });

            const sortOption: Prisma.EventFormRegisterOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.EventFormRegisterOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prismaService.eventFormRegister.findMany({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    eventId: exist.id,
                },
                orderBy: sortOption,
                skip,
                take,
            });

            return {
                totalCount,
                totalPage,
                items,
            };
        } catch(error: any) {
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

    async create(req: FormEventParticipantType) {
        const { eventId, participantName, participantDob, participantGender, participantParishOrigin, memberId } = req;

        try {
            const existEvent = await this.prismaService.event.findFirstOrThrow({
                where: {
                    publicId: eventId,
                }
            });

            let existAccount: any = null;

            if(memberId) {
                existAccount = await this.prismaService.account.findFirstOrThrow({
                    where: {
                        publicId: memberId,
                    }
                });

                const alreadyJoined = await this.prismaService.eventFormRegister.findFirst({
                    where: {
                        memberId: existAccount.id,
                    }
                });

                if(alreadyJoined) throw({ code: 400, message: 'User already register'})
            }

            await this.prismaService.eventFormRegister.create({
                data: {
                    memberId: existAccount?.id,
                    eventId: existEvent.id,
                    participantName: existAccount ? existAccount.name : participantName,
                    participantDob: existAccount ? existAccount?.dob : participantDob || null,
                    participantGender: existAccount ? existAccount?.gender : participantGender || null,
                    participantParishOrigin: existAccount ? existAccount.parishOrigin : participantParishOrigin || null,
                }
            });
        } catch(error: any) {
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

    async updateStatus(id: number) {
        try {
            const exist = await this.prismaService.eventFormRegister.findFirstOrThrow({
                where: {
                    id: id,
                }
            });

            await this.prismaService.eventFormRegister.update({
                where: {
                    id: exist.id,
                },
                data: {
                    attendance: new Date(),
                }
            });
        } catch(error: any) {
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

    async delete(id: number) {
        try {
            const exist = await this.prismaService.eventFormRegister.findFirstOrThrow({
                where: {
                    id: id,
                }
            });

            await this.prismaService.event.update({
                where: {
                    id: exist.id,
                },
                data: {
                    deletedAt: new Date(),
                }
            });
        } catch(error: any) {
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