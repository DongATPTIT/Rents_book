import { Book } from "@/databases/entity/book.entity";
import { Borrowing } from "@/databases/entity/borrowings.entity";
import { RentalticketDto } from "@/dto/rental-tickets.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

@Injectable()
export class RentalTicketsService {
    constructor(
        @InjectRepository(Borrowing)
        private readonly borrowingRepo: Repository<Borrowing>,
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    async createRentalTickets(data: any, bookId: number[], quantity: number[]) {
        try {
            const borrowing = await this.borrowingRepo.save(data);
            console.log(data)
            const books = await this.bookRepository
                .createQueryBuilder()
                .whereInIds(bookId)
                .getMany()
            // console.log(books)
            if (!books || books.length !== bookId.length) {
                throw new Error('One or more books not found');
            }
            borrowing.books = books;
            // console.log(borrowing.books)
            return await this.borrowingRepo.save(borrowing);
        } catch (error) {
            throw new Error(`Error creating rental tickets: ${error.message}`);
        }
    }

    async update(id: number, dto) {
        try {
            const book = await this.borrowingRepo.find({ where: { borrowingID: id } });
            if (book[0] === undefined) {
                throw new Error("Book not found");
            }
            await this.borrowingRepo.update(id, dto);
            const bookUpdate = await this.borrowingRepo.find({ where: { borrowingID: id } });
            return {
                message: "Update Successfully",
                bookUpdate
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async getAll() {
        try {
            const data = await this.borrowingRepo
                .createQueryBuilder('borrowing')
                .leftJoinAndSelect('borrowing.user', 'user')
                .leftJoinAndSelect('borrowing.books', 'book')
                .leftJoinAndSelect('book.author', 'author')
                .getMany();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getById(id: number) {
        try {
            const data = await this.borrowingRepo
                .createQueryBuilder('borrowing')
                .where("borrowing.borrowingID =:id", { id: id })
                .leftJoinAndSelect('borrowing.user', 'user')
                .leftJoinAndSelect('borrowing.books', 'book')
                .leftJoinAndSelect('book.author', 'author')
                .select(['borrowing.borrowingID', 'borrowing.borrowDate', "borrowing.returnDate", "user.name", "user.email", "author.authorName"])
                .getMany();
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id: number) {
        try {
            const author = await this.borrowingRepo.find({ where: { borrowingID: id } });
            if (!author) {
                throw new Error('author not found');
            }
            return await this.borrowingRepo.remove(author)
        }
        catch (err) {
            throw new Error(err);
        }
    }
}