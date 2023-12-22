import { MailerService } from '@nestjs-modules/mailer';
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';

import { Job } from 'bull';

@Processor('SEND_MAIL')
export class SendMail {
    constructor(private readonly mailerService: MailerService) { }



    @Process('MAIL')
    async generateReport(job: Job<{ gmail?: { gmail?: string } }>) {
        const data = job.data;
        const gmailAddress = data?.gmail?.gmail;

        return await this.mailerService.sendMail({
            to: gmailAddress,
            from: 'Nguyen Viet Dong',
            subject: 'Jobname: ' + job.name,
            text: `Done job ${job.id}`,
        });
    }


    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} `);
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        console.log(`Completed job ${job.id} of type ${job.name}. `);
    }
    @OnQueueFailed()
    onFailed(job: Job) {
        console.log('Failed to send email:', job)
    }
}