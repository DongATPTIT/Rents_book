import { Book } from "@/databases/entity/book.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Repository } from "typeorm";


@Injectable()
export class ClouldinaryService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) {
        v2.config({
            cloud_name: "dowooycxh",
            api_key: "882828269482258",
            api_secret: "bHs8Y-GYQlNryOs-7eU3q5moVtk"
        })
    }

    async uploadImage(id: number, filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise(async (resolve, reject) => {
            v2.uploader.upload(filePath, { folder: 'dongnguyen' },
                async (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const book = await this.bookRepository.find({ where: { id: id } });
                        if (!book || book[1] == undefined) {
                            reject(new Error('Book not found'));
                        } else {
                            await this.bookRepository.update(id, { image: res.secure_url });
                            resolve(res);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }
}