import { Authors } from "@/databases/entity/authors.entity";
import { Genres } from "@/databases/entity/genres.entity";
import { AuthorDto } from "@/dto/authors.dto";
import { GenresCreateDto } from "@/dto/genres.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GenresService {
    constructor(
        @InjectRepository(Genres)
        private readonly genresRepo: Repository<Genres>
    ) { }
    async createGenres(dto: GenresCreateDto) {
        try {
            const genres = await this.genresRepo.find({ where: { genresName: dto.genresName } });
            if (genres && genres[0] !== undefined) {
                throw new Error("Genres already exists")
            }
            return await this.genresRepo.save(dto)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async update(id: number, dto) {
        try {
            const book = await this.genresRepo.find({ where: { id: id } });
            if (book[0] === undefined) {
                throw new Error("Book not found");
            }
            await this.genresRepo.update(id, dto);
            const bookUpdate = await this.genresRepo.find({ where: { id: id } });
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
            const data = await this.genresRepo.find();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getGenresById(id: number) {
        try {
            const data = await this.genresRepo.find({ where: { id: id } });
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id: number) {
        try {
            const author = await this.genresRepo.find({ where: { id: id } });
            if (!author) {
                throw new Error('author not found');
            }
            return await this.genresRepo.remove(author)
        }
        catch (err) {
            throw new Error(err);
        }
    }
}