import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { AuthorService } from "./authors.service";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthorDto } from "@/dto/authors.dto";
import { successMessage } from "@/comon/untils/get.respone";


@ApiTags('Authors')
@ApiBearerAuth('JWT-auth')
@Controller('author')
export class AuthorController {
    constructor(
        private authorSerivce: AuthorService,
    ) { }

    @Post('/create')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Thêm tác giả" })
    async create(@Body() book: AuthorDto) {
        try {
            const result = await this.authorSerivce.createAuthorBook(book);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not create ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Cập nhật thông tin tác giả" })
    async update(@Param('id') id: number, @Body() dto: any) {
        try {
            const result = await this.authorSerivce.updateAuthor(id, dto);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not update ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('all')
    @ApiOperation({ summary: "Lấy tất cả tác giả hiện có" })
    async getAllAuthors() {
        try {
            const result = await this.authorSerivce.getAll();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get authors", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('author-by-id/:id')
    @ApiOperation({ summary: "Lấy tác giả theo id" })
    async getAuthorById(@Param('id') id: number) {
        try {
            const result = await this.authorSerivce.getAuthorById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get author by id ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Delete('author-by-id/:id')
    @ApiOperation({ summary: "Xóa tác giả theo id" })
    async deleteById(@Param('id') id: number) {
        try {
            const result = await this.authorSerivce.deleteById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not delete author ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}