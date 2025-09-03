import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "libs/database";
import { v7 } from "uuid";
import { FormEventType, GetEventListType, GetEventParticipantType } from "./dtos/event.type";
import { ErrorName, internalServerError, prismaClientError, prismaNotFound } from "libs/common";
import { formatToSlug, generatePagination } from "libs/common/src/utils/generate";

@Injectable()
export class EventService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getEvents(request: GetEventListType) {
        try {
            const { page, limit, sortBy, name, startTo, startFrom } = request;

            const dateQuery = startFrom && startTo ? {
                gte: startFrom,
                lte: startTo,
            } : startFrom ? {
                gte: startFrom,
            } : startTo ? {
                lte: startTo,
            } : undefined;

            const totalCount = await this.prisma.event.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    startDate: dateQuery,
                },
            });

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.EventOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.EventOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.event.findMany({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    startDate: dateQuery,
                },
                orderBy: sortOption,
                skip,
                take,
                include: {
                    participant: true,
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

    async getEventDetail(publicId: string) {
        try {
            const detail = await this.prisma.event.findFirstOrThrow({
                where: {
                    publicId: publicId,
                },
                include: {
                    speakers: true,
                    pics: true,
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

    async getEventParticipant(payload: GetEventParticipantType) {
        try {
            const detail = await this.prisma.event.findFirstOrThrow({
                where: {
                    publicId: payload.publicId,
                },
                select: {
                    id: true,
                    publicId: true,
                    name: true,
                    category: true,
                    startDate: true,
                    endDate: true,
                    startTime: true,
                    endTime: true,
                    maxParticipant: true,
                    locationName: true,
                    locationAddress: true,
                }
            });

            let whereOption: Prisma.EventFormRegisterWhereInput = {
                eventId: detail.id,
            }

            if(payload.keyword) {
                whereOption = {
                    ...whereOption,
                    OR: [
                        payload.keyword
                            ? { participantName: { contains: payload.keyword, mode: 'insensitive' } }
                            : { },
                        payload.keyword
                            ? { member: { phoneNumber: { contains: payload.keyword, mode: 'insensitive' } } }
                            : { },
                    ],
                }
            }

            const totalCount = await this.prisma.eventFormRegister.count({
                where: whereOption,
            });

            const { take, skip, totalPage } = generatePagination(payload.page, payload.limit, totalCount);

            const sortOption: Prisma.EventFormRegisterOrderByWithRelationInput = {}

            if (payload.sortBy) {
                const sort = payload.sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (payload.sortBy.startsWith('-') ? payload.sortBy.substring(1) : payload.sortBy) as keyof Prisma.EventFormRegisterOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const participant = await this.prisma.eventFormRegister.findMany({
                where: whereOption,
                select: {
                    id: true,
                    participantName: true,
                    participantDob: true,
                    participantGender: true,
                    participantParishOrigin: true,
                    attendance: true,
                    createdAt: true,
                    member: {
                        select: {
                            id: true,
                            publicId: true,
                            phoneNumber: true,
                            email: true,
                            isJoinedWhatsApp: true,
                            isJSOJ: true,
                        }
                    }
                },
                orderBy: sortOption,
                skip,
                take,
            });

            return {
                event: detail,
                participant,
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

    async participantCheckIn(id: number) {
        try {
            const exist = await this.prisma.eventFormRegister.findFirstOrThrow({
                where: {
                    id,
                }
            });

            await this.prisma.eventFormRegister.update({
                where: {
                    id: exist.id,
                },
                data: {
                    attendance: new Date(),
                    updatedAt: new Date(),
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

    async create(req: FormEventType) {
        try {
            const {
                name,
                description,
                category,
                horizontalBanner,
                verticalBanner,
                locationId,
                startDate,
                endDate,
                startTime,
                endTime,
                openRegis,
                closeRegis,
                isInternal,
                maxParticipant,
                speakers,
            } = req;

            const existLocation = await this.prisma.location.findFirst({
                where: {
                    id: Number(locationId),
                }
            });

            if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

            const eventExist = await this.prisma.event.findMany({
                where: {
                    slug: formatToSlug(name),
                }
            });

            const eventSpeakers = await this.prisma.eventSpeaker.findMany({
                where: {
                    id: {
                        in: speakers,
                    }
                }
            });

            await this.prisma.$transaction(async (tx: any) => {
                const res = await tx.event.create({
                    data: {
                        publicId: v7(),
                        name,
                        slug: eventExist.length > 0 ? `${formatToSlug(name)}-${eventExist.length + 1}` : formatToSlug(name),
                        description,
                        category,
                        horizontalBanner,
                        verticalBanner,
                        locationId,
                        locationName: existLocation.name,
                        locationAddress: existLocation.address,
                        startDate,
                        endDate,
                        startTime,
                        endTime,
                        openRegis,
                        closeRegis,
                        isInternal,
                        maxParticipant: Number(maxParticipant),
                    },
                    select: {
                        id: true,
                    }
                });

                const mappedSpeaker = eventSpeakers.map((data: any) => {
                    return {
                        eventId: res.id,
                        speakerId: data.id,
                        name: data.name,
                        photo: data.photo,
                        title: data.title,
                        origin: data.origin,
                        role: category === 'project-day' ? 'pewarta' : 'pembicara',
                    }
                });

                await tx.eventSpeaker.createMany({
                    data: mappedSpeaker,
                });
            }, {
                maxWait: 100000,
                timeout: 100000,
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

    async update(req: FormEventType & { id: string }) {
        try {
            const {
                name,
                description,
                category,
                horizontalBanner,
                verticalBanner,
                locationId,
                startDate,
                endDate,
                startTime,
                endTime,
                openRegis,
                closeRegis,
                isInternal,
                maxParticipant,
                speakers,
                id,
            } = req;

            const eventExist = await this.prisma.event.findFirstOrThrow({
                where: {
                    publicId: id,
                }
            });

            const existLocation = await this.prisma.location.findFirst({
                where: {
                    id: Number(locationId),
                }
            });

            if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

            const eventSlugExist = await this.prisma.event.findFirst({
                where: {
                    slug: formatToSlug(name),
                }
            });

            if (eventSlugExist && (eventSlugExist?.publicId !== id)) throw ({ code: 400, message: 'Event already exist' })

            const eventSpeakers = await this.prisma.eventSpeaker.findMany({
                where: {
                    id: {
                        in: speakers,
                    }
                }
            });

            await this.prisma.$transaction(async (tx: any) => {
                const res = await tx.event.update({
                    where: {
                        id: eventExist.id
                    },
                    data: {
                        name,
                        slug: formatToSlug(name),
                        description,
                        category,
                        horizontalBanner,
                        verticalBanner,
                        locationId,
                        locationName: existLocation.name,
                        locationAddress: existLocation.address,
                        startDate,
                        endDate,
                        startTime,
                        endTime,
                        openRegis,
                        closeRegis,
                        isInternal,
                        maxParticipant: Number(maxParticipant),
                    },
                    select: {
                        id: true,
                    }
                });

                const mappedSpeaker = eventSpeakers.map((data: any) => {
                    return {
                        eventId: res.id,
                        speakerId: data.id,
                        name: data.name,
                        photo: data.photo,
                        title: data.title,
                        origin: data.origin,
                        role: category === 'project-day' ? 'pewarta' : 'pembicara',
                    }
                });

                await tx.eventSpeaker.deleteMany({
                    where: {
                        eventId: eventExist.id
                    }
                });

                await tx.eventSpeaker.createMany({
                    data: mappedSpeaker,
                });
            }, {
                maxWait: 100000,
                timeout: 100000,
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

    async softDelete(id: string) {
        try {
            const exist = await this.prisma.event.findFirstOrThrow({
                where: {
                    publicId: id,
                }
            });

            await this.prisma.event.update({
                where: {
                    id: exist.id,
                },
                data: {
                    deletedAt: new Date(),
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