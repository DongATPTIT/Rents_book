import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "src/databases/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { QueueModule } from "../rabbitmq/rabbitmq.module";


@Module({
    controllers: [UserController],
    providers: [UserService, User],
    imports: [
        TypeOrmModule.forFeature([User]),
        QueueModule
    ],
    exports: [UserService]
})
export class UserModule { }