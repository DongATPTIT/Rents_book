import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../utils/constants";


@Entity()
export class UserEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    age: number;

    @Column({ default: UserRoles.USER })
    role: UserRoles;

    @Column({ default: null })
    refreshToken: string;
}