import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserRoles } from "src/databases/utils/constants";

export class SignUpDto {
    @ApiProperty()
    name: string;


    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    role: UserRoles;
}