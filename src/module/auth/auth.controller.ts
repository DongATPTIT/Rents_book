import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { REQUEST } from "@nestjs/core";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { successMessage } from "@/comon/untils/get.respone";


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
            const result = await this.authService.signIn(user.email, user.password);
            return successMessage(result)
        }
        catch {
            throw new HttpException("Can not sign in ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Public()
    @ApiOperation({ summary: "Đăng kí" })
    @Post('/register')
    async create(@Body() user: SignUpDto) {
        try {
            const result = await this.authService.createUser(user);
            return successMessage(result)
        }
        catch {
            throw new HttpException("Can not register ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/logout')
    @ApiOperation({ summary: "Đăng xuất" })
    async logout(@Req() req) {
        try {
            const user = req.user.sub;
            const result = await this.authService.logOut(user);
            return successMessage(result)
        } catch {
            throw new HttpException("Can not logout", HttpStatus.INTERNAL_SERVER_ERROR);
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
            const result = this.authService.refreshTokens(userId, refresh_token);
            return successMessage(result)
        }
        catch {
            throw new HttpException("Can not get refresh token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}   