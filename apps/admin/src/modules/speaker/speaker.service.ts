import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FormSpeakerType, GetSpeakerListType } from "./dtos/speaker.type";
import { PrismaService } from "libs/database";
import { generatePagination } from "libs/common/src/utils/generate";
import { ErrorName, internalServerError, prismaClientError, prismaNotFound } from "libs/common";

@Injectable()
export class SpeakerService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getSpeakers(request: GetSpeakerListType) {
        try {
            const { page, limit, sortBy, name } = request;

            const totalCount = await this.prisma.speaker.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.SpeakerOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.SpeakerOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.speaker.findMany({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
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

    async create(req: FormSpeakerType) {
        try {
            const { name, description, photo, title, origin } = req;

            const res = await this.prisma.speaker.create({
                data: {
                    name, 
                    description, 
                    photo, 
                    title, 
                    origin,
                }
            });

            return res;
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

    async update(req: FormSpeakerType & { id: number }) {
        try {
            const { id, name, description, photo, title, origin } = req;

            await this.prisma.speaker.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prisma.speaker.update({
                where: {
                    id,
                },
                data: {
                    name, 
                    description, 
                    photo, 
                    title, 
                    origin,
                }
            });

            return res;
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

    async softDelete(id: number) {
        try {
            await this.prisma.speaker.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prisma.speaker.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                }
            });

            return res;
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