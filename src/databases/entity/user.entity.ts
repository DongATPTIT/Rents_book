import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../utils/constants";
import { Exclude } from "class-transformer";
import { Borrowing } from "./borrowings.entity";


@Entity()
export class User {


    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 500 })
    name: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    age: number;

    @Exclude()
    @Column({ default: UserRoles.USER })
    role: UserRoles;

    @Exclude()
    @Column({ default: null })
    refreshToken: string;

    // @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
    // borrowings: Borrowing[];
}