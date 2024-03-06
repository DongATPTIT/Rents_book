import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/comon/decorator/public-auth-guard';
import { successMessage } from '@/comon/untils/get.respone';


@ApiTags("Notifications")
@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly sendingNotificationService: NotificationService,
    ) { }
    @Public()
    // @ApiBody({ type: String, description: 'device token', required: true })
    @ApiOperation({ summary: "Gửi thông báo đến thiết bị" })
    @Post('send-notification/')
    async sendNotidication() {
        // const { token } = 
        try {
            const result = await this.sendingNotificationService.sendingNotificationOneUser();
            return successMessage(result);
        }
        catch {
            throw new HttpException("Can not send notification ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
