import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "libs/database";
import { v7 } from "uuid";
import { ErrorName, internalServerError, prismaClientError, prismaNotFound } from "libs/common";
import { buildWhereOption, generatePagination } from "libs/common/src/utils/generate";
import { GetAccountListType } from "./dtos/master-account.type";

@Injectable()
export class MasterAccountService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getAccountsWithoutFilter(request: GetAccountListType) {
        try {
            const { page, limit, sortBy, filter } = request;

            const totalCount = await this.prisma.account.count();

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.AccountOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.AccountOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.account.findMany({
                orderBy: sortOption,
                skip,
                take,
                select: {
                    publicId: true,
                    name: true,
                    nickname: true,
                    phoneNumber: true,
                    email: true,
                    isJSOJ: true,
                    isJoinedWhatsApp: true,
                    isOtherCommunity: true,
                    dob: true,
                    marital: true,
                    gender: true,
                    profile: true,
                    createdAt: true,
                    parishOrigin: true,
                }
            });

            return {
                totalCount,
                totalPage,
                items,
            };
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

    async getAccounts(request: GetAccountListType) {
        try {
            const { page, limit, sortBy, filter } = request;

            const whereOptions = buildWhereOption(filter, false);

            const totalCount = await this.prisma.account.count({
                where: whereOptions,
            });

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.AccountOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.AccountOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.account.findMany({
                where: whereOptions,
                orderBy: sortOption,
                skip,
                take,
                select: {
                    publicId: true,
                    name: true,
                    nickname: true,
                    phoneNumber: true,
                    email: true,
                    isJSOJ: true,
                    isJoinedWhatsApp: true,
                    isOtherCommunity: true,
                    dob: true,
                    marital: true,
                    gender: true,
                    profile: true,
                    createdAt: true,
                    parishOrigin: true,
                }
            });

            return {
                totalCount,
                totalPage,
                items,
            };
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

    async getAccountDetail(publicId: string) {
        try {
            const detail = await this.prisma.account.findFirstOrThrow({
                where: {
                    publicId: publicId,
                },
                select: {
                    publicId: true,
                    name: true,
                    nickname: true,
                    phoneNumber: true,
                    email: true,
                    isJSOJ: true,
                    isJoinedWhatsApp: true,
                    isOtherCommunity: true,
                    dob: true,
                    marital: true,
                    gender: true,
                    profile: true,
                    createdAt: true,
                    parishOrigin: true,
                    socialMedias: {
                        select: {
                            type: true,
                            link: true,
                            username: true,
                        }
                    }
                }
            });

            return {
                detail,
            };
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

    // async create(req: FormEventType) {
    //     try {
    //         const {
    //             name,
    //             description,
    //             category,
    //             horizontalBanner,
    //             verticalBanner,
    //             locationId,
    //             startDate,
    //             endDate,
    //             startTime,
    //             endTime,
    //             openRegis,
    //             closeRegis,
    //             isInternal,
    //             maxParticipant,
    //             speakers,
    //         } = req;

    //         const existLocation = await this.prisma.location.findFirst({
    //             where: {
    //                 id: Number(locationId),
    //             }
    //         });

    //         if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

    //         const eventExist = await this.prisma.event.findMany({
    //             where: {
    //                 slug: formatToSlug(name),
    //             }
    //         });

    //         const eventSpeakers = await this.prisma.eventSpeaker.findMany({
    //             where: {
    //                 id: {
    //                     in: speakers,
    //                 }
    //             }
    //         });

    //         await this.prisma.$transaction(async (tx: any) => {
    //             const res = await tx.event.create({
    //                 data: {
    //                     publicId: v7(),
    //                     name,
    //                     slug: eventExist.length > 0 ? `${formatToSlug(name)}-${eventExist.length + 1}` : formatToSlug(name),
    //                     description,
    //                     category,
    //                     horizontalBanner,
    //                     verticalBanner,
    //                     locationId,
    //                     locationName: existLocation.name,
    //                     locationAddress: existLocation.address,
    //                     startDate,
    //                     endDate,
    //                     startTime,
    //                     endTime,
    //                     openRegis,
    //                     closeRegis,
    //                     isInternal,
    //                     maxParticipant: Number(maxParticipant),
    //                 },
    //                 select: {
    //                     id: true,
    //                 }
    //             });

    //             const mappedSpeaker = eventSpeakers.map((data: any) => {
    //                 return {
    //                     eventId: res.id,
    //                     speakerId: data.id,
    //                     name: data.name,
    //                     photo: data.photo,
    //                     title: data.title,
    //                     origin: data.origin,
    //                     role: category === 'project-day' ? 'pewarta' : 'pembicara',
    //                 }
    //             });

    //             await tx.eventSpeaker.createMany({
    //                 data: mappedSpeaker,
    //             });
    //         }, {
    //             maxWait: 100000,
    //             timeout: 100000,
    //         });
    //     } catch (error: any) {
    //         switch (error.name) {
    //             case ErrorName.PRISMA_NOT_FOUND:
    //                 throw prismaNotFound();
    //             case ErrorName.PRISMA_CLIENT_ERROR:
    //                 throw prismaClientError(error);
    //             default:
    //                 throw internalServerError(error);
    //         }
    //     }
    // }

    // async update(req: FormEventType & { id: string }) {
    //     try {
    //         const {
    //             name,
    //             description,
    //             category,
    //             horizontalBanner,
    //             verticalBanner,
    //             locationId,
    //             startDate,
    //             endDate,
    //             startTime,
    //             endTime,
    //             openRegis,
    //             closeRegis,
    //             isInternal,
    //             maxParticipant,
    //             speakers,
    //             id,
    //         } = req;

    //         const eventExist = await this.prisma.event.findFirstOrThrow({
    //             where: {
    //                 publicId: id,
    //             }
    //         });

    //         const existLocation = await this.prisma.location.findFirst({
    //             where: {
    //                 id: Number(locationId),
    //             }
    //         });

    //         if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

    //         const eventSlugExist = await this.prisma.event.findFirst({
    //             where: {
    //                 slug: formatToSlug(name),
    //             }
    //         });

    //         if (eventSlugExist && (eventSlugExist?.publicId !== id)) throw ({ code: 400, message: 'Event already exist' })

    //         const eventSpeakers = await this.prisma.eventSpeaker.findMany({
    //             where: {
    //                 id: {
    //                     in: speakers,
    //                 }
    //             }
    //         });

    //         await this.prisma.$transaction(async (tx: any) => {
    //             const res = await tx.event.update({
    //                 where: {
    //                     id: eventExist.id
    //                 },
    //                 data: {
    //                     name,
    //                     slug: formatToSlug(name),
    //                     description,
    //                     category,
    //                     horizontalBanner,
    //                     verticalBanner,
    //                     locationId,
    //                     locationName: existLocation.name,
    //                     locationAddress: existLocation.address,
    //                     startDate,
    //                     endDate,
    //                     startTime,
    //                     endTime,
    //                     openRegis,
    //                     closeRegis,
    //                     isInternal,
    //                     maxParticipant: Number(maxParticipant),
    //                 },
    //                 select: {
    //                     id: true,
    //                 }
    //             });

    //             const mappedSpeaker = eventSpeakers.map((data: any) => {
    //                 return {
    //                     eventId: res.id,
    //                     speakerId: data.id,
    //                     name: data.name,
    //                     photo: data.photo,
    //                     title: data.title,
    //                     origin: data.origin,
    //                     role: category === 'project-day' ? 'pewarta' : 'pembicara',
    //                 }
    //             });

    //             await tx.eventSpeaker.deleteMany({
    //                 where: {
    //                     eventId: eventExist.id
    //                 }
    //             });

    //             await tx.eventSpeaker.createMany({
    //                 data: mappedSpeaker,
    //             });
    //         }, {
    //             maxWait: 100000,
    //             timeout: 100000,
    //         });
    //     } catch (error: any) {
    //         switch (error.name) {
    //             case ErrorName.PRISMA_NOT_FOUND:
    //                 throw prismaNotFound();
    //             case ErrorName.PRISMA_CLIENT_ERROR:
    //                 throw prismaClientError(error);
    //             default:
    //                 throw internalServerError(error);
    //         }
    //     }
    // }

    // async softDelete(id: string) {
    //     try {
    //         const exist = await this.prisma.event.findFirstOrThrow({
    //             where: {
    //                 publicId: id,
    //             }
    //         });

    //         await this.prisma.event.update({
    //             where: {
    //                 id: exist.id,
    //             },
    //             data: {
    //                 deletedAt: new Date(),
    //             }
    //         });
    //     } catch (error: any) {
    //         switch (error.name) {
    //             case ErrorName.PRISMA_NOT_FOUND:
    //                 throw prismaNotFound();
    //             case ErrorName.PRISMA_CLIENT_ERROR:
    //                 throw prismaClientError(error);
    //             default:
    //                 throw internalServerError(error);
    //         }
    //     }
    // }
}