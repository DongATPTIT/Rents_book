import { Body, Controller, Get, HttpException, Param, Post } from "@nestjs/common";
import { BookService } from "./book.service";
import { ApiOperation } from "@nestjs/swagger";
import { BookDto } from "src/dto/book-create.dto";
import { Roles } from "src/comon/decorator/role-decorator";
import { UserRoles } from "src/databases/utils/constants";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { error } from "console";


@Controller('book')
export class BookController {
    constructor(
        private bookService: BookService,
        @InjectRedis() private readonly redis: Redis,
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

    @Post('/update/:id')
    @Roles(UserRoles.ADMIN)
    @ApiOperation({ summary: "Cập nhật thông tin sách" })
    async update(@Param('id') id: string, @Body() dto) {
        try {
            console.log(dto);
            return this.bookService.updateBook(id, dto);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Get('/update-view/:keyword/:id')
    @ApiOperation({ summary: "Cập nhật lượt xem sách" })
    async updateView(@Param('keyword') keyword: string, @Param('id') value: string) {
        const book = await this.bookService.findByKeyword(keyword, value);
        book[0].view = book[0].view + 1;
        const bookUpdate = book[0];
        return await this.bookService.updateBook(bookUpdate.id, { "view": bookUpdate.view })
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
    async getBookById(@Param('id') id: string) {
        try {
            return await this.bookService.getBookById(id);
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
