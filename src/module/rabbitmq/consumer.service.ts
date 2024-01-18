import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { MailService } from '../mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ConsumerService implements OnModuleInit {
    private channelWrapper: ChannelWrapper;
    private readonly logger = new Logger(ConsumerService.name);
    constructor(private emailService: MailerService) {
        const connection = amqp.connect(['amqp://localhost']);
        this.channelWrapper = connection.createChannel();
    }

    public async onModuleInit() {
        try {
            await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
                await channel.assertQueue('emailQueue', { durable: true });
                await channel.consume('emailQueue', async (message) => {
                    if (message) {
                        const content = JSON.parse(message.content.toString());
                        console.log(content);
                        this.logger.log('Received message:', content);
                        console.log(content.email);
                        console.log(content.text);
                        await this.emailService.sendMail({
                            to: content.email,
                            subject: content.subject,
                            text: content.text
                        });
                        channel.ack(message);
                    }
                });
            });
            this.logger.log('Consumer service started and listening for messages.');
        } catch (err) {
            this.logger.error('Error starting the consumer:', err);
        }
    }
}