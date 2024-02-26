import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@/comon/decorator/public-auth-guard";
import { GenresService } from "./genres.service";
import { GenresCreateDto } from "@/dto/genres.dto";


@ApiTags('Genres')
@ApiBearerAuth('JWT-auth')
@Controller('genres')
export class GenresController {
    constructor(
        private genresService: GenresService,
    ) { }

    @Post('/create')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Thêm thể loại" })
    async create(@Body() genres: GenresCreateDto) {
        return await this.genresService.createGenres(genres);
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiBody({ type: Object, description: 'Dữ liệu cần cập nhật', required: true })
    @ApiOperation({ summary: "Cập nhật thông tin thể loại" })
    async update(@Param('id') id: number, @Body() dto: any) {
        try {
            console.log(dto);
            return this.genresService.update(id, dto);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Get('all')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Lấy tất cả thể loại hiện có" })
    async getAllGenres() {
        try {
            return await this.genresService.getAll();
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Get('author-by-id/:id')
    @ApiOperation({ summary: "Lấy thể loại theo id" })
    async getGenresById(@Param('id') id: number) {
        try {
            return await this.genresService.getGenresById(id);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Delete('author-by-id/:id')
    @ApiOperation({ summary: "Xóa thể loại theo id" })
    async deleteById(@Param('id') id: number) {
        return await this.genresService.deleteById(id)
    }
}