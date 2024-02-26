import { Authors } from "@/databases/entity/authors.entity";
import { AuthorDto } from "@/dto/authors.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Authors)
        private readonly author: Repository<Authors>
    ) { }
    async createAuthorBook(dto: AuthorDto) {
        try {
            const book = await this.author.find({ where: { authorName: dto.authorName } });
            if (book && book[0] !== undefined) {
                throw new Error("Author already exists")
            }
            return await this.author.save(dto)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async updateAuthor(id: number, dto) {
        try {
            const book = await this.author.find({ where: { id: id } });
            if (book[0] === undefined) {
                throw new Error("Book not found");
            }
            await this.author.update(id, dto);
            const bookUpdate = await this.author.find({ where: { id: id } });
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
            const data = await this.author.find();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getAuthorById(id: number) {
        try {
            const data = await this.author.find({ where: { id: id } });
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id: number) {
        try {
            const author = await this.author.find({ where: { id: id } });
            if (!author) {
                throw new Error('author not found');
            }
            return await this.author.remove(author)
        }
        catch (err) {
            throw new Error(err);
        }
    }
}