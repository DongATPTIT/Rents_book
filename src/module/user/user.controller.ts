import { Controller, Get, Post, Body, Param, Request, Patch, Delete, ParseIntPipe, ForbiddenException, HttpException, HttpStatus, UseInterceptors, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";
import { ErrorsInterceptor } from "src/comon/intercepter/logging.intercepter";
import { UpdateDto } from "src/dto/update.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IdParamDto } from "src/dto/id-param.dto";

@UseInterceptors(ClassSerializerInterceptor)
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
    async update(@Param() param: IdParamDto, @Body(new ValidationPipe()) body: UpdateDto) {
        try {
            // const id = param.id.replace('id=', '');
            // console.log(id);
            if (!param || param.id === undefined) {
                throw new HttpException("Invalid id provided", HttpStatus.BAD_REQUEST);
            }
            return await this.userService.updateUser(param.id, body);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @ApiResponse({ status: 200, description: "Deleted successfully" })
    @Delete('/:id')
    async delete(@Param() param: IdParamDto) {
        try {
            return await this.userService.deleteUser(param.id);
        }
        catch (error) {
            throw new HttpException("Can not delete user", error);
        }
    }
}
