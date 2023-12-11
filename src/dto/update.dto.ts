import { ApiProperty } from "@nestjs/swagger";

export class UpdateDto {
    @ApiProperty()
    name?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    password?: string;

    @ApiProperty()
    age?: number;
}