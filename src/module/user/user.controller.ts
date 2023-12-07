import { Controller, Get, Post, Body, Param, Request, Patch, Delete, ParseIntPipe, ForbiddenException, HttpException, HttpStatus, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";
import { error } from "console";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles(UserRoles.ADMIN)
    @Get()
    async findUser() {
        try {
            return await this.userService.findAllUser();
        } catch (error) {
            throw new HttpException("error", error);
        }
    }

    @Get('/:name')
    async findByname(@Param('name') name: string, @Request() req) {
        try {
            const a = await this.userService.findByName(name);
            return a;
        }
        catch (error) {
            throw new HttpException("error", error);
        }
    }

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body) {
        try {
            return await this.userService.updateUser(id, body);
        }
        catch (error) {
            throw new HttpException("Can not update", error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.userService.deleteUser(id);
        }
        catch (error) {
            throw new HttpException("Can not delete user", error);
        }
    }
}
