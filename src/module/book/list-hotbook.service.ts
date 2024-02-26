import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Redis } from "ioredis";
import { Book } from "src/databases/entity/book.entity";
import { Repository } from "typeorm";


@Injectable()
export class ListHotbookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRedis() private readonly redis: Redis,
    ) { }

    @Cron('10 * * * * *')
    async getHotBook() {
        await this.redis.flushall();
        const dataBook = await this.bookRepository
            .createQueryBuilder('book')
            .select(['book.name', 'book.AuthorID'])
            .orderBy('book.borrowCount', 'DESC')
            .limit(3)
            .getMany();

        await this.redis.set('hot-book', JSON.stringify(dataBook));
        // console.log(await this.redis.get('hot-book'));       
    }

}