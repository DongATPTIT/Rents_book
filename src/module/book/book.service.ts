import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "src/databases/entity/book.entity";
import { BookDto } from "@/dto/book.dto";
import { Repository, createQueryBuilder } from "typeorm";


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async createBook(dto: BookDto) {
        try {
            const book = await this.bookRepository.find({ where: { name: dto.name } });
            console.log(book)
            console.log(book[0])
            // if (book || book[0] !== undefined) {
            //     throw new Error("Book already exists")
            // }
            const newBook = this.bookRepository.create(dto);
            return await this.bookRepository.save(newBook);
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async updateBook(id: number, dto: BookDto) {
        try {
            const book = await this.bookRepository.find({ where: { id: id } });
            if (book[0] === undefined) {
                throw new Error("Book not found");
            }
            await this.bookRepository.update(id, dto);
            const bookUpdate = await this.bookRepository.find({ where: { id: id } });
            return {
                message: "Update Successfully",
                bookUpdate
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async findByKeyword(keyword: string, value: string) {
        const condition: Record<string, string> = {};
        condition[keyword] = value;
        const data = await this.bookRepository.find({ where: condition })
        return data;
    }

    async getAllBook() {
        try {
            const data = await this.bookRepository
                .createQueryBuilder('book')
                .leftJoinAndSelect('book.author', 'author')
                .leftJoinAndSelect('book.genre', 'genre')
                .getMany();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getBookById(id: number) {
        try {
            const data = await this.bookRepository.find({ where: { id: id }, relations: ["author"] });
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id: number) {
        try {
            const books = await this.bookRepository.find({ where: { id: id } });
            if (!books) {
                throw new Error('author not found');
            }
            return await this.bookRepository.remove(books)
        }
        catch (err) {
            throw new Error(err);
        }
    }
}