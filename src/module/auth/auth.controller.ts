import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { SignInDto } from "src/dto/sign-in.dto";
import { SignUpDto } from "src/dto/sign-up.dto";
import { Request } from "express";
import { RolesGuard } from "src/comon/guard/role.guard";
import { UserRoles } from "src/databases/utils/constants";
import { Roles } from "src/comon/decorator/role-decorator";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post()
    async signIn(@Body() user: SignInDto) {
        return await this.authService.signIn(user.email, user.password)
    }

    @Public()
    @Post('/signup')
    async create(@Body() user: SignUpDto) {
        return this.authService.createUser(user)
    }

    @Public()
    @Post('/logout/:id')
    async logout(@Param('id') id: number) {
        return this.authService.logOut(id)
    }

    @Roles(UserRoles.ADMIN)
    @Post('/logout')
    async logOutAll() {
        return this.authService.logOutAllUsers();
    }

    @Get('/refresh-token')
    refreshTokens(@Req() req: Request) {
        const { user, headers } = req as any;
        const userId = user?.sub;
        const token = headers?.authorization;
        const refresh_token = token.replace('Bearer', '').trim();
        return this.authService.refreshTokens(userId, refresh_token);
    }

}   