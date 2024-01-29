import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/databases/entity/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private readonly elasticsearchService: ElasticsearchService
    ) { }


    async searchBooks(query: string): Promise<any> {
        return await this.elasticsearchService.search({
            index: 'books',
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['name', 'author'],
                    },
                },
            },
        });
    }

    @Cron('10 * * * * *')
    async syncData() {
        const dataToSync = await this.bookRepository.find();
        console.log(dataToSync)
        await this.elasticsearchService.indices.delete({
            index: 'books',
        });
        for (const data of dataToSync) {
            await this.elasticsearchService.index({
                index: 'books',
                body: data,
            });
        }
        console.log('Data synchronization completed.');
    }

    async sortByView(): Promise<any> {
        return await this.elasticsearchService.search({
            index: 'books',
            size: 10,
            body: {
                query: {
                    "match_all": {}
                },
                sort: [{ "view": "desc" }]
            }
        });
    }





}
