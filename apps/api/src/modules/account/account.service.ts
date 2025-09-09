import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";
import { UserEvent } from "./account.dto";
import { UpdateAccountDto } from "./dtos/account.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async updatePhoto(payload: { photoUrl: string, userId: number }) {
        try {
            const exist = await this.prisma.account.findFirst({
                where: {
                    id: payload.userId,
                }
            });

            if(!exist) throw({ code: 404, message: 'Account not found'});

            await this.prisma.account.update({
                where: {
                    id: exist.id,
                },
                data: {
                    profile: payload.photoUrl,
                }
            });
        } catch(error) {
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

    async getProfile(userId: number) {
        try {
            const exist = await this.prisma.account.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    publicId: true,
                    name: true,
                    nickname: true,
                    phoneNumber: true,
                    email: true,
                    isJSOJ: true,
                    isJoinedWhatsApp: true,
                    isOtherCommunity: true,
                    dob: true,
                    marital: true,
                    marriedAt: true,
                    gender: true,
                    profile: true,
                    createdAt: true,
                    parishOrigin: true, 
                }
            });

            if(!exist) throw({ code: 404, message: 'Account not found'});

            const partner = await this.prisma.accountPartner.findFirst({
                where: {
                    OR: [
                        {
                            husbandId: userId,
                        },
                        {
                            wifeId: userId,
                        }
                    ]
                }
            });

            return {
                profile: exist,
                partner: partner
            };
        } catch(error) {
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

            if(existingRegistration) throw({ code: 400, message: 'Kamu sudah terdaftar di acara ini!'});

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

    async checkInEvent(payload: UserEvent & { id: string }) {
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

            if(!existingRegistration) throw({ code: 400, message: 'Kamu belum terdaftar di acara ini!'});

            if(existingRegistration && existingRegistration.attendance) throw({ code: 400, message: 'Kamu sudah check in tadi'});

            await this.prisma.eventFormRegister.update({
                where: {
                    id: existingRegistration.id,
                },
                data: {
                    attendance: new Date(),
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

    async updateProfile(payload: UpdateAccountDto & { userId: number }) {
        try {
            const existEmail = await this.prisma.account.findFirst({
                where: {
                    email: payload.email,
                }
            });

            if(existEmail && (existEmail.id !== payload.userId)) throw({ code: 400, message: 'Email already used'});

            await this.prisma.account.update({
                where: {
                    id: payload.userId,
                },
                data: {
                    email: payload.email,
                    name: payload.name,
                    nickname: payload.nickname,
                    dob: payload.dob,
                    gender: payload.gender,
                    parishOrigin: payload.parishOrigin,
                    phoneNumber: payload.phoneNumber,
                    marital: payload.marital,
                    marriedAt: payload?.maritalDate || null,
                }
            });

            if(payload.marital?.toLowerCase() === 'married') {
                const existPartner = await this.prisma.accountPartner.findFirst({
                    where: {
                        OR: [
                            {
                                husbandId: payload.userId,
                            },
                            {
                                wifeId: payload.userId,
                            }
                        ]
                    }
                });

                if(existPartner) {
                    this.prisma.accountPartner.update({
                        where: {
                            id: existPartner.id,
                        },
                        data: {
                            husbandName: payload.gender === 'LAKI-LAKI' ? payload.name : payload.partnerName,
                            wifeName: payload.gender !== 'LAKI-LAKI' ? payload.name : payload.partnerName,
                        }
                    })
                } else {
                    this.prisma.accountPartner.create({
                        data: {
                            husbandId: payload.gender === 'LAKI-LAKI' ? existEmail?.id : undefined,
                            wifeId: payload.gender !== 'LAKI-LAKI' ? existEmail?.id : undefined,
                            husbandName: payload.gender === 'LAKI-LAKI' ? payload.name : payload.partnerName,
                            wifeName: payload.gender !== 'LAKI-LAKI' ? payload.name : payload.partnerName,
                        }
                    })
                }
            }

            const token = await this.jwtService.signAsync({ id: existEmail?.publicId,  email: payload.email });

            const user = {
                id: existEmail?.publicId,
                name: payload.name,
                role: existEmail?.roleName || 'follower',
                nickname: payload?.nickname,
                email: payload.email,
            }

            return {
                data: {
                    token,
                    user,
                }
            }
        } catch(error) {
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