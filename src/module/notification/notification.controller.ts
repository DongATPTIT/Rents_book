import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/comon/decorator/public-auth-guard';


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
        // const { token } = body
        return await this.sendingNotificationService.sendingNotificationOneUser()
    }
}
