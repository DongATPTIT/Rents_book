import { UserRoles } from "src/databases/utils/constants";

export class UserDto {
    id: number;
    name: string;
    email: string;
    age: number;
    role: UserRoles

}