import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { ClouldinaryService } from "./clouldinary.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "@/databases/entity/book.entity";


@Module({
    imports: [
        MulterModule.register({
            dest: '/uploads'
        }),
        TypeOrmModule.forFeature([Book]),
    ],
    controllers: [UploadController],
    providers: [ClouldinaryService]
})
export class UploadModule { }