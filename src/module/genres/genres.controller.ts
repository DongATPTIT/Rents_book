import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@/comon/decorator/public-auth-guard";
import { GenresService } from "./genres.service";
import { GenresCreateDto } from "@/dto/genres.dto";
import { successMessage } from "@/comon/untils/get.respone";


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
        try {
            const result = await this.genresService.createGenres(genres);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not create genres ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiBody({ type: Object, description: 'Dữ liệu cần cập nhật', required: true })
    @ApiOperation({ summary: "Cập nhật thông tin thể loại" })
    async update(@Param('id') id: number, @Body() dto: any) {
        try {
            const result = await this.genresService.update(id, dto);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not update ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('all')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Lấy tất cả thể loại hiện có" })
    async getAllGenres() {
        try {
            const result = await this.genresService.getAll();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get genres ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('author-by-id/:id')
    @ApiOperation({ summary: "Lấy thể loại theo id" })
    async getGenresById(@Param('id') id: number) {
        try {
            const result = await this.genresService.getGenresById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get genre by id", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Roles(UserRoles.ADMIN)
    @Delete('author-by-id/:id')
    @ApiOperation({ summary: "Xóa thể loại theo id" })
    async deleteById(@Param('id') id: number) {
        try {
            const result = await this.genresService.deleteById(id);
            return successMessage(result);
        } catch {
            throw new HttpException("Can not delete ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}