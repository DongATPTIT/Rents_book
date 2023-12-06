import { Controller, Get, Post, Body, Param, Request, Patch, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles(UserRoles.ADMIN)
    @Get()
    async findUser() {
        return await this.userService.findAllUser();
    }


    @Get('/:name')
    async findByname(@Param('name') name, @Request() req) {
        return await this.userService.findByName(name);
    }

    @Patch('/:id')
    async update(@Param('id') id, @Body() body) {
        return await this.userService.updateUser(id, body);
    }



    @Delete('/:id')
    async delete(@Param('id') id) {
        return await this.userService.deleteUser(id);
    }

}
