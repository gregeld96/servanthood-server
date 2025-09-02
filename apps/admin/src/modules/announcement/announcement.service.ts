import { Injectable } from "@nestjs/common";
import { GetProjectAnnouncementListType, FormProjectAnnouncementType } from "./dtos/announcement.type";
import { PrismaService } from "libs/database";
import { Prisma } from "@prisma/client";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";
import { generatePagination } from "libs/common/src/utils/generate";

@Injectable()
export class AnnouncementService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getAnnouncements(request: GetProjectAnnouncementListType) {
        try {
            const { page, limit, sortBy, name, category } = request;

            const totalCount = await this.prisma.announcement.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                    ...(category && { category: { contains: category, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.AnnouncementOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.AnnouncementOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.announcement.findMany({
                where: {
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

    async create(request: FormProjectAnnouncementType) {
        try {
            const { name, category, description, urlLink, banner, isInternal } = request;

            const announcement = await this.prisma.announcement.create({
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
                case ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async update(request: FormProjectAnnouncementType & { id: string }) {
        try {
            const { name, category, description, urlLink, banner, isInternal, id } = request;

            await this.prisma.announcement.findFirstOrThrow({
                where: {
                    id: Number(id),
                }
            });

            const announcement = await this.prisma.announcement.update({
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
                case ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async delete(id: string) {
        try {
            await this.prisma.announcement.findFirstOrThrow({
                where: {
                    id: Number(id),
                }
            });

            const announcement = await this.prisma.announcement.delete({
                where: {
                    id: Number(id),
                },
            });

            return announcement;
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