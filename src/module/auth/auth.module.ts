import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/module/user/user.module";
import { UserService } from "src/module/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/databases/entity/user.enity";
import { JwtModule } from "@nestjs/jwt";



@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY_ACCESS_TOKEN,
            // signOptions: { expiresIn: '60d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService],
})
export class AuthModule { }