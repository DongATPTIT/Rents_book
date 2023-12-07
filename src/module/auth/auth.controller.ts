import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { Request } from "express";
import { UserRoles } from "src/databases/utils/constants";
import { Roles } from "src/comon/decorator/role-decorator";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post()
    async signIn(@Body() user: SignInDto) {
        try {
            return await this.authService.signIn(user.email, user.password);
        }
        catch (error) {
            throw new HttpException('SignIn failed', HttpStatus.UNAUTHORIZED);
        }
    }

    @Public()
    @Post('/signup')
    async create(@Body() user: SignUpDto) {
        try {
            return this.authService.createUser(user)
        }
        catch {
            throw new Error;
        }
    }

    @Public()
    @Post('/logout/:id')
    async logout(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.authService.logOut(id)
        } catch {
            throw new HttpException("Could not logout", HttpStatus.UNAUTHORIZED);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Post('/logout')
    async logOutAll() {
        try {
            return this.authService.logOutAllUsers();
        }
        catch {
            throw new ForbiddenException();
        }
    }

    @Public()
    @Get('/refresh-token')
    refreshTokens(@Req() req: Request) {
        const { user, headers } = req as any;
        const userId = user?.sub;
        const token = headers?.authorization;
        const refresh_token = token.replace('Bearer', '').trim();
        return this.authService.refreshTokens(userId, refresh_token);
    }

}   