import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class IdParamDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    id: string;
}
