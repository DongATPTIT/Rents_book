import { Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { SearchService } from './elastic-search.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/databases/entity/book.entity';
import { Public } from '@/comon/decorator/public-auth-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { successMessage } from '@/comon/untils/get.respone';

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
        try {
            const result = await this.searchService.sortByView();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not sort book ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('update')
    async updateData() {
        try {
            const result = await this.searchService.syncData();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not update data ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}