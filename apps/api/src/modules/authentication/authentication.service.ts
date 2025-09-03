import { Injectable } from "@nestjs/common";
import { PrismaService } from "libs/database";
import { JwtService } from "@nestjs/jwt";
import { v7 } from "uuid";
import { checkPassword, hashPassword, ErrorName, prismaNotFound, prismaClientError, internalServerError } from "libs/common";
import { CreateAccountDto, CredentialDto } from "./authentication.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService
    ) {}

    async login(payload: CredentialDto) {
        try {
            const user = await this.prisma.account.findFirst({
                where: {
                    email: payload.email,
                }
            });

            if(!user) throw({ code: 400, message: 'Email or password is incorrect'});

            const isPasswordValid = checkPassword(payload.password, user.password);

            if(!isPasswordValid) throw({ code: 400, message: 'Email or password is incorrect'});

            const token = await this.jwtService.signAsync({ id: user.publicId,  email: user.email });

            const resUser = {
                id: user.publicId,
                name: user.name,
                role: user.roleName,
                nickname: user?.nickname || 'follower',
                email: user.email,
            }

            return {
                data: {
                    token,
                    user: resUser,
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

    async register(payload: CreateAccountDto) {
        try {
            const existEmail = await this.prisma.account.findFirst({
                where: {
                    email: payload.email,
                }
            });

            if(existEmail) throw({ code: 400, message: 'Email already registered'});

            const publicId = v7();

            const saltRounds = this.config.get<number>('SALT_KEY', 10);

            const res = await this.prisma.account.create({
                data: {
                    publicId: publicId,
                    email: payload.email,
                    name: payload.name,
                    password: hashPassword(payload.password, saltRounds),
                    nickname: payload.nickname,
                    dob: payload.dob,
                    gender: payload.gender,
                    parishOrigin: payload.parishOrigin,
                    phoneNumber: payload.phoneNumber,
                    marital: payload.marital,
                    marriedAt: payload.maritalDate,
                }
            });

            if(payload.marital?.toLowerCase() === 'married') {
                this.prisma.accountPartner.create({
                    data: {
                        husbandId: payload.gender === 'LAKI-LAKI' ? res.id : undefined,
                        wifeId: payload.gender !== 'LAKI-LAKI' ? res.id : undefined,
                        husbandName: payload.gender === 'LAKI-LAKI' ? payload.name : payload.partnerName,
                        wifeName: payload.gender !== 'LAKI-LAKI' ? payload.name : payload.partnerName,
                    }
                })
            }

            if(payload.socialMediaInstagram) {
                this.prisma.socialMediaAccount.create({
                    data: {
                        type: 'instagram',
                        username: payload.socialMediaInstagram,
                        accountId: res.id,
                        link: null,
                    }
                })
            }

            const token = await this.jwtService.signAsync({ id: publicId,  email: payload.email });

            const user = {
                id: res.publicId,
                name: res.name,
                role: res.roleName,
                nickname: res?.nickname || 'follower',
                email: res.email,
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