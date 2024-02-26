import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Genres } from "@/databases/entity/genres.entity";
import { GenresService } from "./genres.service";
import { GenresController } from "./genres.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Genres])],
    providers: [GenresService],
    controllers: [GenresController]
})
export class GenresModule { }