import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "src/comon/decorator/public-auth-guard";
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContextHost): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.SECRET_KEY_ACCESS_TOKEN,
                });
                if (payload) {
                    request['user'] = payload;
                } else {
                    throw new Error('Invalid access token');
                }
            } catch {
                try {
                    const payload_refresh_token = await this.jwtService.verifyAsync(token, {
                        secret: process.env.SECRET_KEY_REFRESH_TOKEN,
                    });
                    if (payload_refresh_token) {
                        request['user'] = payload_refresh_token;
                    } else {
                        throw new Error('Invalid refresh token');
                    }
                } catch {
                    throw new UnauthorizedException();
                }
            }
        }
        catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
