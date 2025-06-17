import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { generatePaginationValue } from "src/shared/libs/general/generate";
import { Prisma } from "@prisma/client";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";
import { GetProjectAnnouncementListType, FormProjectAnnouncementType } from "./dtos/announcement.type";

@Injectable()
export class AnnouncementInternalService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getAnnouncements(request: GetProjectAnnouncementListType) {
        try {
            const { currentPage, limit, sortBy, name, category } = request;

            const totalCount = await this.prismaService.announcement.count({
                where: {
                    isInternal: true,
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    ...(category && { category: { contains: category, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePaginationValue({ limit, currentPage, totalCount });

            const sortOption: Prisma.AnnouncementOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.AnnouncementOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prismaService.announcement.findMany({
                where: {
                    isInternal: true,
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    ...(category && { category: { contains: category, mode: 'insensitive' } }),
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

    async create(request: FormProjectAnnouncementType) {
        try {
            const { name, category, description, urlLink, banner, isInternal } = request;

            const announcement = await this.prismaService.announcement.create({
                data: {
                    name,
                    category,
                    description,
                    urlLink,
                    banner,
                    isInternal,
                },
            });

            return announcement;
        } catch (error: any) {
            switch (error.name) {
                case ErrorCategory.ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async update(request: FormProjectAnnouncementType & { id: string }) {
        try {
            const { name, category, description, urlLink, banner, isInternal, id } = request;

            await this.prismaService.announcement.findFirstOrThrow({
                where: {
                    id: Number(id),
                }
            });

            const announcement = await this.prismaService.announcement.update({
                where: {
                    id: Number(id),
                },
                data: {
                    name,
                    category,
                    description,
                    urlLink,
                    banner,
                    isInternal,
                },
            });

            return announcement;
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

    async delete(id: string) {
        try {
            await this.prismaService.announcement.findFirstOrThrow({
                where: {
                    id: Number(id),
                }
            });

            const announcement = await this.prismaService.announcement.delete({
                where: {
                    id: Number(id),
                },
            });

            return announcement;
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