import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";
import { FilterDto } from "libs/common/src/decorators/common.dto";
import { generatePagination } from "libs/common/src/utils/generate";
import { UserEvent } from "./event.dto";


@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}

    async getEventList(filter: FilterDto){
        try {
            const whereClause: any = {};

            if (filter.keyword) {
                whereClause.OR = [
                    {
                        name: {
                            contains: filter.keyword,
                            mode: 'insensitive',
                        },
                    },
                    {
                        slug: {
                            contains: filter.keyword,
                            mode: 'insensitive',
                        },
                    },
                ];
            }

            const total = await this.prisma.event.count({
                where: whereClause,
            });

            const { take, skip, totalPage } = generatePagination(filter.page, filter.limit, total);

            const res = await this.prisma.event.findMany({
                where: whereClause,
                skip: skip,
                take: take,
                orderBy: {
                    startDate: 'desc',
                },
            });

            return {
                data: res,
                meta: {
                    total,
                    page: filter.page ? Number(filter.page) : 1,
                    limit: take,
                    totalPage: totalPage,
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

    async getSeoEventSpecific(slug: string){
        try {
            const data = await this.prisma.event.findFirstOrThrow({
                where: {
                    slug,
                },
                select: {
                    name: true,
                    slug: true,
                    description: true,
                }
            });
    
            return {
                data,
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

    async getEventSpecific(slug: string){
        try {
            const data = await this.prisma.event.findFirstOrThrow({
                where: {
                    slug,
                },
                select: {
                    publicId: true,
                    name: true,
                    slug: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                    location: true,
                    category: true,
                    horizontalBanner: true,
                    startTime: true,
                    endTime: true,
                    createdAt: true,
                    updatedAt: true,
                    speakers: {
                        select: {
                            name: true,
                            photo: true,
                        }
                    }
                }
            });
    
            return {
                data,
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