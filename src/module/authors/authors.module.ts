import { Module } from "@nestjs/common";
import { AuthorService } from "./authors.service";
import { AuthorController } from "./authors.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Authors } from "@/databases/entity/authors.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Authors])],
    providers: [AuthorService],
    controllers: [AuthorController]
})
export class AuthorModule { }