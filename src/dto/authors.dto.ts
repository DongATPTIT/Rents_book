import { ApiProperty } from "@nestjs/swagger";

export class AuthorDto {
    @ApiProperty()
    authorName: string;

    @ApiProperty()
    nationality: string;
}