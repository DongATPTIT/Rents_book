import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Authors {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    authorName: string;

    @Column()
    nationality: string;

}