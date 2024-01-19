import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/module/user/user.module";
import { UserService } from "src/module/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/databases/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { QueueModule } from "../rabbitmq/rabbitmq.module";



@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY_ACCESS_TOKEN,
            // signOptions: { expiresIn: '60d' },
        }),
        QueueModule
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService],
})
export class AuthModule { }