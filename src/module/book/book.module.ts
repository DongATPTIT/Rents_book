import { Module } from "@nestjs/common";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "src/databases/entity/book.entity";
import { ScheduleModule } from "@nestjs/schedule";
import { ListHotbookService } from "./list-hotbook.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Book]),
        ScheduleModule.forRoot(),
    ],
    controllers: [BookController],
    providers: [BookService, ListHotbookService]
})
export class BookModule { }