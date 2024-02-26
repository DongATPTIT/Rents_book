import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RentalTicketsService } from "./rental-tickets.service";
import { RentalticketDto } from "@/dto/rental-tickets.dto";


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
        return await this.rentalTicketService.createRentalTickets(body, body.booksId, body.quantity);
    }

    @Patch('/update/:id')
    @ApiBody({ description: 'Dữ liệu cần cập nhật', type: RentalticketDto })
    @ApiOperation({ summary: "Cập nhật thông tin vé thuê" })
    async update(@Param('id') id: number, @Body() dto: RentalticketDto) {
        try {
            console.log(dto);
            return this.rentalTicketService.update(id, dto);
        }
        catch (error) {
            throw new HttpException("Can not update ", error);
        }
    }

    @Get('all')
    @ApiOperation({ summary: "Lấy tất cả vé thuê hiện có" })
    async getAllAuthors() {
        try {
            return await this.rentalTicketService.getAll();
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Get('get-by-id/:id')
    @ApiOperation({ summary: "Lấy vé thuê theo id" })
    async getById(@Param('id') id: number) {
        try {
            return await this.rentalTicketService.getById(id);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @Delete('delete-by-id/:id')
    @ApiOperation({ summary: "Xóa vé thuê theo id" })
    async deleteById(@Param('id') id: number) {
        return await this.rentalTicketService.deleteById(id)
    }
}