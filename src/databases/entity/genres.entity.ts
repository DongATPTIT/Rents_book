import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { Exclude } from "class-transformer";


@Entity()
export class Genres {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    genresName: string;

}