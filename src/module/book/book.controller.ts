import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { BookDto } from "@/dto/book.dto";
import { BookService } from "./book.service";
import { SearchService } from "../elastic-search/elastic-search.service";
import { successMessage } from "@/comon/untils/get.respone";

@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@Controller('book')
export class BookController {
    constructor(
        private bookService: BookService,
        @InjectRedis() private readonly redis: Redis,
        private readonly searchService: SearchService,
    ) { }

    @Post('/create')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Thêm sách" })
    async create(@Body() book: BookDto) {
        try {
            const result = await this.bookService.createBook(book);
            return successMessage(result)
        }
        catch {
            throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiBody({ description: 'Dữ liệu cần cập nhật', type: BookDto })
    @ApiOperation({ summary: "Cập nhật thông tin sách" })
    async update(@Param('id') id: number, @Body() dto: BookDto) {
        try {
            const result = await this.bookService.updateBook(id, dto);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not update ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update-view/:keyword/:id')
    @ApiOperation({ summary: "Cập nhật lượt xem sách" })
    async updateView(@Param('keyword') keyword: string, @Param('id') value: string) {
        try {
            const book = await this.bookService.findByKeyword(keyword, value);
            book[0].borrowCount = book[0].borrowCount + 1;
            const bookUpdate = book[0];
            return await this.bookService.updateBook(bookUpdate.id, { "view": bookUpdate.borrowCount })
        }
        catch {
            throw new HttpException("Can not update view ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('hot-book')
    @ApiOperation({ summary: "Lấy sách có lượt xem nhiều nhất" })
    async getHotBook() {
        try {
            const result = await this.redis.get('hot-book');
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get book ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('all-books')
    @ApiOperation({ summary: "Lấy tất cả sách hiện có" })
    async getAllBooks() {
        try {
            const result = await this.bookService.getAllBook();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get book ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('book-by-id/:id')
    @ApiOperation({ summary: "Lấy sách theo id" })
    async getBookById(@Param('id') id: number) {
        try {
            const result = await this.bookService.getBookById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get book by id ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @ApiOperation({ summary: "Tìm kiếm sách theo từ khóa" })
    @Get('/search-book/:keyword')
    async searchBooks(@Param('keyword') keyword: string): Promise<any> {
        try {
            const result = await this.searchService.searchBooks(keyword);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not search book ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: "Xóa sách theo id" })
    @Delete('delete/:id')
    async deleteBook(@Param('id') id: number) {
        try {
            const result = await this.bookService.deleteById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not delete book ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
