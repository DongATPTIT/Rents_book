import { Controller, Get, Post, Body, Param, Request, Patch, Delete, ParseIntPipe, ForbiddenException, HttpException, HttpStatus, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";
import { ErrorsInterceptor } from "src/comon/intercepter/logging.intercepter";
import { UpdateDto } from "src/dto/update.dto";
import { IdParamDto } from "src/dto/id-param.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

// @UseInterceptors(new ErrorsInterceptor)
@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get()
    async findUser() {
        try {
            return await this.userService.findAllUser();
        } catch (error) {
            throw new HttpException("error", error);
        }
    }

    @Get('/:keyword')
    async findByname(@Param('keyword') keyword: string, @Request() req) {
        try {
            const data = await this.userService.findByName(keyword);
            return data;
        }
        catch (error) {
            throw new HttpException("error", error);
        }
    }

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: UpdateDto) {
        try {
            return await this.userService.updateUser(id, body);
        }
        catch (error) {
            throw new HttpException("Can not update", error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @ApiResponse({ status: 200, description: "Deleted successfully" })
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
