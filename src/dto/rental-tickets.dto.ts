import { ApiProperty } from "@nestjs/swagger";

export class RentalticketDto {
    @ApiProperty()
    booksId?: number[];

    @ApiProperty()
    UserID?: number;

    @ApiProperty()
    borrowDate?: Date;

    @ApiProperty()
    returnDate?: Date;

    @ApiProperty()
    quantity?: number[];

    @ApiProperty()
    fineAmout?: number;

}