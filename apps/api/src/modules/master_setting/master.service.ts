import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { MasterFetchDto } from "./master.dto";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";


@Injectable()
export class MasterSettingService {
    constructor(private prisma: PrismaService) {}

    async getMasterSpecificList(filter: MasterFetchDto){
        const { category, group } = filter;

        try {
            const data = await this.prisma.masterSetting.findMany({
                where: {
                    category,
                    group,
                },
            });
    
            return {
                data
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

    async getMasterSpecific(filter: MasterFetchDto){
        const { category, group } = filter;

        try {
            const data = await this.prisma.masterSetting.findFirstOrThrow({
                where: {
                    category,
                    group,
                },
            });
    
            return {
                data
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
}