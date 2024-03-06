import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RentalTicketsService } from "./rental-tickets.service";
import { RentalticketDto } from "@/dto/rental-tickets.dto";
import { successMessage } from "@/comon/untils/get.respone";


@ApiTags('Gental-tickets')
@ApiBearerAuth('JWT-auth')
@Controller('gental-tickets')
export class GentalTicketController {
    constructor(
        private rentalTicketService: RentalTicketsService,
    ) { }

    @Post('/create')
    @ApiBody({ type: RentalticketDto })
    @ApiOperation({ summary: "Thêm vé thuê" })

    async create(@Body() body: RentalticketDto) {
        try {
            const result = await this.rentalTicketService.createRentalTickets(body, body.booksId);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not create rental ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update/:id')
    @ApiBody({ description: 'Dữ liệu cần cập nhật', type: RentalticketDto })
    @ApiOperation({ summary: "Cập nhật thông tin vé thuê" })
    async update(@Param('id') id: number, @Body() dto: RentalticketDto) {
        try {
            const result = await this.rentalTicketService.update(id, dto);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not update", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('all')
    @ApiOperation({ summary: "Lấy tất cả vé thuê hiện có" })
    async getAllAuthors() {
        try {
            const result = await this.rentalTicketService.getAll();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get rentals ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('get-by-id/:id')
    @ApiOperation({ summary: "Lấy vé thuê theo id" })
    async getById(@Param('id') id: number) {
        try {
            const result = await this.rentalTicketService.getById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not get rental by id ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('delete-by-id/:id')
    @ApiOperation({ summary: "Xóa vé thuê theo id" })
    async deleteById(@Param('id') id: number) {
        try {
            const result = await this.rentalTicketService.deleteById(id);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not delete rental ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}