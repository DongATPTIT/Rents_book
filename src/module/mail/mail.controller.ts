import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Public } from "src/comon/decorator/public-auth-guard";



@Controller('/mail')
export class MailController {
    constructor(private readonly mailService: MailService) {
    }
    @Public()
    @Get('/sendmail')
    async genReport(@Body() gmail: string) {
        return this.mailService.genReport(gmail);
    }
}