import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchService } from './elastic-search.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/databases/entity/book.entity';
import { Public } from '@/comon/decorator/public-auth-guard';

@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        @InjectRepository(Book) private readonly book: Book
    ) { }

    // @Public()
    // @Get('/:query')
    // async searchBooks(@Param('query') query: string): Promise<any> {
    //     return this.searchService.searchBooks(query);
    // }

    @Public()
    @Post('/async-data')
    async asyncdata() {
        return this.searchService.syncData();
    }

    @Public()
    @Get('/sort/sort-by-views')
    async sortByViews() {
        return this.searchService.sortByView();
    }
}