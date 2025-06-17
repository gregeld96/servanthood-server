import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { formatToSlug, generatePaginationValue } from "src/shared/libs/general/generate";
import { Prisma } from "@prisma/client";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";
import { FormEventType, GetEventListType } from "./dtos/event.type";
import { v7 } from "uuid";

@Injectable()
export class EventInternalService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getEvents(request: GetEventListType) {
        try {
            const { currentPage, limit, sortBy, name, startTo, startFrom } = request;

            const dateQuery = startFrom && startTo ? {
                gte: startFrom,
                lte: startTo,
            } : startFrom ? {
                gte: startFrom,
            } : startTo ? {
                lte: startTo,
            } : undefined;

            const totalCount = await this.prismaService.event.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    startDate: dateQuery,
                },
            });

            const { take, skip, totalPage } = generatePaginationValue({ limit, currentPage, totalCount });

            const sortOption: Prisma.EventOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.EventOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prismaService.event.findMany({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    startDate: dateQuery,
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
        } catch (error: any) {
            if (error.name === ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR) {
                throw prismaClientError(error)
            } else {
                throw internalServerError(error);
            }
        }
    }

    async getEventDetail(publicId: string) {
        try {
            const detail = await this.prismaService.event.findFirstOrThrow({
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
                case ErrorCategory.ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
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

            const existLocation = await this.prismaService.projectLocation.findFirst({
                where: {
                    id: Number(locationId),
                }
            });

            if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

            const eventExist = await this.prismaService.event.findMany({
                where: {
                    slug: formatToSlug(name),
                }
            });

            const eventSpeakers = await this.prismaService.projectSpeaker.findMany({
                where: {
                    id: {
                        in: speakers,
                    }
                }
            });

            await this.prismaService.$transaction(async (tx: any) => {
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
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
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

            const eventExist = await this.prismaService.event.findFirstOrThrow({
                where: {
                    publicId: id,
                }
            });

            const existLocation = await this.prismaService.projectLocation.findFirst({
                where: {
                    id: Number(locationId),
                }
            });

            if (!existLocation) throw ({ code: 404, message: 'Location is not found!' });

            const eventSlugExist = await this.prismaService.event.findFirst({
                where: {
                    slug: formatToSlug(name),
                }
            });

            if(eventSlugExist && (eventSlugExist?.publicId !== id)) throw ({code: 400, message: 'Event already exist'})

            const eventSpeakers = await this.prismaService.projectSpeaker.findMany({
                where: {
                    id: {
                        in: speakers,
                    }
                }
            });

            await this.prismaService.$transaction(async (tx: any) => {
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
                        name: data.name,
                        photo: data.photo,
                        title: data.title,
                        origin: data.origin,
                        role: category === 'project-day' ? 'pewarta' : 'pembicara',
                    }
                });

                await  tx.eventSpeaker.deleteMany({
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
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async softDelete(id: string) {
        try {
            const exist = await this.prismaService.event.findFirstOrThrow({
                where: {
                    publicId: id,
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