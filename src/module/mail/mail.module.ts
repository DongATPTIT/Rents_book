import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { BullModule } from "@nestjs/bull";
import { SendMail } from "./send-mail-job"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    requireTLS: false,
                    auth: {
                        user: 'namnguyen105202@gmail.com',
                        pass: 'qgwt sxsc gxng zlx a',
                    },
                    service: 'gmail',
                    secure: false, // STARTTLS
                },
            }),
        }),
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

