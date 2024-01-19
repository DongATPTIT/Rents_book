import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";


@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 500 })
    name: string;

    @Column()
    author: string;

    @Column()
    genre: string;

    @Column()
    publisher: string;

    @Column({ type: 'datetime' })
    publication_date: Date;

    @Column({ default: 0 })
    view?: number;
}