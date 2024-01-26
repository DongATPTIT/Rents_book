import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "src/databases/entity/book.entity";
import { BookDto } from "src/dto/book-create.dto";
import { Repository } from "typeorm";


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async createBook(dto: BookDto) {
        try {
            const book = await this.bookRepository.find({ where: { name: dto.name } });
            if (book && book[0] !== undefined) {
                throw new Error("Book already exists")
            }
            return await this.bookRepository.save(dto)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async updateBook(id: number, dto) {
        try {
            const book = await this.bookRepository.find({ where: { id: id } });
            console.log(book)
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
        console.log(condition);
        const data = await this.bookRepository.find({ where: condition })
        console.log(data);
        return data;
    }

    async getAllBook() {
        try {
            const data = await this.bookRepository.find();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getBookById(id: number) {
        try {
            const data = await this.bookRepository.find({ where: { id: id } });
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}