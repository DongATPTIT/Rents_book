import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Public } from "src/comon/decorator/public-auth-guard";
import { successMessage } from "@/comon/untils/get.respone";



@Controller('/mail')
export class MailController {
    constructor(private readonly mailService: MailService) {
    }
    @Public()
    @Get('/sendmail')
    async genReport(@Body() gmail: string) {
        try {
            const result = await this.mailService.genReport(gmail);
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not send mail ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}