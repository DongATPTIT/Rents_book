import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Authors } from "./authors.entity";
import { Genres } from "./genres.entity";
import { Borrowing } from "./borrowings.entity";


@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @ManyToOne(() => Authors, author => author.id)
    @JoinColumn({ name: 'authorID' })
    author: Authors;

    @Column({ name: 'authorID' })
    authorID: number;

    @ManyToOne(() => Genres, genres => genres.id)
    @JoinColumn({ name: "genreID" })
    genre: Genres;

    @Column({ name: 'genreID' })
    genreID: number;

    @Column()
    publicationYear: number;

    @Column({ default: 0 })
    borrowCount?: number;

    @Column({ nullable: true })
    image?: string;

    @Column()
    rentalAmount: number;

    @Column({ default: 0 })
    view: number;

    @Column({ default: 0 })
    quantity: number;

    @ManyToMany(() => Borrowing, borrowing => borrowing.books, { cascade: true })
    // @JoinTable()
    borrowings?: Borrowing[]

}