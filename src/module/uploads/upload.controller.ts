import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ClouldinaryService } from "./clouldinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";



@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@Controller()
export class UploadController {
    constructor(private readonly uploadService: ClouldinaryService) { }


    @ApiOperation({ summary: 'Tải lên tệp hình ảnh' })
    @Post('/upload/:id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        try {
            const result = await this.uploadService.uploadImage(id, file.path);
            return result;
        } catch (error) {
            console.log(error)
            throw new Error("upload fail");
        }
    }
}