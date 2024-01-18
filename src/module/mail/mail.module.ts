import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { BullModule } from "@nestjs/bull";
import { SendMail } from "./send-mail-job"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            }
        }),
        BullModule.registerQueue({
            // configKey: "config",
            name: "SEND_MAIL",
        })
        ,
    ],
    controllers: [MailController],
    providers: [MailService, SendMail]
})
export class MailModule { }

