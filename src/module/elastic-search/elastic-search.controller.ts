import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SearchService } from './elastic-search.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/databases/entity/book.entity';
import { Public } from '@/comon/decorator/public-auth-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth('JWT-auth')
@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
    ) { }
    @Public()
    @Get('/sort/sort-by-views')
    async sortByViews() {
        return this.searchService.sortByView();
    }

    @Patch('update')
    async updateData() {
        return this.searchService.syncData();
    }
}