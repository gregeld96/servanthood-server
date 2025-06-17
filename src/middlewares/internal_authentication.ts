import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class InternalApiTokenCheck implements NestMiddleware {
    constructor(private readonly jwtService: JwtService){}

    async use(req: Request, res: Response, next: NextFunction){
        try {
            if(req.headers && req.headers.authorization){
                const token = this.extractTokenFromHeader(req);
    
                if(!token) throw new UnauthorizedException('Not Authorized');
    
                const data = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET_INTERNAL
                });
    
                if(!data) throw { message: 'Not Authorized' };
    
                req['authentication'] = data;
    
                next();
            } else {
                throw { message: 'Token Not Found' };
            }
        } catch(error: any) {
            next({
                error: {
                    code: 401,
                    message: error.message,
                }
            })
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
}