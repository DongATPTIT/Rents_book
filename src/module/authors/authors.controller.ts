import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from "@nestjs/common";
import { AuthorService } from "./authors.service";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthorDto } from "@/dto/authors.dto";
import { Public } from "@/comon/decorator/public-auth-guard";


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
        return await this.authorSerivce.createAuthorBook(book);
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Cập nhật thông tin tác giả" })
    async update(@Param('id') id: number, @Body() dto: any) {
        try {
            console.log(dto);
            return this.authorSerivce.updateAuthor(id, dto);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Get('all')
    @ApiOperation({ summary: "Lấy tất cả tác giả hiện có" })
    async getAllAuthors() {
        try {
            return await this.authorSerivce.getAll();
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Get('author-by-id/:id')
    @ApiOperation({ summary: "Lấy tác giả theo id" })
    async getAuthorById(@Param('id') id: number) {
        try {
            return await this.authorSerivce.getAuthorById(id);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Delete('author-by-id/:id')
    @ApiOperation({ summary: "Xóa tác giả theo id" })
    async deleteById(@Param('id') id: number) {
        return await this.authorSerivce.deleteById(id)
    }
}