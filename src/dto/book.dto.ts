import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class BookDto {
    @ApiProperty()
    name?: string;

    @IsNumber()
    @ApiProperty()
    authorID?: number;

    @IsNumber()
    @ApiProperty()
    genreID?: number;

    @ApiProperty()
    publicationYear?: number;

    @ApiProperty()
    quantity?: number;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    view?: number;

    @ApiProperty()
    rentalAmount?: number;

}