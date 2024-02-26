import { Controller, Get, Post, Body, Param, Request, Patch, Delete, ParseIntPipe, ForbiddenException, HttpException, HttpStatus, UseInterceptors, ValidationPipe, ClassSerializerInterceptor, Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IdParamDto } from "src/dto/id-param.dto";
import { Public } from "src/comon/decorator/public-auth-guard";
import { UserDto } from "@/dto/user.dto";


@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')

export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Admin lấy tất cả user" })
    @Get()
    async findUser() {
        try {
            return await this.userService.findAllUser();
        } catch (error) {
            throw new HttpException("error", error);
        }
    }
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Admin tìm kiếm người dùng theo keyword" })
    @Get('/:keyword')
    async findByname(@Param('keyword') keyword: string) {
        try {
            const data = await this.userService.findByName(keyword);
            return data;
        }
        catch (error) {
            throw new HttpException("error", error);
        }
    }
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Admin thay đổi thông tin người dùng " })
    @Patch('/:id')
    async update(@Param() param: IdParamDto, @Body(new ValidationPipe()) body: UserDto) {
        try {
            return await this.userService.updateUser(param.id, body);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Admin xóa người dùng" })
    @Delete('/:id')
    async delete(@Param() param: IdParamDto) {
        try {
            return await this.userService.deleteUser(param.id);
        }
        catch (error) {
            throw new HttpException("Can not delete user", error);
        }
    }
    // @Public()
    @Get('/send/sendmail')
    async sendMail(@Body() user: any) {
        return await this.userService.sendMail(user);
    }
}
