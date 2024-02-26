import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentalTicketsService } from "./rental-tickets.service";
import { GentalTicketController } from "./rental-tickets.controller";
import { Borrowing } from "@/databases/entity/borrowings.entity";
import { Book } from "@/databases/entity/book.entity";



@Module({
    imports: [TypeOrmModule.forFeature([Borrowing, Book])],
    providers: [RentalTicketsService],
    controllers: [GentalTicketController]
})
export class GentalTicketsModule { }