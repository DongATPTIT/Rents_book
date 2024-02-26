import { ApiProperty } from "@nestjs/swagger";

export class GenresCreateDto {

    @ApiProperty()
    genresName: string;
}