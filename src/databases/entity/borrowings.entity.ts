import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm";
import { Book } from "./book.entity";
import { User } from "./user.entity";

@Entity()
export class Borrowing {
    @PrimaryGeneratedColumn()
    borrowingID: number;

    @ManyToMany(() => Book, book => book.borrowings, { cascade: false })
    @JoinTable({
        name: "book_borrowing",
        joinColumn: {
            name: "Borrowing",
            referencedColumnName: "borrowingID"
        },
        inverseJoinColumn: {
            name: "Book",
            referencedColumnName: "id"
        }
    })
    books: Book[];

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "UserID" })
    user: User;

    @Column({ name: 'UserID' })
    UserID: number;


    @Column()
    borrowDate: Date;

    @Column()
    returnDate: Date;

    @Column({ default: 0 })
    fineAmount: number;

    @Column({ default: false })
    status: boolean;
}
