import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

export class BookDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    genre: string;

    @ApiProperty()
    publisher: string;

    @ApiProperty()
    publication_date: Date;

}