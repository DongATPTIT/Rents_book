import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('SEND_MAIL') private queue: Queue,
    ) { }


    async genReport(gmail: string) {
        return this.queue.add(
            'MAIL',
            { gmail },
            {
                priority: 1,
                removeOnComplete: true,
                removeOnFail: true
            },
        );
    }
}