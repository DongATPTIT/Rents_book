import { UserRoles } from "src/databases/utils/constants";

export class UserDto {

    name: string;
    email: string;
    age: number;
    role: UserRoles
}