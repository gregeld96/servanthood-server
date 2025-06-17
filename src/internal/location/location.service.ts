import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/libs/prisma/prisma.service";
import { FormLocationType, GetLocationListType } from "./dtos/location.type";
import { generatePaginationValue } from "src/shared/libs/general/generate";
import { Prisma } from "@prisma/client";
import ErrorCategory from "src/shared/constants/error";
import { prismaNotFound, prismaClientError, internalServerError } from "src/shared/libs/general/error";


@Injectable()
export class LocationInternalService {
    constructor(
        private prismaService: PrismaService
    ) {}

    async getLocations(request: GetLocationListType) {
        try {
            const { currentPage, limit, sortBy, name } = request;

            const totalCount = await this.prismaService.location.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePaginationValue({ limit, currentPage, totalCount });

            const sortOption: Prisma.LocationOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.LocationOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prismaService.location.findMany({
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

    async create(req: FormLocationType) {
        try {
            const { name, description, latitude, longitude, address, linkMap } = req;

            const res = await this.prismaService.location.create({
                data: {
                    name, 
                    description, 
                    latitude, 
                    longitude, 
                    address, 
                    linkMap
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

    async update(req: FormLocationType & { id: number }) {
        try {
            const { id, name, description, latitude, longitude, address, linkMap } = req;

            await this.prismaService.location.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prismaService.location.update({
                where: {
                    id,
                },
                data: {
                    name, 
                    description, 
                    latitude, 
                    longitude, 
                    address, 
                    linkMap
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
            await this.prismaService.location.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prismaService.location.update({
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