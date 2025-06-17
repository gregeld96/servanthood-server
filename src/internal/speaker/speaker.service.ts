import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { generatePaginationValue } from "src/shared/libs/general/generate";
import { Prisma } from "@prisma/client";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";
import { FormSpeakerType, GetSpeakerListType } from "./dtos/speaker.type";


@Injectable()
export class SpeakerInternalService {
    constructor(
        private prismaService: PrismaService
    ) {}

    async getSpeakers(request: GetSpeakerListType) {
        try {
            const { currentPage, limit, sortBy, name } = request;

            const totalCount = await this.prismaService.speaker.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePaginationValue({ limit, currentPage, totalCount });

            const sortOption: Prisma.SpeakerOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.SpeakerOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prismaService.speaker.findMany({
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
            if (error.name === ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR) {
                throw prismaClientError(error)
            } else {
                throw internalServerError(error);
            }
        }
    }

    async create(req: FormSpeakerType) {
        try {
            const { name, description, photo, title, origin } = req;

            const res = await this.prismaService.speaker.create({
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
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async update(req: FormSpeakerType & { id: number }) {
        try {
            const { id, name, description, photo, title, origin } = req;

            await this.prismaService.speaker.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prismaService.speaker.update({
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
                case ErrorCategory.ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async softDelete(id: number) {
        try {
            await this.prismaService.speaker.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prismaService.speaker.update({
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