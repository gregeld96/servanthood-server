import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "libs/database";

export interface JwtAuthOptions {
    secret: string;
    attachProperty?: string;
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly options: JwtAuthOptions
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.headers?.authorization) {
                const token = this.extractTokenFromHeader(req);

                if (!token) throw new UnauthorizedException("Not Authorized");

                const data = await this.jwtService.verifyAsync(token, {
                    secret: this.options.secret,
                });

                if (!data) throw new UnauthorizedException("Not Authorized");

                const user = await this.prisma.account.findFirstOrThrow({
                    where: { email: data.email },
                });

                req.authentication = data;
                req.user = {
                    userId: user.id,
                    publicId: user.publicId,
                    role: user.roleName || 'follower',
                    name: user.name,
                    dob: user.dob,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    parishOrigin: user.parishOrigin,
                }

                return next();
            } else {
                throw new UnauthorizedException("Token Not Found in Header");
            }
        } catch (error: any) {
            next({
                code: 401,
                message: error.message || "Unauthorized",
            });
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}