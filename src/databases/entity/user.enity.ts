import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../utils/constants";
import { Exclude } from "class-transformer";


@Entity()
export class UserEntity {


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

    @Column({ default: UserRoles.USER })
    role: UserRoles;

    @Exclude()
    @Column({ default: null })
    refreshToken: string;
}