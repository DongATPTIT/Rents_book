import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { REQUEST } from "@nestjs/core";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @ApiOperation({ summary: "Đăng nhập" })
    @Post('/login')
    async signIn(@Body() user: SignInDto) {
        try {
            return await this.authService.signIn(user.email, user.password);
        }
        catch (error) {
            throw new HttpException('SignIn failed', error);
        }
    }

    @Public()
    @ApiOperation({ summary: "Đăng kí" })
    @Post('/register')
    async create(@Body() user: SignUpDto) {
        try {
            return this.authService.createUser(user)
        }
        catch (error) {
            throw new error;
        }
    }

    @Post('/logout')
    @ApiOperation({ summary: "Đăng xuất" })
    async logout(@Req() req) {
        try {
            const user = req.user.sub;
            return await this.authService.logOut(user);
        } catch (error) {
            throw new HttpException("Could not logout", error);
        }
    }

    @ApiOperation({ summary: "Refresh access token" })
    @Post('/refresh-token')
    refreshTokens(@Req() req) {
        try {
            const user = req.user;
            const userId = user?.sub;
            const token = req?.headers.authorization;
            const refresh_token = token.replace('Bearer', '').trim();
            return this.authService.refreshTokens(userId, refresh_token);
        }
        catch (error) {
            throw new error;
        }
    }

}   