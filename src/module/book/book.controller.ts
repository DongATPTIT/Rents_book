import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { Roles } from "@/comon/decorator/role-decorator";
import { UserRoles } from "@/databases/utils/constants";
import { BookDto } from "@/dto/book.dto";
import { BookService } from "./book.service";
import { SearchService } from "../elastic-search/elastic-search.service";


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
            return await this.bookService.createBook(book);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Patch('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiBody({ description: 'Dữ liệu cần cập nhật', type: BookDto })
    @ApiOperation({ summary: "Cập nhật thông tin sách" })
    async update(@Param('id') id: number, @Body() dto: BookDto) {
        try {
            console.log(dto);
            return this.bookService.updateBook(id, dto);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Patch('/update-view/:keyword/:id')
    @ApiOperation({ summary: "Cập nhật lượt xem sách" })
    async updateView(@Param('keyword') keyword: string, @Param('id') value: string) {
        const book = await this.bookService.findByKeyword(keyword, value);
        book[0].borrowCount = book[0].borrowCount + 1;
        const bookUpdate = book[0];
        return await this.bookService.updateBook(bookUpdate.id, { "view": bookUpdate.borrowCount })
    }

    @Get('hot-book')
    @ApiOperation({ summary: "Lấy sách có lượt xem nhiều nhất" })
    async getHotBook() {
        try {
            return await this.redis.get('hot-book');
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Get('all-books')
    @ApiOperation({ summary: "Lấy tất cả sách hiện có" })
    async getAllBooks() {
        try {
            return await this.bookService.getAllBook();
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Get('book-by-id/:id')
    @ApiOperation({ summary: "Lấy sách theo id" })
    async getBookById(@Param('id') id: number) {
        try {
            return await this.bookService.getBookById(id);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    @ApiOperation({ summary: "Tìm kiếm sách theo từ khóa" })
    @Get('/search-book/:keyword')
    async searchBooks(@Param('keyword') keyword: string): Promise<any> {
        return this.searchService.searchBooks(keyword);
    }

    @ApiOperation({ summary: "Xóa sách theo id" })
    @Delete('delete/:id')
    async deleteBook(@Param('id') id: number) {
        return await this.bookService.deleteById(id);
    }
}
