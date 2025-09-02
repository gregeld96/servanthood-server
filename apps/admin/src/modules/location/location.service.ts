import { Injectable } from "@nestjs/common";
import { FormLocationType, GetLocationListType } from "./dtos/location.type";
import { Prisma } from "@prisma/client";
import { generatePagination } from "libs/common/src/utils/generate";
import { PrismaService } from "libs/database";
import { ErrorName, internalServerError, prismaClientError, prismaNotFound } from "libs/common";


@Injectable()
export class LocationService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getLocations(request: GetLocationListType) {
        try {
            const { page, limit, sortBy, name } = request;

            const totalCount = await this.prisma.location.count({
                where: {
                    ...(name && { name: { contains: name, mode: 'insensitive' } }),
                },
            });

            const { take, skip, totalPage } = generatePagination(page, limit, totalCount);

            const sortOption: Prisma.LocationOrderByWithRelationInput = {}

            if (sortBy) {
                const sort = sortBy.startsWith('-') ? 'desc' : 'asc';
                const sortField = (sortBy.startsWith('-') ? sortBy.substring(1) : sortBy) as keyof Prisma.LocationOrderByWithRelationInput;

                sortOption[sortField] = sort;
            }

            const items = await this.prisma.location.findMany({
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

    async create(req: FormLocationType) {
        try {
            const { name, description, latitude, longitude, address, linkMap } = req;

            const res = await this.prisma.location.create({
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
                case ErrorName.PRISMA_NOT_FOUND:
                    throw prismaNotFound();
                case ErrorName.PRISMA_CLIENT_ERROR:
                    throw prismaClientError(error);
                default:
                    throw internalServerError(error);
            }
        }
    }

    async update(req: FormLocationType & { id: number }) {
        try {
            const { id, name, description, latitude, longitude, address, linkMap } = req;

            await this.prisma.location.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prisma.location.update({
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
            await this.prisma.location.findFirstOrThrow({
                where: {
                    id
                }
            });

            const res = await this.prisma.location.update({
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