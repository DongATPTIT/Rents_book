import { IsEmail, IsNotEmpty } from "class-validator";
import { UserRoles } from "src/databases/utils/constants";

export class SignUpDto {
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
    age: number;
    role: UserRoles;
}